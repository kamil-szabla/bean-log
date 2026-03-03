# BeanLog (Expo + Supabase MVP)

BeanLog is a mobile-first coffee app MVP to discover beans/roasters, save favourites, log brews, and track personal stats.

## What is implemented

- Expo React Native TypeScript app with `expo-router` routes.
- Supabase schema migration for all core entities + `beans_with_rating` view.
- RLS policies for user-data safety.
- Seed script (Node/TS) for 10 UK/London-heavy roasters + 50 beans.
- React Query caching + pull-to-refresh list patterns.
- `react-hook-form` + `zod` validation for auth and brew logging.
- Basic validator unit tests.

## Tech stack

- Expo + React Native + TypeScript (strict)
- expo-router
- @supabase/supabase-js
- @tanstack/react-query
- react-hook-form + zod
- expo-location (optional near-me sorting)

## Project structure

```
/
  app/
  src/
  supabase/
    migrations/
    seed/
  test/
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Fill env values:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (local only, never commit)

## Supabase migration

Run SQL in `supabase/migrations/202611030001_init_beanlog.sql` in Supabase SQL editor or via Supabase CLI.

## Seed data

After migrations:

```bash
npm run seed
```

This upserts:
- 10 roasters (London-heavy)
- 50 beans with tasting notes arrays

## Run app

```bash
npm run start
```

Then launch in Expo Go / simulator.

## MVP screens

- Auth (`/auth`)
- Discover (`/(tabs)/discover`)
- Bean detail (`/bean/[id]`)
- Log brew (`/log-brew`)
- Favourites (`/(tabs)/favourites`)
- Roasters + detail (`/(tabs)/roasters`, `/roaster/[id]`)
- Profile stats (`/(tabs)/profile`)

## Design/implementation decisions

- Search is client-side for MVP simplicity; filters use direct equality where possible.
- Reviews are inserted alongside brew logs to keep rating flow simple.
- Near-me sorting is opt-in and only applied when location permission is granted.
- Roasters/beans writes are intentionally policy-restricted (service role bypasses RLS for seeding/admin scripts).

## Troubleshooting

- **Auth fails with invalid JWT / key**: check anon key and project URL in `.env`.
- **No data in lists**: ensure migration applied and seed script completed.
- **Seed fails**: confirm service role key is present and has access to project.
- **Location sort does nothing**: user denied permission or roasters do not have coordinates.
