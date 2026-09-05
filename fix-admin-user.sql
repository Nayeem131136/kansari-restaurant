-- Kansari Restaurant — Directly set/reset the admin login credentials
-- Run this in Supabase SQL Editor. This bypasses the app's own
-- auto-create logic entirely, so it will work even if that logic
-- didn't run correctly for some reason.
--
-- Login after running this:
--   Email:    kansari@nayeem.com
--   Password: nayeem@131

insert into admin_user (id, email, password_hash, name, role)
values (
  'admin-kansari-1',
  'kansari@nayeem.com',
  '$2b$10$3gVFKXX69g6uFgHYJbYlV.a.u1NbRsHOZlA5pX5b8TGEON1VcfIj.',
  'Kansari General Manager',
  'admin'
)
on conflict (id) do update set
  email = excluded.email,
  password_hash = excluded.password_hash,
  name = excluded.name,
  role = excluded.role;

-- Sanity check — this should return exactly 1 row with your email
select id, email, name, role from admin_user;
