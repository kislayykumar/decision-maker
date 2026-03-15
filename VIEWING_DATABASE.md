# How to View MongoDB Data

## Method 1: MongoDB Shell (mongosh) - Terminal Based

### Connect to your database:
```bash
mongosh "mongodb://localhost:27017/smart-decision-helper"
```

### Basic Commands:
```javascript
// Show all databases
show dbs

// Use your database
use smart-decision-helper

// Show all collections (tables)
show collections

// View all users
db.users.find().pretty()

// View all decisions
db.decisions.find().pretty()

// View all options
db.options.find().pretty()

// View all feedback
db.feedbacks.find().pretty()

// Count documents
db.users.countDocuments()
db.decisions.countDocuments()

// Find specific user by email
db.users.findOne({ email: "your-email@example.com" })

// View latest 5 decisions
db.decisions.find().sort({ createdAt: -1 }).limit(5).pretty()

// Exit mongosh
exit
```

## Method 2: MongoDB Compass (GUI Application) - Recommended

MongoDB Compass is a free, visual tool for exploring your data.

### Install MongoDB Compass:
```bash
brew install --cask mongodb-compass
```

### Connect:
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"
4. Navigate to `smart-decision-helper` database
5. Click on any collection to view data

## Method 3: VS Code Extension

### Install MongoDB for VS Code:
1. Open VS Code
2. Go to Extensions (⌘+Shift+X)
3. Search for "MongoDB for VS Code"
4. Install the official MongoDB extension
5. Click the MongoDB icon in sidebar
6. Add connection: `mongodb://localhost:27017`
7. Browse your `smart-decision-helper` database

## Method 4: Quick Command Line Queries

### View users:
```bash
mongosh "mongodb://localhost:27017/smart-decision-helper" --eval "db.users.find().pretty()"
```

### View decisions:
```bash
mongosh "mongodb://localhost:27017/smart-decision-helper" --eval "db.decisions.find().pretty()"
```

### Count all documents:
```bash
mongosh "mongodb://localhost:27017/smart-decision-helper" --eval "
  print('Users:', db.users.countDocuments());
  print('Decisions:', db.decisions.countDocuments());
  print('Options:', db.options.countDocuments());
  print('Feedback:', db.feedbacks.countDocuments());
"
```

## Method 5: Create a Database Viewer Script

I can create a simple Node.js script that displays your data in a formatted way. Would you like me to create that?

## Current Data in Your Database

Based on the terminal logs, you have:
- ✅ Successfully created a user account
- ✅ User logged in successfully
- ✅ Visited dashboard and history pages
- ✅ Database is working!

Try running this command to see your data:
```bash
mongosh "mongodb://localhost:27017/smart-decision-helper" --eval "db.users.find().pretty()"