BEGIN;

ALTER TABLE public.categories
  ADD COLUMN user_id uuid
    REFERENCES auth.users (id)
    ON DELETE CASCADE,
  ADD COLUMN is_active boolean NOT NULL DEFAULT true;

DO $$
DECLARE
  r record;
  v_new_category_id uuid;
BEGIN
  -- Stop if any categorized expense has no active category link
  -- for its owner. Resolve these rows before retrying.
  IF EXISTS (
    SELECT 1
    FROM public.expenses AS e
    WHERE e.category_id IS NOT NULL
      AND (
        e.user_id IS NULL
        OR NOT EXISTS (
          SELECT 1
          FROM public.user_to_category AS utc
          WHERE utc.user_id = e.user_id
            AND utc.category_id = e.category_id
            AND utc.is_active = true
        )
      )
  ) THEN
    RAISE EXCEPTION
      'Migration stopped: expenses exist without an active category link for their user. Resolve those rows before retrying.';
  END IF;

  -- Create a user-owned category for every link, including inactive
  -- links, so each link's is_active value is preserved.
  FOR r IN
    SELECT
      utc.user_id,
      utc.category_id,
      utc.is_active,
      c.name,
      c.type
    FROM public.user_to_category AS utc
    JOIN public.categories AS c
      ON c.id = utc.category_id
  LOOP
    INSERT INTO public.categories (user_id, name, type, is_active)
    VALUES (r.user_id, r.name, r.type, r.is_active)
    RETURNING id INTO v_new_category_id;

    UPDATE public.expenses
    SET category_id = v_new_category_id
    WHERE user_id = r.user_id
      AND category_id = r.category_id;
  END LOOP;
END;
$$;

-- Remove policies that reference is_default before dropping that column.
DROP POLICY IF EXISTS "categories delete non-default (trigger)"
  ON public.categories;

DROP POLICY IF EXISTS "Users cannot delete default categories"
  ON public.categories;

-- Drop the old relationship table and its unowned category rows.
DROP TABLE public.user_to_category;

DELETE FROM public.categories
WHERE user_id IS NULL;

ALTER TABLE public.categories
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid(),
  DROP COLUMN is_default;

-- Use the authenticated user as the default owner; categories must be
-- selected explicitly (or be NULL) rather than assigned a random UUID.
ALTER TABLE public.expenses
  ALTER COLUMN user_id SET DEFAULT auth.uid(),
  ALTER COLUMN category_id DROP DEFAULT;

CREATE INDEX categories_user_id_idx
  ON public.categories (user_id);

CREATE INDEX IF NOT EXISTS expenses_user_id_idx
  ON public.expenses (user_id);

-- Replace broad category policies with owner-based access.
DROP POLICY IF EXISTS "Enable read access for all users"
  ON public.categories;

DROP POLICY IF EXISTS "Enable insert for authenticated users only"
  ON public.categories;

DROP POLICY IF EXISTS "Users can manage their own categories"
  ON public.categories;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Restrict expense inserts and updates to the user's own categories.
DROP POLICY IF EXISTS "Enable insert for authenticated users only"
  ON public.expenses;

DROP POLICY IF EXISTS "Users can insert own expenses"
  ON public.expenses;

CREATE POLICY "Users can insert own expenses"
  ON public.expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      category_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.categories AS c
        WHERE c.id = category_id
          AND c.user_id = (SELECT auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Enable update for users based on user_id"
  ON public.expenses;

DROP POLICY IF EXISTS "Users can update own expenses"
  ON public.expenses;

CREATE POLICY "Users can update own expenses"
  ON public.expenses
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      category_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.categories AS c
        WHERE c.id = category_id
          AND c.user_id = (SELECT auth.uid())
      )
    )
  );

COMMIT;