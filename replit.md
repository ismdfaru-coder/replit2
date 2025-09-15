# Next.js Firebase AI Travel App

## Project Overview
This is a Next.js application for AI-powered travel planning and flight booking. The app uses Firebase for authentication and Google AI (Genkit) for intelligent travel recommendations.

## Architecture
- **Frontend**: Next.js 15 with React 18, Tailwind CSS, Radix UI components
- **AI/Backend**: Google Genkit for AI flows (flight search parsing, itinerary generation, booking assistance)
- **Authentication**: Firebase Auth
- **State Management**: React Context for auth state
- **UI**: Radix UI components with Tailwind styling

## Current Status
- ✅ Dependencies installed
- ✅ Next.js configured for Replit environment (CORS, host settings)
- ✅ Workflow configured on port 5000
- ✅ Environment variables template created
- ✅ Deployment configuration set up

## Known Issues & Next Steps
1. **Environment Variables**: User needs to configure Firebase and Google AI API keys in `.env.local`
2. **Hydration Warnings**: Minor SSR hydration mismatches that don't break functionality
3. **CORS Warnings**: Next.js dev server warnings that don't affect production

## User Configuration Required
To make this app fully functional, configure these environment variables in `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
GOOGLE_GENAI_API_KEY=your-google-ai-api-key
```

## Recent Changes (Sept 14, 2025)
- Imported project from GitHub and configured for Replit
- Updated Next.js dev server to bind to 0.0.0.0:5000 for Replit compatibility
- Added CORS configuration with allowedDevOrigins
- Set up autoscale deployment configuration
- Created environment variables template

## Features
- AI-powered flight search and booking assistant
- Travel itinerary generation
- Firebase authentication (login/signup)
- Modern responsive UI with dark theme
- Flight filters and search functionality