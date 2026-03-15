# Message Limit Feature Documentation

## Overview
The suspended user messaging system now includes a **2-message limit** to prevent spam while allowing suspended users to communicate with administrators.

## Features

### 1. Message Count Tracking
- Each user has a `suspensionMessageCount` field in the User model
- This counter tracks how many messages the user has sent while suspended
- Counter is stored in MongoDB and persists across sessions

### 2. Message Limit Enforcement
- **Limit**: 2 messages per suspension period
- Users can send up to 2 messages to the admin while their account is suspended
- After reaching the limit, the message form is disabled and replaced with a notification

### 3. Visual Feedback
- **Attempts Remaining**: Shows how many message attempts the user has left
- **Real-time Updates**: The UI updates immediately after each message is sent
- **Limit Reached State**: Special UI state when limit is reached

### 4. Automatic Reset
- When an admin **unsuspends** a user, the message count is automatically reset to 0
- This allows users to send 2 new messages if they are suspended again in the future

## User Experience

### First Message
1. User tries to sign in → sees suspension modal
2. Modal shows: "2 attempts left" (initially)
3. User writes and sends message
4. Success notification appears with "1 attempt remaining"

### Second Message  
1. User can still send one more message
2. Modal shows: "1 attempt left"
3. User writes and sends message
4. Success notification appears with "0 attempts remaining"

### Limit Reached
1. After 2 messages, the form is replaced with:
   ```
   ⚠️ Message Limit Reached
   You have sent 2 messages. Please wait for admin response.
   ```
2. User cannot send more messages until unsuspended

## Technical Implementation

### Database Schema
```typescript
// User Model
{
  suspensionMessageCount: {
    type: Number,
    default: 0,
  }
}
```

### API Flow

#### Sending a Message (`POST /api/suspended/message`)
1. Fetch user from database
2. Check current message count
3. If count >= 2:
   - Return 429 error with MESSAGE_LIMIT_REACHED
4. If count < 2:
   - Create message in database
   - Increment user's message count by 1
   - Return success with attemptsLeft

#### Unsuspending a User (`PATCH /api/admin/users/[userId]`)
1. When action is 'unsuspend':
   - Set `isSuspended` to false
   - Set `suspensionMessageCount` to 0 (reset)
   - Remove suspension reason and date

### Frontend Components

#### Sign In Page (`/app/auth/signin/page.tsx`)
- Fetches user's message count when showing suspension modal
- Displays attempts remaining
- Shows different UI states:
  - Form with attempts counter (count < 2)
  - Success message with remaining attempts
  - Limit reached warning (count >= 2)

## API Responses

### Successful Message Send
```json
{
  "success": true,
  "message": "Message sent successfully to admin",
  "data": { /* message object */ },
  "attemptsLeft": 1,
  "messageCount": 1
}
```

### Limit Reached
```json
{
  "success": false,
  "error": "MESSAGE_LIMIT_REACHED",
  "message": "You have reached the maximum limit of 2 messages...",
  "attemptsLeft": 0,
  "messageCount": 2
}
```

## Admin Features

### Message Management
- Admins can view all messages on `/admin/messages`
- Each message shows user email and suspension reason
- Admin can delete messages after reading them

### User Reactivation
- When admin clicks "Activate User" button:
  - User's account is unsuspended
  - Message count is reset to 0
  - User can sign in normally

## Benefits

### For Users
✅ Fair opportunity to explain their situation (2 messages)  
✅ Clear feedback on remaining attempts  
✅ Prevents frustration with clear limit notification

### For Admins
✅ Prevents message spam  
✅ Manageable message volume  
✅ Automatic reset on unsuspension

## Configuration

The message limit is currently hardcoded to **2 messages**. To change this:

1. Update the limit check in `/app/api/suspended/message/route.ts`:
```typescript
if (messageCount >= 2) { // Change 2 to desired limit
```

2. Update the calculation for attemptsLeft:
```typescript
const attemptsLeft = 2 - (messageCount + 1); // Change 2 to desired limit
```

3. Update the UI text in `/app/auth/signin/page.tsx` to reflect the new limit

## Testing

### Test Scenario 1: First Message
1. Sign in as suspended user
2. Send a message
3. Verify "1 attempt remaining" is shown

### Test Scenario 2: Second Message
1. Send second message
2. Verify "0 attempts remaining" or limit reached message

### Test Scenario 3: Limit Reached
1. Try to send third message
2. Verify error response and disabled form

### Test Scenario 4: Reset on Unsuspension
1. Admin unsuspends user
2. Admin suspends user again
3. User should have 2 fresh attempts

## Future Enhancements

Potential improvements:
- Configurable limit per user or globally
- Time-based reset (e.g., 1 message per day)
- Admin notification when limit is reached
- Message threading/conversations
- Email notifications to admin

## Related Documentation
- [SUSPENDED_USER_MESSAGING.md](./SUSPENDED_USER_MESSAGING.md) - Main messaging system documentation
- [ADMIN_FEATURES.md](./ADMIN_FEATURES.md) - Admin panel features