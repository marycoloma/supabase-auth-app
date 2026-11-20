# Study Hub — Supabase Authentication

An Expo (React Native) app integrated with **Supabase Auth**. Users can sign up, sign in and sign out. Public data is shown on the Sign-Up screen, and members-only data (protected by Row Level Security) is shown after login.

## Features

- Sign-Up, Sign-In and Sign-Out screens
- Forms built with **React Hook Form** and validated with **Zod**
- Loading indicators during auth requests and data loading
- Clear error messages (invalid credentials, weak password, existing account, network error)
- Session restored on app launch, with a loading screen while it is checked
- Protected screens using `Stack.Protected` — logged-out users cannot access them
- User's name (or email) shown in the navigation bar after login
- Public data (`Sample Table`) shown on the Sign-Up screen
- RLS-protected data (`resources`) listed on the Home screen after login
- Auth state shared with `useContext` through an `AuthProvider`
- Consistent green theme across all screens (`app-theme.ts`)

## Tech stack

Expo · Expo Router · TypeScript · Supabase · React Hook Form · Zod

## Setup — run the app

1. Clone the repository
   ```bash
   git clone https://github.com/marycoloma/supabase-auth-app.git
   cd supabase-auth-app
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root (copy `.env.example`)
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   ```
   `.env` is listed in `.gitignore` and is never committed.
4. Start the app
   ```bash
   npx expo start -c
   ```
   Press `w` to open in the browser, or scan the QR code with Expo Go.

## Supabase project setup

1. Create a Supabase project. Copy the **Project URL** and the **publishable/anon key** (Project Settings → API Keys) into `.env`.
2. **Authentication → Sign In / Providers**
   - Email provider enabled
   - _Confirm email_ turned **off** for development, so new users can sign in right away
3. **Tables and RLS policies**

   **`Sample Table`** — public data shown on the Sign-Up screen
   - Columns: `id` (int8, primary key), `name` (varchar)
   - Rows: Jimmy, Mary, Munachi, Camille
   - RLS enabled
   - Policy: _Enable read access for all users_ — `SELECT` for `public`

   **`resources`** — protected data shown after login

   ```sql
   create table public.resources (
     id bigint generated always as identity primary key,
     title text not null,
     description text,
     created_at timestamptz default now()
   );
   alter table public.resources enable row level security;

   create policy "Only signed-in users can read resources"
     on public.resources for select
     to authenticated
     using (true);

   insert into public.resources (title, description) values
     ('Study Guide', 'Members-only study notes'),
     ('Exam Tips', 'How to prepare for finals'),
     ('Project Templates', 'Starter files for assignments'),
     ('Video Tutorials', 'Recorded walkthroughs');
   ```

## Security notes

- The Supabase URL and key are stored in environment variables, not in the code.
- Data access is enforced by **RLS policies**: logged-out users get an empty list from `resources`, while signed-in users see all 4 rows.

## Test account

| Email                         | Password            |
| ----------------------------- | ------------------- |
| `your-test-email@example.com` | `YourTestPassword1` |

## How to test

1. Open the app — the Study Hub welcome screen appears.
2. **Create an account** — the "Meet our team" list loads from Supabase. Try submitting empty fields, a short password or mismatched passwords to see validation errors.
3. Sign up or sign in — the header shows **"Hi, [name]"** and the members-only resources list appears.
4. Refresh the app — you stay signed in (session restored).
5. Click **Sign out** — you return to the welcome screen.

## Project structure

```
context/
  AuthProvider.tsx     # AuthContext + useAuth (session, loading)
src/
  app/
    _layout.tsx        # Stack navigator, route protection, splash/loading
    index.tsx          # Home: welcome (logged out) / resources list (logged in)
    sign-in.tsx        # Sign-In form (React Hook Form + Zod)
    sign-up.tsx        # Sign-Up form (React Hook Form + Zod) + public Sample Table list
    sign-out.tsx       # Sign-Out screen
  constants/
    app-theme.ts       # Shared green colours and styles
  lib/
    supabase.ts        # Supabase client (AsyncStorage session)
```

## Team

- **Mary Ann Coloma** — sign-in/sign-up screens (React Hook Form + Zod), sign-out screen, protected home with resources list and name in header, splash fix, green theme, README
- **Camille Tsui** — AuthProvider (context), initial sign-in/sign-up screens
- **Munachi Amadike** — route protection (`Stack.Protected`) in `_layout.tsx`

## AI Disclosure

The team built the base app from our instructor's example code, including the AuthProvider (context), route protection with `Stack.Protected`, and the first versions of the sign-in, sign-up and sign-out screens.

We then used **Claude (Anthropic)** to help with:

- Upgrading the sign-in and sign-up forms to React Hook Form + Zod, with readable error messages and loading indicators
- The Supabase client configuration and the splash screen fix
- The shared green theme and consistent styling
- Debugging (web rendering error, duplicate routes, typed-route errors, Git merges) and drafting this README

All code was tested by the team, and we can explain how each part works.
