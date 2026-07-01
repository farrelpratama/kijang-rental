-- 1. Create the 'car-images' bucket
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

-- 2. Allow public access to read files in the bucket
create policy "Public Access to car-images"
on storage.objects for select
using (bucket_id = 'car-images');

-- 3. Allow authenticated admins to upload new files
create policy "Admins can upload to car-images"
on storage.objects for insert
with check (
  bucket_id = 'car-images'
  and (select role from public.users where id = auth.uid()) = 'admin'
);

-- 4. Allow authenticated admins to update files
create policy "Admins can update car-images"
on storage.objects for update
using (
  bucket_id = 'car-images'
  and (select role from public.users where id = auth.uid()) = 'admin'
);

-- 5. Allow authenticated admins to delete files
create policy "Admins can delete from car-images"
on storage.objects for delete
using (
  bucket_id = 'car-images'
  and (select role from public.users where id = auth.uid()) = 'admin'
);
