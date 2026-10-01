-- Required by Payload cloud storage 3.90.2.
-- Nullable metadata only; existing Blob URLs and files remain unchanged.
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS _objectkey varchar;
