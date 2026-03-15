# Testing Guide

This guide helps you test the Smart Decision Helper application thoroughly before deployment.

## Local Testing

### 1. Set Up Test Environment

```bash
# Install dependencies
cd smart-decision-helper
npm install

# Set up environment variables
cp .env.example .env.local

# Update .env.local with test MongoDB URI
# You can use a local MongoDB or a test database on MongoDB Atlas
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Testing Checklist

### Authentication Tests

#### Sign Up Flow
- [ ] Navigate to Sign Up page
- [ ] Try submitting with empty fields (should show validation errors)
- [ ] Try submitting with invalid email format (should show error)
- [ ] Try submitting with password < 6 characters (should show error)
- [ ] Try submitting with mismatched passwords (should show error)
- [ ] Submit valid sign up form
- [ ] Verify automatic login after sign up
- [ ] Verify redirect to dashboard
- [ ] Check if user appears in MongoDB

#### Sign In Flow
- [ ] Navigate to Sign In page
- [ ] Try invalid credentials (should show error)
- [ ] Try valid credentials
- [ ] Verify redirect to dashboard
- [ ] Check session persistence (refresh page)

#### Sign Out Flow
- [ ] Click sign out button
- [ ] Verify redirect to home page
- [ ] Verify session is cleared
- [ ] Try accessing protected routes (should redirect to sign in)

#### Google OAuth (If Configured)
- [ ] Click "Sign in with Google"
- [ ] Complete Google authentication
- [ ] Verify user creation in database
- [ ] Verify redirect to dashboard

### Decision Creation Tests

#### Create Decision
- [ ] Navigate to Create Decision page
- [ ] Try submitting without title (should show error)
- [ ] Try submitting with only one option (should show error)
- [ ] Add a decision with 2 options
- [ ] Add tags to options (try: quick, relaxing, productive, etc.)
- [ ] Submit form
- [ ] Verify redirect to questions page

#### Tag System
- [ ] Add multiple tags to one option
- [ ] Try adding duplicate tags (should be prevented)
- [ ] Remove tags
- [ ] Add option without tags (should work)

### Question Flow Tests

#### Answer Questions
- [ ] Verify progress bar updates
- [ ] Answer first question (time)
- [ ] Use back button (should return to previous question)
- [ ] Answer all questions sequentially
- [ ] Verify smooth transitions

### Recommendation Tests

#### View Result
- [ ] Verify recommended option is displayed
- [ ] Check confidence score is shown (0-100%)
- [ ] Read the reasoning text
- [ ] Verify it makes sense based on answers

#### Submit Feedback
- [ ] Click "Yes, helpful" button
- [ ] Verify feedback submitted message
- [ ] Check redirect to dashboard after delay
- [ ] Create another decision
- [ ] Submit "Not helpful" feedback
- [ ] Verify feedback saved in database

### History Tests

#### View History
- [ ] Navigate to History page
- [ ] Verify past decisions are listed
- [ ] Check decision cards show:
  - [ ] Title
  - [ ] Creation date
  - [ ] Options count
  - [ ] Feedback (if submitted)

#### Empty History
- [ ] Create a new user account
- [ ] Navigate to History page
- [ ] Verify "No decisions yet" message
- [ ] Click "Create Decision" button

### UI/UX Tests

#### Navigation
- [ ] Test all navbar links
- [ ] Verify active state indicators
- [ ] Test navigation while signed out
- [ ] Test navigation while signed in

#### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify all layouts adapt properly
- [ ] Check that all buttons are tappable on mobile

#### Visual Elements
- [ ] Verify all icons display correctly
- [ ] Check color scheme consistency
- [ ] Test hover states on buttons
- [ ] Verify loading spinners appear
- [ ] Check error messages are readable

### API Tests

Use tools like Postman or curl to test API endpoints.

#### Auth Endpoints

**Sign Up**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected: 201 Created with user object

**Sign Up - Duplicate Email**
```bash
# Try same email again
```
Expected: 400 Bad Request with error message

#### Decision Endpoints

**Create Decision** (requires authentication)
```bash
curl -X POST http://localhost:3000/api/decisions/create \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "title": "What to do tonight?",
    "options": [
      {
        "name": "Watch a movie",
        "tags": ["relaxing", "entertainment", "long"]
      },
      {
        "name": "Go for a run",
        "tags": ["active", "quick", "energizing"]
      }
    ]
  }'
```

Expected: 201 Created with decision object

**Get User Decisions**
```bash
curl -X GET http://localhost:3000/api/decisions/user \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

Expected: 200 OK with array of decisions

**Run Decision Engine**
```bash
curl -X POST http://localhost:3000/api/decisions/run \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "decisionId": "DECISION_ID",
    "answers": [
      {"question": "time", "answer": "10 minutes"},
      {"question": "energy", "answer": "Low"},
      {"question": "goal", "answer": "Relax"}
    ]
  }'
```

Expected: 200 OK with recommendation result

**Submit Feedback**
```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "decisionId": "DECISION_ID",
    "optionChosen": "Watch a movie",
    "rating": "positive"
  }'
```

Expected: 201 Created with feedback object

### Database Tests

#### Verify Data Persistence
- [ ] Check User collection in MongoDB
- [ ] Check Decision collection
- [ ] Check Option collection
- [ ] Check Feedback collection
- [ ] Verify foreign key relationships (userId, decisionId)

#### Data Integrity
- [ ] Verify password is hashed (not plain text)
- [ ] Check timestamps are created automatically
- [ ] Verify default values are applied
- [ ] Test unique constraints (e.g., duplicate emails)

### Error Handling Tests

#### Network Errors
- [ ] Disconnect from internet
- [ ] Try submitting a form
- [ ] Verify appropriate error message

#### Invalid Data
- [ ] Send malformed JSON to API
- [ ] Send missing required fields
- [ ] Send invalid data types
- [ ] Verify proper error responses

#### Session Expiry
- [ ] Clear session cookie
- [ ] Try accessing protected page
- [ ] Verify redirect to sign in

### Performance Tests

#### Page Load Times
- [ ] Measure landing page load
- [ ] Measure dashboard load with history
- [ ] Test with 50+ decisions in history

#### Decision Engine
- [ ] Test with 2 options
- [ ] Test with 10 options
- [ ] Test with 50 options
- [ ] Verify response time < 1 second

### Security Tests

#### Authentication
- [ ] Try accessing /dashboard without login
- [ ] Try accessing /api/decisions/user without token
- [ ] Verify JWT expiration works

#### Input Validation
- [ ] Try XSS attacks in form fields
- [ ] Try SQL injection patterns
- [ ] Verify input sanitization

#### CORS
- [ ] Test API access from different origins
- [ ] Verify proper CORS headers

## Automated Testing (Optional)

### Unit Tests Example

Create `__tests__/decisionEngine.test.ts`:

```typescript
import { runDecisionEngine } from '../lib/decisionEngine';

describe('Decision Engine', () => {
  it('should recommend quick option when time is limited', () => {
    const options = [
      { _id: '1', optionName: 'Long task', tags: ['long'] },
      { _id: '2', optionName: 'Quick task', tags: ['quick'] },
    ];
    
    const answers = [
      { question: 'time', answer: '10 minutes' },
      { question: 'energy', answer: 'Medium' },
      { question: 'goal', answer: 'Be productive' },
    ];

    const result = runDecisionEngine(options, answers);
    expect(result.recommended_option).toBe('Quick task');
  });
});
```

Run with:
```bash
npm test
```

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All manual tests pass
- [ ] No console errors in browser
- [ ] No API errors in terminal
- [ ] Database queries are optimized
- [ ] Environment variables are configured
- [ ] .env.local is in .gitignore
- [ ] Sensitive data is not committed
- [ ] README is up to date
- [ ] DEPLOYMENT.md is accurate
- [ ] Error handling is comprehensive
- [ ] Loading states are implemented
- [ ] Success messages are clear
- [ ] Error messages are helpful

## Post-Deployment Testing

After deploying to Railway:

- [ ] Test all authentication flows in production
- [ ] Create test decisions
- [ ] Verify database connections work
- [ ] Test on multiple devices/browsers
- [ ] Check production logs for errors
- [ ] Verify Google OAuth (if enabled)
- [ ] Test performance under load
- [ ] Monitor error rates
- [ ] Check SSL certificate is valid
- [ ] Verify custom domain works (if configured)

## Common Issues and Solutions

### Issue: "MongoError: Authentication failed"
**Solution:** Check MONGODB_URI has correct username/password

### Issue: "Error: NEXTAUTH_SECRET not set"
**Solution:** Set NEXTAUTH_SECRET environment variable

### Issue: Redirect loop on sign in
**Solution:** Verify NEXTAUTH_URL matches your domain

### Issue: Google OAuth not working
**Solution:** Check redirect URIs in Google Cloud Console

### Issue: Session not persisting
**Solution:** Check that cookies are enabled and NEXTAUTH_URL is correct

## Reporting Bugs

When reporting issues, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/device information
5. Screenshots/videos if applicable
6. Console error messages
7. Network tab information

## Need Help?

- Check README.md for setup instructions
- Review DEPLOYMENT.md for deployment issues
- Check application logs for errors
- Open an issue on GitHub with details