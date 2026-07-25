# Security

- No password is stored in this repository, HTML, JavaScript, Local Storage, or Session Storage.
- Authentication is handled by Supabase Auth.
- Authorization is enforced by Row Level Security policies in `supabase-setup.sql`.
- `SUPABASE_ANON_KEY` / publishable key is intentionally public and safe only when RLS remains enabled.
- Never commit a Supabase secret/service-role key, GitHub token, database password, or private signed URL.
