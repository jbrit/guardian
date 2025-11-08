# Guardian - Slack Bot

A TypeScript-based Slack bot for automated monitoring and alerts, built with Slack Bolt API and MongoDB persistence.

## Features

- 🤖 Slack Bolt API integration
- 💾 MongoDB data persistence
- 🚀 Automated deployment to AWS EC2 via GitHub Actions
- 🔧 Environment variable configuration
- 🐳 Docker containerization
- 📝 TypeScript support

## Prerequisites

- Node.js 18+
- Yarn package manager
- Docker (for local development)
- MongoDB (local or cloud instance)
- Slack App with Bot Token

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd guardian
yarn install
```

### 2. Environment Setup

Copy the example environment file and configure your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Slack Bot Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-your-app-token-here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017

# Server Configuration
PORT=3000
```

### 3. Development

```bash
# Start with local MongoDB
docker-compose up -d mongodb

# Run in development mode
yarn dev
```

### 4. Production Build

```bash
yarn build
yarn start
```

## Docker Deployment

### Local Testing

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Production Deployment

The application includes automated deployment to AWS EC2 via GitHub Actions.

#### Required GitHub Secrets

Set these secrets in your GitHub repository:

- `EC2_HOST`: Your EC2 instance public IP or DNS
- `EC2_USER`: SSH username (usually `ubuntu` for Ubuntu instances)
- `EC2_SSH_KEY`: Private SSH key for EC2 access

#### EC2 Setup

1. Launch an EC2 instance with Ubuntu
2. Install Docker:

```bash
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

3. Create environment file on EC2:

```bash
mkdir -p /home/ubuntu/guardian
# Upload your .env file to /home/ubuntu/guardian/.env
```

4. The GitHub Actions workflow will handle deployment automatically on pushes to main/master branch.

## Slack App Setup

1. Go to [Slack API](https://api.slack.com/apps)
2. Create a new app
3. Enable Socket Mode
4. Add Bot Token Scopes:
   - `app_mentions:read`
   - `channels:history`
   - `chat:write`
   - `im:history`
   - `mpim:history`
5. Install the app to your workspace
6. Copy the tokens to your `.env` file

## Available Commands

- `hello` - Basic greeting
- `@guardian` - Health check

## Project Structure

```
guardian/
├── src/
│   └── index.ts          # Main application
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions CI/CD
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Local development setup
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── .env.example          # Environment variables template
```

## Development

### Adding New Features

1. Create new message/command handlers in `src/index.ts`
2. Add MongoDB operations for data persistence
3. Update environment variables if needed
4. Test locally with Docker Compose
5. Commit and push to trigger deployment

### Testing

```bash
# Run tests
yarn test

# Build for production
yarn build
```

## License

ISC
