# Getting Started Checklist

Use this checklist to get your Smart Decision Helper up and running.

## Pre-Development Setup

### ✅ Prerequisites
- [ ] Node.js 18+ installed (`node --version` to check)
- [ ] npm or yarn installed (`npm --version` to check)
- [ ] Code editor installed (VS Code recommended)
- [ ] Git installed (for deployment)

### ✅ MongoDB Setup
Choose one option:

**Option A: Local MongoDB (Quickest)**
- [ ] Install MongoDB locally
- [ ] Start MongoDB service
- [ ] Connection string: `mongodb://localhost:27017/smart-decision-helper`

**Option B: MongoDB Atlas (Recommended)**
- [ ] Create MongoDB Atlas account
- [ ] Create a free cluster
- [ ] Create database user
- [ ] Whitelist IP address (0.0.0.0/0 for all)
- [ ] Copy connection string
- [ ] Replace `<password>` in connection string

## Local Development Setup

### ✅ Installation
```bash
cd smart-decision-helper
```
- [ ] Run `npm install` (wait for completion)
- [ ] Verify no errors in installation

### ✅ Environment Configuration
- [ ] File `.env.local` exists
- [ ] Generate NextAuth secret: `openssl rand -base64 32`
- [ ] Update `MONGODB_URI` in `.env.local`
- [ ] Update `NEXTAUTH_SECRET` in `.env.local`
- [ ] Keep `NEXTAUTH_URL=http://localhost:3000`
- [ ] (Optional) Add Google OAuth credentials

### ✅ First Run
- [ ] Run `npm run dev`
- [ ] See "Ready in X.Xs" message
- [ ] No error messages in terminal
- [ ] Open browser to http://localhost:3000
- [ ] Landing page loads successfully

## Testing the Application

### ✅ Authentication Testing
- [ ] Click "Sign Up" button
- [ ] Create test account:
  - Name: Test User
  - Email: test@example.com
  - Password: test123456
- [ ] Submit form
- [ ] Redirected to dashboard
- [ ] Name appears in navbar
- [ ] Sign out works
- [ ] Sign back in with same credentials

### ✅ Decision Creation Testing
- [ ] Click "New Decision" on dashboard
- [ ] Enter decision title: "Test Decision"
- [ ] Add Option 1:
  - Name: "Option A"
  - Tags: quick, easy, relaxing
- [ ] Add Option 2:
  - Name: "Option B"
  - Tags: long, challenging, productive
- [ ] Click "Continue to Questions"
- [ ] Questions page loads

### ✅ Question Flow Testing
- [ ] Answer Question 1: "30 minutes"
- [ ] Answer Question 2: "Medium"
- [ ] Answer Question 3: "Be productive"
- [ ] Redirected to results page
- [ ] Recommendation is shown
- [ ] Confidence score displayed (0-100%)
- [ ] Reasoning text makes sense

### ✅ Feedback Testing
- [ ] Click "Yes, helpful" or "Not helpful"
- [ ] Success message appears
- [ ] Redirected to dashboard after 2 seconds

### ✅ History Testing
- [ ] Click "History" in navbar
- [ ] See your test decision listed
- [ ] Decision card shows:
  - Title
  - Date
  - Options
  - Feedback rating

### ✅ UI/UX Testing
- [ ] Navbar links work
- [ ] All buttons are clickable
- [ ] Forms validate properly
- [ ] Loading states appear
- [ ] Error messages are clear
- [ ] Success messages appear
- [ ] Responsive on mobile (resize browser)

## Database Verification

### ✅ Check MongoDB
Using MongoDB Compass or mongosh:
- [ ] Connect to your database
- [ ] Check `users` collection has 1 document
- [ ] Check `decisions` collection has 1 document
- [ ] Check `options` collection has 2 documents
- [ ] Check `feedback` collection has 1 document

## Code Quality Check

### ✅ Review Code
- [ ] No console errors in browser
- [ ] No TypeScript errors in terminal
- [ ] All files are properly formatted
- [ ] No unused imports

### ✅ Run Linter (Optional)
```bash
npm run lint
```
- [ ] No linting errors
- [ ] Fix any warnings if needed

## Documentation Review

### ✅ Read Documentation
- [ ] Read README.md for overview
- [ ] Read QUICKSTART.md for setup
- [ ] Skim FEATURES.md for feature details
- [ ] Bookmark TESTING.md for reference
- [ ] Review DEPLOYMENT.md before deploying

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All features working locally
- [ ] No critical bugs
- [ ] Environment variables documented
- [ ] .gitignore includes `.env.local`
- [ ] Code committed to Git

### ✅ MongoDB Atlas Setup
- [ ] Using MongoDB Atlas (not local)
- [ ] Connection string updated
- [ ] IP whitelist configured
- [ ] Database user has correct permissions

### ✅ Railway Account
- [ ] Create Railway account
- [ ] GitHub account connected
- [ ] Payment method added (if needed)

## Deployment to Railway

### ✅ Connect Repository
- [ ] Push code to GitHub
- [ ] Create new Railway project
- [ ] Connect GitHub repository
- [ ] Railway detects Next.js

### ✅ Configure Environment Variables
Add these in Railway dashboard:
- [ ] `MONGODB_URI` set
- [ ] `NEXTAUTH_SECRET` set
- [ ] `NEXTAUTH_URL` set to Railway domain
- [ ] (Optional) Google OAuth credentials

### ✅ Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors
- [ ] Visit deployed URL
- [ ] Test sign up on production
- [ ] Create a test decision
- [ ] Verify everything works

### ✅ Post-Deployment
- [ ] Custom domain configured (optional)
- [ ] SSL certificate valid
- [ ] Test on different devices
- [ ] Monitor error logs
- [ ] Set up auto-deploy on push

## Production Monitoring

### ✅ Regular Checks
- [ ] Check Railway dashboard for errors
- [ ] Monitor database usage
- [ ] Review user feedback
- [ ] Check performance metrics
- [ ] Update dependencies monthly

## Common Issues Resolution

### ✅ If Build Fails
- [ ] Check build logs in Railway
- [ ] Verify all dependencies in package.json
- [ ] Ensure environment variables are set
- [ ] Check Node.js version compatibility

### ✅ If Authentication Fails
- [ ] Verify NEXTAUTH_URL matches domain
- [ ] Check NEXTAUTH_SECRET is set
- [ ] Test with incognito browser
- [ ] Clear browser cookies

### ✅ If Database Connection Fails
- [ ] Verify MongoDB connection string
- [ ] Check database user credentials
- [ ] Confirm IP whitelist includes 0.0.0.0/0
- [ ] Test connection from Railway logs

## Advanced Features (Optional)

### ✅ Google OAuth Setup
- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URIs
- [ ] Update environment variables
- [ ] Test Google sign-in

### ✅ Custom Domain
- [ ] Purchase domain
- [ ] Add domain to Railway
- [ ] Update DNS records
- [ ] Update NEXTAUTH_URL
- [ ] Test SSL certificate

### ✅ Monitoring & Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Configure uptime monitoring
- [ ] Set up alert notifications

## Success Criteria

### ✅ You're Done When:
- [ ] Application runs locally without errors
- [ ] All features tested and working
- [ ] Deployed successfully to Railway
- [ ] Production URL accessible
- [ ] Database connected and working
- [ ] Authentication functional
- [ ] Decision flow works end-to-end
- [ ] Documentation reviewed
- [ ] No critical issues

## Next Steps After Completion

### ✅ Ongoing
- [ ] Share with beta users
- [ ] Collect feedback
- [ ] Monitor usage patterns
- [ ] Plan feature enhancements
- [ ] Keep dependencies updated
- [ ] Review security best practices

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Git
git add .
git commit -m "message"
git push origin main

# Generate secret
openssl rand -base64 32

# Check MongoDB locally
mongosh "mongodb://localhost:27017/smart-decision-helper"
```

## Need Help?

- 📖 Review documentation files
- 🐛 Check TESTING.md for troubleshooting
- 🚀 Review DEPLOYMENT.md for deployment issues
- 💬 Open an issue on GitHub
- 📧 Contact support

---

**Congratulations!** 🎉

Once you've completed this checklist, your Smart Decision Helper is ready to help users make better decisions!