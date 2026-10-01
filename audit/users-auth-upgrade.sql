-- Payload 3.90 adds a nullable timestamp used to throttle password resets.
-- Apply before deploying the upgraded CMS. Existing credentials stay intact.
BEGIN;
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS reset_password_requested_at timestamptz(3);
COMMIT;
