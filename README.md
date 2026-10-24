# Startbord

Intern dashboard voor ons agency (Zayd, Amine, Haider): projecten, checklists, feedback, prijscalculator, admin & GDPR.

Statische site (HTML/CSS/JS, geen build) + Supabase voor gedeelde data.

## Binnenkomen

Eén teamwachtwoord (vraag het aan het team), daarna kies je wie je bent. Je naam staat bij je vinkjes en feedback.

## Lokaal draaien

```bash
npx serve -l 3000 .
```

## Online

Gekoppeld aan Vercel: elke push naar `main` gaat automatisch live. Database-schema: `supabase/schema.sql`.
