#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment files for EcoSwap...\n');

// Create .env.local file
const envLocalContent = `# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
`;

// Create .env file
const envContent = `# Firebase Service Account Key (JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com"}

# Gemini AI API Keys (Dual System for Load Balancing)
# API Key 1: For Semantic Search (text-embedding-004 model)
GEMINI_API_KEY_SEARCH="your-semantic-search-api-key"

# API Key 2: For Comparison Generation (gemini-1.5-pro model)
GEMINI_API_KEY_COMPARE="your-comparison-generation-api-key"

# Fallback API Key (if dual keys not configured)
GEMINI_API_KEY="your-fallback-gemini-api-key"
`;

try {
  // Write .env.local
  fs.writeFileSync('.env.local', envLocalContent);
  console.log('✅ Created .env.local file');
  
  // Write .env
  fs.writeFileSync('.env', envContent);
  console.log('✅ Created .env file');
  
  console.log('\n🎉 Environment files created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Edit .env.local and .env files with your actual API keys');
  console.log('2. Get Firebase config from: https://console.firebase.google.com/');
  console.log('3. Get Gemini API keys from: https://aistudio.google.com/app/apikey');
  console.log('   - Create 2 separate API keys for load balancing');
  console.log('   - Key 1: For semantic search (text-embedding-004)');
  console.log('   - Key 2: For comparison generation (gemini-1.5-pro)');
  console.log('4. Run "npm run dev" to start the development server');
  console.log('\n💡 The app will work with mock data even without API keys!');
  console.log('\n🔧 Dual API Key System:');
  console.log('   - GEMINI_API_KEY_SEARCH: Used for finding similar products');
  console.log('   - GEMINI_API_KEY_COMPARE: Used for generating persuasive comparisons');
  console.log('   - This prevents API rate limiting and improves performance');
  
} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
  console.log('\n📋 Manual setup:');
  console.log('1. Create .env.local file in the project root');
  console.log('2. Create .env file in the project root');
  console.log('3. Copy the content from SETUP.md');
}
