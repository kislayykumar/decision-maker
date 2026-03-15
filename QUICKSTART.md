# Quick Start Guide

Get the Smart Decision Helper running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- MongoDB (local or MongoDB Atlas account)
- Code editor (VS Code recommended)

## Step 1: Install Dependencies

```bash
cd smart-decision-helper
npm install
```

## Step 2: Set Up Environment Variables

The `.env.local` file already exists with default values. You need to update it:

```bash
# Open .env.local in your editor
code .env.local  # or use your preferred editor
```

Update these values:

### Option A: Using Local MongoDB (Quickest)

```env
MONGODB_URI=mongodb://localhost:27017/smart-decision-helper
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
```

### Option B: Using MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-decision-helper
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `NEXTAUTH_SECRET` in `.env.local`.

## Step 3: Start the Development Server

```bash
npm run dev
```

You should see:
```
   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000
   - Ready in 2.3s
```

## Step 4: Open Your Browser

Visit **http://localhost:3000**

You should see the landing page!

## Step 5: Test the Application

### Create an Account

1. Click "Sign Up" in the navigation
2. Fill in your details:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Sign up"
4. You'll be automatically logged in and redirected to the dashboard

### Create Your First Decision

1. Click "New Decision" on the dashboard
2. Enter a decision title: "What should I do this evening?"
3. Add options:
   - Option 1: "Watch a movie"
     - Tags: relaxing, entertainment, long
   - Option 2: "Go for a run"
     - Tags: active, quick, intense
   - Option 3: "Read a book"
     - Tags: relaxing, educational, moderate
4. Click "Continue to Questions"

### Answer the Questions

1. How much time do you have? **30 minutes**
2. What is your energy level? **Medium**
3. What is your goal? **Relax**

### Get Your Recommendation

You'll see a recommendation with:
- The best option for your situation
- A confidence score (0-100%)
- Reasoning for the recommendation

### Provide Feedback

Click either:
- "Yes, helpful" (positive feedback)
- "Not helpful" (negative feedback)

### View Your History

Click "History" in the navigation to see all your past decisions.

## Troubleshooting

### "MongoError: Authentication failed"

**Fix:** Check your MongoDB connection string in `.env.local`

### "Error: NEXTAUTH_SECRET not set"

**Fix:** Make sure you've set `NEXTAUTH_SECRET` in `.env.local`

### Port 3000 already in use

**Fix:** Kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

Or use a different port:
```bash
PORT=3001 npm run dev
```

### Cannot connect to MongoDB

**Local MongoDB:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if not running
brew services start mongodb-community
```

**MongoDB Atlas:**
- Verify your connection string is correct
- Check that your IP is whitelisted (or use 0.0.0.0/0)
- Ensure database user has read/write permissions

## Next Steps

### Explore Features

- ✅ Create multiple decisions
- ✅ Try different tag combinations
- ✅ Test with various question answers
- ✅ Review your decision history
- ✅ Provide feedback on recommendations

### Customize

- Modify the questions in `lib/decisionEngine.ts`
- Adjust the scoring algorithm
- Add custom tags for your use case
- Customize the UI colors in `tailwind.config.ts`

### Deploy to Production

Ready to deploy? Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide to deploy on Railway.

## Project Structure Overview

```
smart-decision-helper/
├── app/                    # Next.js pages and routes
│   ├── api/               # Backend API endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── decision/          # Decision creation flow
│   └── history/           # Decision history
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
│   ├── mongodb.ts        # Database connection
│   └── decisionEngine.ts # Recommendation algorithm
├── models/               # Database models
└── .env.local           # Your environment variables (not in git)
```

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
# (Connect to your MongoDB and view data)
mongosh "mongodb://localhost:27017/smart-decision-helper"
```

## Learn More

- [README.md](README.md) - Complete project documentation
- [FEATURES.md](FEATURES.md) - Detailed feature explanations
- [TESTING.md](TESTING.md) - Testing guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions

## Need Help?

- Check the troubleshooting section above
- Review the full documentation files
- Check application logs in the terminal
- Open an issue on GitHub

---

**That's it!** You're now running the Smart Decision Helper locally. Enjoy making better decisions! 🎯