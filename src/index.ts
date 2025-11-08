import { App } from '@slack/bolt';
import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const {
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_APP_TOKEN,
  MONGODB_URI,
  PORT = '3000'
} = process.env;

// Validate required environment variables
if (!SLACK_BOT_TOKEN || !SLACK_SIGNING_SECRET || !SLACK_APP_TOKEN) {
  console.error('Missing required Slack environment variables');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('Missing MongoDB URI environment variable');
  process.exit(1);
}

// Initialize MongoDB client
const mongoClient = new MongoClient(MONGODB_URI);
let db: Db;

// Initialize Slack app
const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN,
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db('guardian');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Basic message handler
app.message('hello', async ({ message, say }) => {
  try {
    // Type guard to ensure message has user property
    if ('user' in message && typeof message.user === 'string') {
      await say(`Hey there <@${message.user}>! I'm Guardian, your monitoring bot. How can I help you today?`);
    } else {
      await say('Hello! I\'m Guardian, your monitoring bot. How can I help you today?');
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

// Health check endpoint
app.event('app_mention', async ({ event, say }) => {
  try {
    await say(`Hello! I'm Guardian, your Slack monitoring bot. I'm currently online and monitoring your workspace.`);
  } catch (error) {
    console.error('Error handling app mention:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await mongoClient.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoClient.close();
  process.exit(0);
});

// Start the app
(async () => {
  try {
    await connectToMongoDB();

    await app.start();
    console.log('Guardian Slack bot is running!');
    console.log(`Listening on port ${PORT}`);
  } catch (error) {
    console.error('Failed to start the app:', error);
    process.exit(1);
  }
})();
