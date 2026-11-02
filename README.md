# XPence

XPence is a modern budgeting and expense-tracking app built with Expo and React Native. It helps users stay in control of their monthly spending, build stronger financial habits, and understand exactly where their money is going.

## Overview

XPence is designed for people who want a simple but powerful way to manage their budget without the complexity of heavier finance tools. The app guides users through onboarding, helps them define a monthly budget, and organizes expenses into categories such as Needs, Wants, and Savings.

Users can:

- set a monthly budget and track progress in real time
- add, update, and delete expenses
- group spending into custom categories
- review category-based insights and monthly summaries
- monitor whether they are on track for their financial goals
- securely sign in and keep their data synced via Supabase

## Features

- Budget dashboard with remaining budget and spending overview
- Expense tracking with date, amount, description, and category selection
- Category management for personal finance planning
- Monthly insights and analysis across Needs, Wants, and Savings
- Personalized settings for budget, currency, and locale
- English and Greek language support
- Supabase-powered authentication and persistence
- Mobile-first user experience for Android and iOS

## Tech stack

- Expo / React Native
- Expo Router
- TypeScript
- Supabase
- TanStack React Query
- i18next

## Prerequisites

- Node.js 20+
- npm
- Expo CLI
- A Supabase project with URL and anon key

## Configuration

Create a `.env` file in the project root with the following values:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npx expo start
```

3. Run on Android:

```bash
npm run android
```

4. Create a preview build:

```bash
eas build --platform android --profile preview
```

## Project structure

```text
app/                 # File-based Expo Router screens
api/                 # API layer for users, expenses, and categories
components/          # Shared UI components
constants/           # Theme, currency, and locale definitions
context/             # Context providers
hooks/               # Data-fetching hooks
languages/           # Translation files
lib/                 # Auth, storage, Supabase, and helpers
types/               # TypeScript types
assets/              # Brand and app assets
```

## App flow

The app begins with onboarding for first-time users, then routes authenticated users into the main budget dashboard. From there, they can:

1. add expenses
2. manage categories
3. review spending insights
4. adjust budget, currency, and locale settings

## Notes

This project is built for mobile app delivery and uses Supabase for account management and persistent financial data. It is a good foundation for a production budgeting app and can be extended with recurring expenses, notifications, and richer analytics.
