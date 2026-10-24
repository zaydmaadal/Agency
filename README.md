# Startbord

Intern dashboard voor ons agency (Zayd, Amine, Haider): projecten, checklists, feedback, prijscalculator, admin & GDPR.

Statische site (HTML/CSS/JS, geen build) + Supabase voor login en gedeelde data.

## Lokaal draaien

```bash
npx serve -l 3000 .
```

Open http://localhost:3000 en log in met je e-mail (magic link).

## Toegang geven

Alleen e-mails in de tabel `members` zien data. In Supabase → SQL Editor:

```sql
insert into public.members (email, name) values
  ('zayd@…', 'Zayd'), ('amine@…', 'Amine'), ('haider@…', 'Haider');
```

## Online zetten

1. Importeer deze repo in Vercel (of Cloudflare Pages). Geen build-command, output = root.
2. Supabase → Authentication → URL Configuration: zet de Site URL op de live URL en voeg die toe aan Redirect URLs.

Database-schema: `supabase/schema.sql`.
