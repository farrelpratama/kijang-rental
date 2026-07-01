-- 1. Create the 'documents' bucket
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- 2. Allow public access to read files in the bucket
create policy "Public Access to documents"
on storage.objects for select
using (bucket_id = 'documents');

-- 3. Allow authenticated users to upload files
create policy "Authenticated users can upload to documents"
on storage.objects for insert
with check (
  bucket_id = 'documents'
  and auth.role() = 'authenticated'
);

-- 4. Allow authenticated admins to update/delete files
create policy "Admins can update documents"
on storage.objects for update
using (
  bucket_id = 'documents'
  and (select role from public.users where id = auth.uid()) = 'admin'
);

create policy "Admins can delete documents"
on storage.objects for delete
using (
  bucket_id = 'documents'
  and (select role from public.users where id = auth.uid()) = 'admin'
);
