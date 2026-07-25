# Security

- Never commit passwords, Supabase service-role keys, GitHub personal access tokens, or private file URLs.
- `SUPABASE_ANON_KEY` is intended for browser clients and must be paired with the RLS policies in `supabase-schema.sql`.
- Admin access requires both a valid Supabase session and an owner record in `public.profiles`.
- Private files belong in the `portfolio-private` bucket and are owner-only.
