# Smart Decision Helper

A web application that helps users make better daily decisions using an intelligent recommendation engine based on contextual questions.

## Features

- 🔐 **User Authentication** - Sign up/login with credentials or Google OAuth
- 🎯 **Decision Creation** - Create decisions with multiple options
- 🏷️ **Smart Tagging** - Tag options with descriptive keywords
- ❓ **Contextual Questions** - Answer questions about time, energy, and goals
- 🤖 **AI Recommendation Engine** - Get personalized recommendations based on your inputs
- 📊 **Confidence Scoring** - See how confident the recommendation is
- 👍 **Feedback System** - Rate recommendations to help improve the system
- 📜 **Decision History** - Review past decisions and outcomes

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - Runtime environment
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Google OAuth credentials (optional, for Google sign-in)

### Installation

1. **Clone the repository**
   ```bash
   cd smart-decision-helper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update the variables in `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/smart-decision-helper
   NEXTAUTH_SECRET=your-generated-secret-key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   To generate a secure `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
smart-decision-helper/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── decisions/       # Decision endpoints
│   │   └── feedback/        # Feedback endpoint
│   ├── auth/                # Auth pages (signin, signup)
│   ├── dashboard/           # User dashboard
│   ├── decision/            # Decision flow pages
│   ├── history/             # Decision history page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── providers.tsx        # Session provider
├── components/              # Reusable components
│   ├── Navbar.tsx
│   ├── DecisionCard.tsx
│   ├── QuestionForm.tsx
│   └── ResultCard.tsx
├── lib/                     # Utility libraries
│   ├── mongodb.ts           # MongoDB connection
│   └── decisionEngine.ts    # Recommendation algorithm
├── models/                  # Database models
│   ├── User.ts
│   ├── Decision.ts
│   ├── Option.ts
│   └── Feedback.ts
├── types/                   # TypeScript types
│   └── next-auth.d.ts
└── public/                  # Static files
```

## How It Works

### Decision Engine Algorithm

The decision engine uses a scoring system based on three factors:

1. **Time Available**
   - Quick tasks score higher when time is limited
   - Longer tasks score higher when more time is available

2. **Energy Level**
   - Low energy favors relaxing, easy tasks
   - High energy favors active, challenging tasks

3. **Goal Alignment**
   - Tasks are scored based on alignment with user's stated goal
   - Productive goals favor work-related tasks
   - Relaxation goals favor leisure activities
   - Learning goals favor educational content

Each option receives points based on how well its tags match the user's answers. The option with the highest score is recommended.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Decisions
- `POST /api/decisions/create` - Create a new decision
- `GET /api/decisions/user` - Get user's decision history
- `POST /api/decisions/run` - Run decision engine

### Feedback
- `POST /api/feedback` - Submit feedback on recommendation

## Deployment to Railway

### Automated Deployment

1. **Connect your GitHub repository to Railway**
   - Go to [Railway](https://railway.app)
   - Create a new project from GitHub repo
   - Railway will auto-detect Next.js configuration

2. **Add environment variables in Railway dashboard**
   ```
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.railway.app
   GOOGLE_CLIENT_ID=your-client-id (optional)
   GOOGLE_CLIENT_SECRET=your-secret (optional)
   ```

3. **Deploy**
   - Railway will automatically build and deploy
   - Every push to main branch triggers a new deployment

### Manual Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize project**
   ```bash
   railway init
   ```

4. **Add environment variables**
   ```bash
   railway variables set MONGODB_URI="mongodb+srv://..."
   railway variables set NEXTAUTH_SECRET="your-secret"
   railway variables set NEXTAUTH_URL="https://your-app.railway.app"
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
5. Get your connection string
6. Update `MONGODB_URI` in your environment variables

### Local MongoDB

For development, you can use a local MongoDB instance:

```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or follow instructions for your OS

# Start MongoDB
brew services start mongodb-community

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/smart-decision-helper
```

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-app.railway.app/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to environment variables

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

## Roadmap

- [ ] User preferences learning
- [ ] Advanced analytics and insights
- [ ] Decision templates
- [ ] Collaborative decisions
- [ ] Mobile app version
- [ ] Integration with calendar apps
- [ ] Recurring decisions
- [ ] Decision sharing

## Acknowledgments

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS