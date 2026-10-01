-- Deployment prerequisite for the eight new neighborhood options.
-- Review and run against the intended database before deploying the application.
-- Adds values only; preserves existing records. Not executed by this local audit.
-- Finds actual enum types through the main and version columns instead of guessing names.
DO $$
DECLARE
  enum_type record;
  new_value text;
  found_types integer := 0;
BEGIN
  FOR enum_type IN
    SELECT DISTINCT type_schema.nspname AS schema_name, enum.typname AS type_name
    FROM pg_attribute attribute
    JOIN pg_class relation ON relation.oid = attribute.attrelid
    JOIN pg_namespace table_schema ON table_schema.oid = relation.relnamespace
    JOIN pg_type enum ON enum.oid = attribute.atttypid AND enum.typtype = 'e'
    JOIN pg_namespace type_schema ON type_schema.oid = enum.typnamespace
    WHERE table_schema.nspname = 'public'
      AND relation.relname IN ('directory', '_directory_v')
      AND attribute.attname IN ('neighborhood', 'version_neighborhood')
      AND NOT attribute.attisdropped
  LOOP
    found_types := found_types + 1;
    FOREACH new_value IN ARRAY ARRAY['southgate-triangle', 'midtown', 'franklin-to-the-fort', 'airport', 'greater-missoula', 'victor', 'regional-montana', 'missoula-development-park']
    LOOP
      EXECUTE format('ALTER TYPE %I.%I ADD VALUE IF NOT EXISTS %L', enum_type.schema_name, enum_type.type_name, new_value);
    END LOOP;
  END LOOP;
  IF found_types = 0 THEN
    RAISE EXCEPTION 'No neighborhood enum columns found. Check the schema before deployment.';
  END IF;
END $$;
