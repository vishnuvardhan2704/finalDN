# Setup Guide for EcoSwap

This guide will help you set up the environment variables needed for the EcoSwap application to work properly.

## Quick Start (Development Mode)

The application is now configured to work with mock data when Firebase is not properly configured. You can run the app immediately:

```bash
cd my-downloaded-site/finalDN
npm run dev
```

The app will work with mock data and show sustainable product recommendations.

## Full Setup (Production Mode)

For full functionality with real Firebase database and AI recommendations, you need to set up environment variables:

### 1. Create Environment Files

Create these files in the `my-downloaded-site/finalDN/` directory:

#### `.env.local` (Client-side configuration)
```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

#### `.env` (Server-side configuration)
```env
# Firebase Service Account Key (JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com"}

# Gemini AI API Keys (Dual System for Load Balancing)
# API Key 1: For Semantic Search (text-embedding-004 model)
GEMINI_API_KEY_SEARCH="your-semantic-search-api-key"

# API Key 2: For Comparison Generation (gemini-1.5-pro model)
GEMINI_API_KEY_COMPARE="your-comparison-generation-api-key"

# Fallback API Key (if dual keys not configured)
GEMINI_API_KEY="your-fallback-gemini-api-key"
```

### 2. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key (downloads a JSON file)
6. Copy the JSON content to `FIREBASE_SERVICE_ACCOUNT_KEY`
7. Go to Project Settings > General
8. Add a web app and copy the configuration to `.env.local`

### 3. Get Gemini AI API Keys

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create **two separate API keys** for load balancing:
   - **Key 1**: For semantic search (text-embedding-004 model)
   - **Key 2**: For comparison generation (gemini-1.5-pro model)
3. Add the keys to your `.env` file

### 4. Run the Setup Script

```bash
npm run setup
```

This will create the environment files with placeholder values that you can then edit.

## Enhanced AI Features

### Dual API Key System

The application uses two separate Gemini API keys to prevent rate limiting and ensure optimal performance:

- **`GEMINI_API_KEY_SEARCH`**: Used for semantic search to find similar products
- **`GEMINI_API_KEY_COMPARE`**: Used for generating persuasive comparison text

### Advanced Carbon Intensity Analysis

The AI system now includes:

1. **Database Carbon Intensity**: Uses actual carbon intensity data when available
2. **Web Research**: When carbon intensity is not available, the AI researches and estimates it using:
   - Academic LCAs (Life Cycle Assessments)
   - Ecoinvent factors
   - ADEME and FAO databases
   - Industry averages
   - Peer-group comparisons

### Enhanced Prompt Templates

The system uses structured prompts for:
- **Standard Comparison**: When carbon intensity data is available
- **Research-Based Comparison**: When carbon intensity needs to be estimated
- **Methodology Tracking**: Includes uncertainty ranges and data gap flags

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Seeding (Optional)
```bash
npm run db:seed
```

## Troubleshooting

### Common Issues

1. **AI Recommendations Not Working**
   - Check that both Gemini API keys are set
   - Verify API quotas and limits
   - Check network connectivity

2. **Firebase Connection Issues**
   - Verify service account key format
   - Check Firestore rules
   - Ensure database is enabled

3. **Environment Variables Not Loading**
   - Restart the development server after changing `.env` files
   - Check file permissions
   - Verify file locations

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## Architecture Overview

The application uses a modern stack with:

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Google Gemini AI with dual API keys
- **Deployment**: Firebase Hosting

## Support

For detailed technical documentation, see `DOCUMENTATION.md` which includes:
- Complete system architecture
- File structure overview
- Process flow diagrams
- API documentation
- Performance optimization guidelines
