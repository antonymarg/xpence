# XPence launch checklist

Remaining work before making the repo public and releasing on Google Play.

## Suggested order

1. Set up a custom email provider in Supabase.
2. Pull the real schema into migrations and fix the onboarding bug (bug 1).
3. Fix bugs 2–3, then work through the rest.
4. Build the privacy policy and account-deletion pages (themed HTML for your website).

---

## 1. Google Play

- [ ] **Privacy policy at a public URL.** Themed HTML page for your website, to be built at the end. Its text must match the in-app policy (`policy` in [en.json](languages/en.json) / [gr.json](languages/gr.json)).
- [ ] **Account-deletion web page.** A URL where people can ask for their account to be deleted without installing the app. Themed HTML page, to be built at the end.
- [ ] **Store listing:** 512×512 icon, 1024×500 feature graphic, at least 2 phone screenshots, short and full descriptions in English and Greek.
- [ ] **Check the new icons on a device** with a preview build (`npm run build-preview`). Icon and splash changes only show up in a new native build.
- [ ] **EAS submit:** fill in `submit.production` in [eas.json](eas.json) (service account key and track). The first upload must be done by hand in the Play Console.
- [ ] **Notification permissions:** check the final Android manifest of the release build for what `expo-notifications` adds (for example exact-alarm permissions, which Play restricts). Data safety answers must match.

## 2. Supabase production settings

- [ ] **Custom email provider (likely blocker).** Supabase's built-in email only sends to your Supabase team members and allows a few emails per hour. Use Resend, Postmark, SES or similar.
- [ ] **Redirect allow-list** includes `xpence://callback` (sign-up confirmation) and `xpence://resetPassword` (password reset), or simply `xpence://**`. Authentication → URL Configuration → Redirect URLs.
- [ ] **Test both email flows on a device** once the email provider is set up: sign up → resend confirmation → confirm; forgot password → open link → set new password.
- [ ] **Password rules:** server minimum length 8 to match the app (local config allows 6); turn on leaked-password protection.
- [ ] **Plan:** free-tier projects pause after a week of inactivity. Fine for testing, not for a public app.
- [ ] **Apply the new migration** `20261121120000_drop_unused_expense_functions.sql` with `npx supabase db push`.

## 3. Account features

- [ ] **Data export (optional).** The policy lets users request a copy by email, which meets the legal requirement. An in-app CSV export would be nicer.

## 4. Making the repo public

- [ ] **Sync migrations with the live database.** [deleteAccount](api/users.api.ts#L130) calls a `delete_user` function that isn't in any migration. The second migration drops `user_to_category` and `is_default`, but the sign-up trigger function `create_default_categories_for_user` still uses both. Anyone following the README's `db push` steps gets a database where creating a profile fails and account deletion doesn't exist. Run `supabase db pull` and commit the result.
- [ ] **Check `delete_user`** only deletes the row where `id = auth.uid()`.
- [ ] **README screenshots:** it links to `docs/screenshots/*.png`, which don't exist.
- [ ] **Add `.env.example`.**
- [ ] **Licence decision:** MIT lets anyone publish the app on Play under another name. Fine if intended.
- [ ] **Tests and CI.**

---

## 5. Bugs (most serious first)

- [ ] **1. Onboarding can leave an account stuck for good** ([users.api.ts:36-48](api/users.api.ts#L36-L48)). The profile is saved first and the default categories second, as separate requests. If the second fails, the user has a profile but no categories and can never add an expense. Retrying fails because the profile already exists, and they're never sent back to onboarding. **Fix:** create both in one database function (one transaction).
- [ ] **2. Home screen shows the wrong month for the first hours of each month** (`get_current_month_expenses_by_type` in [the migration](supabase/migrations/20261104102057_remote_schema.sql)). The database works out "this month" in UTC; the app uses the phone's local date. In Greece, from 00:00 to 02:00/03:00 on the 1st, home shows last month's totals and leaves out today's expenses. **Fix:** pass local month start/end as parameters, as `get_monthly_insights` does.
- [ ] **3. Add-expense date gets stuck** ([addRecord.tsx:69](app/(app)/addRecord.tsx#L69), [line 83](app/(app)/addRecord.tsx#L83)). The default date is set once when the screen first opens and `reset()` restores it. If the app stays open overnight, new expenses default to yesterday. **Fix:** `reset({ ...defaults, date: new Date() })`.
- [ ] **4. Editing an expense from a deleted category** ([UpdateExpenseModal.tsx:41](components/history/UpdateExpenseModal.tsx#L41)). The form lists only active categories, so the expense's own category is invisible and can't be reselected.
- [ ] **5. No input limits.** No maximum length on descriptions or category names; no maximum amount (precision loss above ~90 trillion). No database checks: amounts can be negative or zero, currency and language codes aren't validated. A user can only damage their own data, but could fill the storage quota.
- [ ] **6. Fragile category query** ([categories.api.ts:41-42](api/categories.api.ts#L41-L42)). The builder result isn't reassigned; it works only because the Supabase builder mutates itself. Use `query = query.eq(...)`.
- [ ] **7. Double taps in modals.** The add/edit/delete modals for categories and expenses have no saving state, so a double tap sends the request twice.
