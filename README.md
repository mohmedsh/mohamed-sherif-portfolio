# Mohamed Sherif Portfolio Hub — Secure Production Build

This build contains no hard-coded password and no browser-only admin mode.

## Public pages
- `index.html` — portfolio and public projects/notes
- `cv.html` — latest public CV
- `admin.html` — owner administration protected by Supabase Auth and Row Level Security

## Security model
- The admin password is stored and verified only by Supabase Authentication.
- No password is present in GitHub, JavaScript, HTML, Local Storage, or Session Storage.
- Public visitors can read only published public content.
- Private, draft, and unlisted records require the authenticated owner role.

## Required production setup
1. Create a Supabase project.
2. Run `supabase-schema.sql` in its SQL Editor.
3. Create the owner in Authentication → Users with a strong password.
4. Mark that user as owner using the commented SQL statement at the end of `supabase-schema.sql`.
5. Put the project URL, anon key, and owner email in `config.js`.
6. Upload the files to GitHub Pages.

The Supabase URL and anon key are browser configuration values. Security is enforced by the included Row Level Security policies. Never place a service-role key or an account password in this repository.
