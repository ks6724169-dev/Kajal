# DATABASE AUTH INTEGRATION
This directory defines the hooks and user creation synchronization triggers connecting Supabase Auth (`auth.users`) with our custom user profiles (`public.universal_user`).

## Handshake Flow
1. User signs up via Supabase Auth.
2. `auth.users` row is inserted.
3. Database trigger `tr_on_auth_user_created` fires.
4. Function `fn_handle_new_auth_user()` runs and inserts a profile row into `public.universal_user`.
