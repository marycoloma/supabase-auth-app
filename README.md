# Supabase Authentication App

## Project Overview

This project is a mobile application built with Expo and React Native. It uses Supabase for user authentication and provides a protected area that users can access after signing in.

## Features

- User registration with email and password
- User sign-in and sign-out
- Form validation using Zod
- Form handling using React Hook Form
- Protected routes for authenticated users
- User profile displaying account information
- Resources list retrieved from Supabase

## Technologies Used

- React Native
- Expo
- TypeScript
- Expo Router
- Supabase
- React Hook Form
- Zod

## Prerequisites

Before running the application, make sure you have installed:

- Node.js and npm
- Expo Go (for testing on a mobile device)
- A Supabase account and project

## Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate into the project folder:

   ```bash
   cd YOUR_PROJECT_FOLDER
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root project directory.

5. Add your Supabase project credentials:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
   ```

   Use the exact variable names expected by `src/lib/supabase.ts`.

## Running the Application

Start the Expo development server:

```bash
npx expo start
```

To run the application:

- Press `w` to open the web version.
- Scan the QR code using Expo Go to run it on a mobile device.

## Supabase Configuration

The application uses Supabase Authentication to manage user accounts.

To configure the application:

1. Create a Supabase project.
2. Copy the project URL and publishable/anon key.
3. Add these credentials to your local `.env` file.
4. Ensure the required database tables are created in Supabase.
5. Configure Row Level Security (RLS) policies to protect user data.

## Authentication and Protected Routes

The application uses an authentication context to track the current user's session.

- Signed-out users can access the sign-in and sign-up screens.
- Signed-in users can access the protected profile area.
- Users can sign out to end their session.
- Zod schemas validate form input before authentication requests are submitted.

## Environment Variables

Do not commit your `.env` file or expose private credentials.

The `.env.example` file provides a template showing which environment variables are required. Each developer should create their own local `.env` file.

## Contributors

- Mary Ann Coloma
- Camille Tsui
- Munachi Amadike
