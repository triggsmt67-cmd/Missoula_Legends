# Backend login repair

Production `/admin/login` failed with digest `1515960114`. Vercel logs
identified PostgreSQL error 42703: `users.reset_password_requested_at`
did not exist after upgrading Payload to 3.90.2.

Applied `users-auth-upgrade.sql` to production on October 1, 2026. The
nullable timestamp matches Payload's hidden `resetPasswordRequestedAt`
date field, used by password-reset throttling. No existing user or session
records were modified. The existing session table already matched the query.

Verified the user/session schema query succeeds, the account has zero login
attempts and no lock, and a fresh live browser renders the email, password,
and Login controls without the server-error screen. Refreshed the user's
open error tab. Password submission remains for the user to verify.

Future CMS dependency upgrades must compare the complete generated database
schema, including auth collections, and verify anonymous login rendering
and authenticated admin access before marking deployment verified. Public
page builds alone did not cover this regression.
