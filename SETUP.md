# Project Setup Guide

Follow these steps to connect your application to Convex and configure the necessary services.

## 1. Connect to Convex

Run the following command in your terminal to initialize the connection to your Convex account. This will prompt you to log in and select (or create) a project.

```bash
npx convex dev
```

*   **What this does**: It creates a `convex.json` config file and updates your `.env.local` with `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`.
*   **Keep this running**: This command syncs your `convex/` folder to the cloud and generates TypeScript types in real-time.

## 2. Configure Authentication (Clerk)

We use [Clerk](https://clerk.com) for user authentication.

1.  **Create a Clerk Application**: Go to the Clerk Dashboard and create a new app.
2.  **Get API Keys**:
    *   Copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
    *   Add them to your `.env.local` file.
3.  **Get JWT Issuer Domain**:
    *   In Clerk, go to **JWT Templates**.
    *   Create a new template named `convex`.
    *   Copy the **Issuer** URL (e.g., `https://your-app.clerk.accounts.dev`).
    *   Add this to `.env.local` as `CLERK_JWT_ISSUER_DOMAIN`.

## 3. Set Environment Variables (Crucial!)

This project has two places where environment variables live:

### A. Local (`.env.local`)
Used by the Next.js Frontend.

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=...        # Auto-filled by npx convex dev
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### B. Convex Dashboard (Backend)
Used by the Convex functions (`ingest.ts`, `llm.ts`, `auth.config.ts`).

1.  Go to your **Convex Dashboard** > **Settings** > **Environment Variables**.
2.  Add the following variables:

| Variable Name | Value Description |
| :--- | :--- |
| `CLERK_JWT_ISSUER_DOMAIN` | The Issuer URL from Clerk (required for `auth.config.ts`). |
| `GEMINI_API_KEY` | Your Google Gemini API Key. |
| `DEEPSEEK_API_KEY` | Your DeepSeek API Key. |
| `CLERK_SECRET_KEY` | Your Clerk Secret Key (optional, if needed for admin tasks). |

## 4. Get AI API Keys

*   **Google Gemini**: [Get API Key](https://aistudio.google.com/app/apikey)
*   **DeepSeek**: [Get API Key](https://platform.deepseek.com/)

## 5. Verify Setup

1.  Restart your development server:
    ```bash
    npm run dev
    ```
2.  Open `http://localhost:3000`.
3.  If configured correctly, the app should load, and you should be able to sign in via Clerk.
