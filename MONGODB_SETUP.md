# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - 5 minutes)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Verify your email

### Step 2: Create Free Cluster
1. Choose "Create a FREE cluster"
2. Select your preferred cloud provider (AWS recommended)
3. Choose a region close to you
4. Cluster Name: Keep default or name it "smart-decision-helper"
5. Click "Create Deployment"
6. Wait 1-3 minutes for cluster creation

### Step 3: Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `dbuser` (or your choice)
5. Password: Click "Autogenerate Secure Password" and COPY IT
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

### Step 4: Allow Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"
5. Wait for status to change to "Active"

### Step 5: Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Drivers"
4. Select "Node.js" and version "5.5 or later"
5. Copy the connection string
6. It looks like: `mongodb+srv://dbuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update .env.local
Replace `<password>` in the connection string with the password you copied earlier.

Open `smart-decision-helper/.env.local` and update:
```
MONGODB_URI=mongodb+srv://dbuser:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/smart-decision-helper?retryWrites=true&w=majority
```

**Important:** 
- Replace `YOUR_ACTUAL_PASSWORD` with your actual password
- Add `/smart-decision-helper` before the `?` to specify the database name

### Step 7: Test Connection
The dev server is already running. Just:
1. Open http://localhost:3000
2. Click "Sign Up"
3. Create an account
4. If it works - MongoDB is connected! ✅

---

## Option 2: Local MongoDB (macOS)

### Install MongoDB
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify it's running
brew services list | grep mongodb
```

### Your .env.local is already configured for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/smart-decision-helper
```

### Test Connection
```bash
# Connect to MongoDB shell
mongosh "mongodb://localhost:27017/smart-decision-helper"

# List databases
show dbs

# Exit
exit
```

---

## Troubleshooting

### "Authentication failed"
- Check your password is correct (no spaces)
- Make sure you replaced `<password>` in connection string

### "IP not whitelisted"
- Go to Network Access in Atlas
- Make sure 0.0.0.0/0 is added and Active

### "Connection timeout"
- Check your internet connection
- Verify cluster is running in Atlas dashboard

### Still having issues?
1. Check the dev server terminal for specific error messages
2. Try the connection string in MongoDB Compass to test
3. Make sure .env.local is saved properly

---

## Quick Test Checklist

- [ ] MongoDB Atlas account created OR local MongoDB installed
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] `.env.local` updated with correct MONGODB_URI
- [ ] Dev server is running (npm run dev)
- [ ] Open http://localhost:3000
- [ ] Sign up works without errors
- [ ] User can log in

**Once all checkboxes are ✅, your database is ready!**