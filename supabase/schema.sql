-- 1. EXTENSIONS
create extension if not exists btree_gist;

-- 2. USERS TABLE (Extends Supabase auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- 3. CARS TABLE
create table public.cars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  model text not null,
  year int not null,
  category text not null check (category in ('MPV', 'SUV', 'City Car', 'Premium')),
  transmission text not null check (transmission in ('Automatic', 'Manual')),
  fuel text not null check (fuel in ('Petrol', 'Diesel', 'Hybrid')),
  seats int not null,
  price numeric not null,
  rating numeric not null default 5.0,
  reviews int not null default 0,
  available boolean not null default true,
  thumbnail text not null,
  images text[] not null default '{}',
  features text[] not null default '{}',
  description text not null,
  created_at timestamptz default now()
);

-- 4. BOOKINGS TABLE
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  car_id uuid not null references public.cars(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  total_price numeric not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- 5. PAYMENTS TABLE
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  amount numeric not null,
  method text, -- bank_transfer, qris, ewallet
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'expired')),
  transaction_id text, -- Midtrans transaction_id
  created_at timestamptz default now()
);

-- 6. REVIEWS TABLE
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  car_id uuid not null references public.cars(id) on delete cascade,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- 7. DOCUMENTS TABLE
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('ktp', 'sim')),
  file_url text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Verified', 'Rejected')),
  created_at timestamptz default now()
);

-- 8. INDEXES FOR PERFORMANCE
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_car_dates on public.bookings (car_id, start_date, end_date);
create index if not exists idx_cars_status on public.cars (available);
create index if not exists idx_payments_booking_id on public.payments(booking_id);

-- 9. AUTOMATIC USER SYNC TRIGGER FROM AUTH.USERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 10. SECURITY DEFINER HELPER TO AVOID RLS RECURSION
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.users enable row level security;
alter table public.cars enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.documents enable row level security;

-- USERS POLICIES
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.users
  for all using (public.is_admin());

-- CARS POLICIES
create policy "Anyone can view cars" on public.cars
  for select using (true);

create policy "Admins can manage cars" on public.cars
  for all using (public.is_admin());

-- BOOKINGS POLICIES
create policy "Users can view their own bookings" on public.bookings
  for select using (auth.uid() = user_id);

create policy "Users can create their own bookings" on public.bookings
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own bookings" on public.bookings
  for update using (auth.uid() = user_id);

create policy "Admins can manage all bookings" on public.bookings
  for all using (public.is_admin());

-- PAYMENTS POLICIES
create policy "Users can view their own payments" on public.payments
  for select using (
    exists (
      select 1 from public.bookings
      where bookings.id = payments.booking_id and bookings.user_id = auth.uid()
    )
  );

create policy "Admins can manage all payments" on public.payments
  for all using (public.is_admin());

-- REVIEWS POLICIES
create policy "Anyone can view reviews" on public.reviews
  for select using (true);

create policy "Users can create their own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "Admins can manage all reviews" on public.reviews
  for all using (public.is_admin());

-- DOCUMENTS POLICIES
create policy "Users can view their own documents" on public.documents
  for select using (auth.uid() = user_id);

create policy "Users can upload their own documents" on public.documents
  for insert with check (auth.uid() = user_id);

create policy "Admins can manage all documents" on public.documents
  for all using (public.is_admin());

-- 12. INSERT INITIAL CARS DATA
insert into public.cars (id, slug, brand, model, year, category, transmission, fuel, seats, price, rating, reviews, available, thumbnail, images, features, description)
values
  ('zenix-id-12345', 'toyota-innova-zenix', 'Toyota', 'Innova Zenix', 2024, 'MPV', 'Automatic', 'Hybrid', 7, 600000, 4.9, 124, true, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop'], array['Captain Seats', 'Panoramic Sunroof', 'Toyota Safety Sense', 'Dual Zone AC', 'Apple CarPlay & Android Auto', '6 Airbags', 'Keyless Entry', 'Rear Parking Camera'], 'Premium MPV perfect for family trips. Nikmati kenyamanan berkendara dengan kabin yang luas, efisiensi bahan bakar mesin hybrid modern, serta fitur keselamatan canggih untuk seluruh keluarga Anda selama perjalanan di Yogyakarta.'),
  ('fortuner-id-12345', 'toyota-fortuner', 'Toyota', 'Fortuner', 2024, 'SUV', 'Automatic', 'Diesel', 7, 1200000, 4.8, 96, true, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop'], array['4x4 Wheel Drive', 'Leather Seats', 'Power Backdoor', 'Hill Start Assist', 'Dual Zone AC', '7 Airbags', 'Cruise Control', '360 Camera'], 'Luxury SUV for every adventure. Ketangguhan mesin diesel dipadukan dengan kemewahan kabin kelas atas, siap menemani petualangan Anda menjelajahi medan perkotaan maupun alam bebas dengan penuh percaya diri.'),
  ('avanza-id-12345', 'toyota-avanza', 'Toyota', 'Avanza', 2023, 'MPV', 'Manual', 'Petrol', 7, 350000, 4.7, 211, true, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop'], array['Double Blower AC', 'Touchscreen Head Unit', 'Dual SRS Airbags', 'ABS & EBD', 'Parking Sensors', 'Electric Mirrors'], 'Affordable family vehicle. Mobil sejuta umat yang andal, hemat bahan bakar, dan sangat cocok untuk mobilitas harian keluarga atau rombongan kecil selama berkunjung di Yogyakarta.'),
  ('hiace-id-12345', 'toyota-hiace', 'Toyota', 'Hiace', 2024, 'Premium', 'Manual', 'Diesel', 15, 1000000, 4.9, 54, true, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop'], array['15 Passenger Seats', 'Spacious Cabin', 'Individual AC Vents', 'Sliding Door', 'Audio System', 'Rear Parking Sensors'], 'Comfortable transport for large groups. Pilihan utama untuk perjalanan wisata rombongan, keperluan bisnis, atau acara keluarga dengan kenyamanan maksimal dan ruang kabin yang sangat lega.')
on conflict (slug) do update set
  brand = excluded.brand,
  model = excluded.model,
  year = excluded.year,
  category = excluded.category,
  transmission = excluded.transmission,
  fuel = excluded.fuel,
  seats = excluded.seats,
  price = excluded.price,
  rating = excluded.rating,
  reviews = excluded.reviews,
  available = excluded.available,
  thumbnail = excluded.thumbnail,
  images = excluded.images,
  features = excluded.features,
  description = excluded.description;
