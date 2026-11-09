SET local check_function_bodies = off;

CREATE TABLE "public"."categories" (
  "id"         uuid    NOT NULL DEFAULT gen_random_uuid(),
  "name"       text    NOT NULL,
  "is_default" boolean NOT NULL DEFAULT false,
  CONSTRAINT "categories_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."categories"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."expenses" (
  "id"          uuid    NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     uuid    NOT NULL DEFAULT gen_random_uuid(),
  "category_id" uuid    NOT NULL DEFAULT gen_random_uuid(),
  "description" text    NOT NULL DEFAULT ''::text,
  "date"        date    NOT NULL,
  "amount"      numeric NOT NULL,
  CONSTRAINT "expenses_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."expenses"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."user_profiles" (
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "display_name" text                     NOT NULL DEFAULT ''::text,
  "budget"       bigint                   NOT NULL DEFAULT '0'::bigint,
  "locale"       text                     NOT NULL DEFAULT 'EN'::text,
  "currency"     text                     NOT NULL DEFAULT 'EUR'::text,
  "user_id"      uuid                     NOT NULL DEFAULT auth.uid(),
  CONSTRAINT "user_profiles_pkey" PRIMARY KEY (user_id)
);

ALTER TABLE "public"."user_profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."user_to_category" (
  "user_id"     uuid    NOT NULL DEFAULT gen_random_uuid(),
  "category_id" uuid    NOT NULL DEFAULT gen_random_uuid(),
  "is_active"   boolean NOT NULL DEFAULT true,
  CONSTRAINT "user_to_category_pkey" PRIMARY KEY (user_id, category_id)
);

ALTER TABLE "public"."user_to_category"
  ENABLE ROW LEVEL SECURITY;

CREATE TYPE "public"."expense_type" AS ENUM (
  'needs',
  'wants',
  'savings'
);

ALTER TABLE "public"."categories"
  ADD COLUMN "type" public.expense_type NOT NULL DEFAULT 'needs'::public.expense_type;

CREATE OR REPLACE FUNCTION public.create_default_categories_for_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$BEGIN
    INSERT INTO public.user_to_category (user_id, category_id)
    SELECT NEW.user_id, id
    FROM public.categories
    WHERE is_default = true
    ON CONFLICT DO NOTHING; 
    
    RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.expenses_by_category (
  p_start_date    date,
  p_end_date      date,
  p_category_type public.expense_type DEFAULT NULL::public.expense_type
)
  RETURNS TABLE (
    category_id         uuid,
    category_name       text,
    category_type       public.expense_type,
    sum_amount          integer,
    percentage_in_total numeric
  )
  LANGUAGE sql
  STABLE
  AS $function$
  with filtered as (
    select
      c.id as category_id,
      c.name as category_name,
      c.type as category_type,
      e.amount as amount
    from public.expenses e
    join public.categories c
      on c.id = e.category_id
    where e.date between p_start_date and p_end_date
      and (p_category_type is null or c.type = p_category_type)
  ),
  grouped as (
    select
      category_id,
      category_name,
      category_type,
      sum(amount) as sum_amount
    from filtered
    group by category_id, category_name, category_type
  )
  select
    g.category_id,
    g.category_name,
    g.category_type,
    g.sum_amount,
    case
      when total.total_sum = 0 then 0
      else (g.sum_amount::numeric / total.total_sum::numeric) * 100
    end as percentage_in_total
  from grouped g
  cross join (
    select sum(sum_amount) as total_sum
    from grouped
  ) as total
  order by g.sum_amount desc;
$function$;

CREATE OR REPLACE FUNCTION public.expenses_by_category_type (
  p_start_date    date,
  p_end_date      date,
  p_category_type public.expense_type DEFAULT NULL::public.expense_type
)
  RETURNS TABLE (
    category_type       public.expense_type,
    sum_amount          integer,
    percentage_in_total numeric
  )
  LANGUAGE sql
  STABLE
  AS $function$
  with filtered as (
    select
      c.type as category_type,
      e.amount as amount
    from public.expenses e
    join public.categories c
      on c.id = e.category_id
    where e.date between p_start_date and p_end_date
      and (p_category_type is null or c.type = p_category_type)
  ),
  grouped as (
    select
      category_type,
      sum(amount) as sum_amount
    from filtered
    group by category_type
  )
  select
    g.category_type,
    g.sum_amount,
    case
      when total.total_sum = 0 then 0
      else (g.sum_amount::numeric / total.total_sum::numeric) * 100
    end as percentage_in_total
  from grouped g
  cross join (
    select sum(sum_amount) as total_sum
    from grouped
  ) as total
  order by g.sum_amount desc;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_month_expenses_by_type()
  RETURNS jsonb
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$
  SELECT jsonb_build_object(
    'needs', COALESCE(SUM(e.amount) FILTER (WHERE c.type = 'needs'), 0),
    'wants', COALESCE(SUM(e.amount) FILTER (WHERE c.type = 'wants'), 0),
    'savings', COALESCE(SUM(e.amount) FILTER (WHERE c.type = 'savings'), 0)
  )
  FROM public.expenses AS e
  JOIN public.categories AS c ON c.id = e.category_id
  WHERE e.user_id = (SELECT auth.uid())
    AND e.date >= date_trunc('month', CURRENT_DATE)::date
    AND e.date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date;
$function$;

CREATE OR REPLACE FUNCTION public.get_monthly_insights (
  p_from_date     date,
  p_to_date       date,
  p_category_type text DEFAULT NULL::text
)
  RETURNS jsonb
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$
  WITH category_totals AS (
    SELECT
      c.id AS category_id,
      c.name AS category_name,
      c.type AS category_type,
      SUM(e.amount) AS total_amount
    FROM public.expenses AS e
    JOIN public.categories AS c ON c.id = e.category_id
    WHERE e.user_id = (SELECT auth.uid())
      AND e.date >= p_from_date
      AND e.date <= p_to_date
      AND (p_category_type IS NULL OR c.type::text = p_category_type)
    GROUP BY c.id, c.name, c.type
  )
  SELECT jsonb_build_object(
    'expenseSummary', jsonb_build_object(
      'needs', COALESCE(SUM(total_amount) FILTER (WHERE category_type = 'needs'), 0),
      'wants', COALESCE(SUM(total_amount) FILTER (WHERE category_type = 'wants'), 0),
      'savings', COALESCE(SUM(total_amount) FILTER (WHERE category_type = 'savings'), 0)
    ),
    'expenses', COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'category', category_name,
          'categoryType', category_type,
          'amount', total_amount
        )
        ORDER BY total_amount DESC, category_name ASC
      ),
      '[]'::jsonb
    )
  )
  FROM category_totals;
$function$;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

ALTER TABLE "public"."expenses"
  ADD CONSTRAINT "expenses_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."expenses"
  ADD CONSTRAINT "expenses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."user_to_category"
  ADD CONSTRAINT "user_to_category_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."user_to_category"
  ADD CONSTRAINT "user_to_category_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE INDEX categories_is_default_idx ON public.categories USING btree (is_default);

CREATE TRIGGER on_new_user_for_categories
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_categories_for_user();

CREATE POLICY "Enable insert for authenticated users only" ON "public"."categories"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."categories"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "categories delete non-default (trigger)" ON "public"."categories"
  FOR DELETE
  TO "postgres"
  USING ((is_default = false));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."expenses"
  FOR DELETE
  TO PUBLIC
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."expenses"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id" ON "public"."expenses"
  FOR UPDATE
  TO PUBLIC
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable users to view their own data only" ON "public"."expenses"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."user_to_category"
  FOR DELETE
  TO PUBLIC
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."user_to_category"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable users to view their own data only" ON "public"."user_to_category"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can update their own category links" ON "public"."user_to_category"
  FOR UPDATE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION "public"."rls_auto_enable"();

COMMENT ON COLUMN "public"."user_to_category"."is_active" IS 'Whether the user has deleted the category';

COMMENT ON TABLE "public"."categories" IS 'A collection of categories that each user has added';

COMMENT ON TABLE "public"."user_profiles" IS 'A collection of all user profiles';

COMMENT ON TABLE "public"."user_to_category" IS 'A bridge table for the catories and the users';

GRANT EXECUTE ON FUNCTION "public"."create_default_categories_for_user"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."create_default_categories_for_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_default_categories_for_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_default_categories_for_user"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."expenses_by_category"(date, date, public.expense_type) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."expenses_by_category"(date, date, public.expense_type) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."expenses_by_category"(date, date, public.expense_type) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."expenses_by_category"(date, date, public.expense_type) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."expenses_by_category_type"(date, date, public.expense_type) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."expenses_by_category_type"(date, date, public.expense_type) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."expenses_by_category_type"(date, date, public.expense_type) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."expenses_by_category_type"(date, date, public.expense_type) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_current_month_expenses_by_type"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_current_month_expenses_by_type"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_current_month_expenses_by_type"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_current_month_expenses_by_type"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_monthly_insights"(date, date, text) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_monthly_insights"(date, date, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_monthly_insights"(date, date, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_monthly_insights"(date, date, text) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."categories" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."expenses" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."expenses" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."expenses" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."expenses" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_profiles" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."user_profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_profiles" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_to_category" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."user_to_category" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_to_category" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_to_category" TO "service_role";

ALTER TABLE "public"."user_profiles"
  ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE INDEX idx_user_profile_user_id ON public.user_profiles USING btree (user_id);

CREATE POLICY "Users can delete own profile" ON "public"."user_profiles"
  FOR DELETE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can insert own profile" ON "public"."user_profiles"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can select own profile" ON "public"."user_profiles"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can update own profile" ON "public"."user_profiles"
  FOR UPDATE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

