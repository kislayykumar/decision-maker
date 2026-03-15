# Suspended User Messaging System

## Overview

The **Suspended User Messaging System** allows suspended users to communicate with administrators to request account reactivation or appeal their suspension. This feature provides a direct communication channel between suspended users and administrators.

---

## Features

### For Suspended Users

When a suspended user tries to sign in, they will:

1. **See a Suspension Modal** - A beautiful, animated modal appears showing:
   - Account suspension status with warning icon
   - The specific reason for suspension
   - A message form to contact the administrator

2. **Send Messages to Admin** - Users can:
   - Write up to 1000 characters explaining their situation
   - Submit the message with a single click
   - See character count as they type
   - Get confirmation when the message is sent successfully

3. **User-Friendly Interface**:
   - Clean, modern design with smooth animations
   - Clear visual feedback during message submission
   - Success confirmation with green checkmark
   - Easy-to-use close button

### For Administrators

Administrators have access to a dedicated **Messages** page where they can:

1. **View All Messages** - See all messages from suspended users in a list view:
   - User name and email
   - Message preview (first 2 lines)
   - Timestamp
   - Unread indicator (pulsing blue dot)

2. **Read Messages** - Click on any message to view:
   - Full user information
   - Complete suspension reason
   - Full message content
   - Timestamp

3. **Mark as Read** - Messages are automatically marked as read when viewed

4. **Delete Messages** - Remove messages after review with confirmation dialog

5. **Unread Count** - See at a glance how many unread messages need attention

---

## How It Works

### User Flow

1. **User attempts to sign in** → System checks if account is suspended
2. **If suspended** → Suspension modal appears instead of successful login
3. **User reads suspension reason** → Understands why account was suspended
4. **User writes message** → Explains their situation or requests reactivation
5. **User submits message** → Message is saved to database
6. **Confirmation shown** → User sees success message
7. **Admin notified** → Message appears in admin panel

### Admin Flow

1. **Admin logs in** → Sees Messages link in navigation
2. **Navigates to Messages** → Views all messages with unread count
3. **Clicks on message** → Views full details
4. **Message marked as read** → Unread indicator removed
5. **Reviews content** → Decides on action
6. **Takes action** → Can unsuspend user via User Management
7. **Deletes message** → Removes message after handling

---

## Database Schema

### SuspendedUserMessage Model

```typescript
{
  userEmail: string,      // Email of suspended user
  userName: string,       // Name of suspended user
  message: string,        // User's message (max 1000 chars)
  suspensionReason: string, // Original suspension reason
  isRead: boolean,        // Whether admin has read it
  createdAt: Date        // When message was sent
}
```

---

## API Endpoints

### POST /api/suspended/message
**Purpose**: Send a message from suspended user to admin  
**Access**: Public (no authentication required)  
**Body**:
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "message": "Message text here...",
  "suspensionReason": "Violation of terms"
}
```

### GET /api/admin/messages
**Purpose**: Get all messages from suspended users  
**Access**: Admin only  
**Returns**: Array of messages sorted by newest first

### PATCH /api/admin/messages/[messageId]
**Purpose**: Mark a message as read  
**Access**: Admin only  
**Returns**: Updated message object

### DELETE /api/admin/messages/[messageId]
**Purpose**: Delete a message  
**Access**: Admin only  
**Returns**: Success confirmation

---

## Usage Guide

### For Users

**When Your Account is Suspended:**

1. Try to sign in with your credentials
2. The suspension modal will appear automatically
3. Read the suspension reason carefully
4. Click in the text area and type your message
5. Explain your situation or request account reactivation
6. Click "Send Message" button
7. Wait for success confirmation
8. Click "Close" when done

**Tips for Users:**
- Be polite and professional in your message
- Clearly explain why you believe the suspension should be lifted
- Provide any relevant information or context
- Keep your message under 1000 characters

### For Administrators

**Managing Suspended User Messages:**

1. Sign in to admin panel
2. Click "Messages" (💬) in the navigation bar
3. View the list of messages
4. Check the unread count at the top
5. Click on any message to view full details
6. Review the suspension reason and user's message
7. Take appropriate action:
   - Go to User Management to unsuspend the account if appropriate
   - Delete the message after handling
8. Respond to user through email if needed (outside this system)

**Best Practices:**
- Check messages regularly
- Mark messages as read by viewing them
- Delete messages after resolving the issue
- Consider user requests fairly and consistently
- Document your decisions for future reference

---

## UI Components

### Suspension Modal (signin page)
- **Location**: `/app/auth/signin/page.tsx`
- **Features**:
  - Animated entrance with 3D transforms
  - Pulsing warning icon with rings
  - Gradient borders and backgrounds
  - Character counter
  - Loading spinner during submission
  - Success confirmation state
  - Smooth close functionality

### Messages Page (admin)
- **Location**: `/app/admin/messages/page.tsx`
- **Features**:
  - Two-column layout (list + detail)
  - Unread count indicator
  - Message preview cards
  - Animated message selection
  - Full message detail view
  - Delete confirmation dialog
  - Responsive design

### Admin Navigation
- **Location**: `/components/AdminNavbar.tsx`
- **Addition**: Messages link with 💬 icon

---

## Security Considerations

1. **No Authentication Required for Sending**: 
   - Suspended users can send messages without being logged in
   - This is intentional - they need to communicate even when suspended

2. **Admin Authentication Required**:
   - All admin endpoints require valid admin session
   - Messages can only be viewed/managed by admins

3. **Rate Limiting**: 
   - Consider adding rate limiting to prevent spam
   - Currently not implemented

4. **Message Validation**:
   - Messages limited to 1000 characters
   - All fields are required
   - Input sanitization on backend

---

## Future Enhancements

Potential improvements for this feature:

1. **Email Notifications**:
   - Send email to admin when new message arrives
   - Send confirmation email to user when message is sent

2. **Two-Way Communication**:
   - Allow admin to reply to messages
   - User notification system for admin responses

3. **Message Categories**:
   - Appeal suspension
   - Request information
   - Report technical issue

4. **Attachment Support**:
   - Allow users to attach screenshots or documents
   - Support for evidence in appeals

5. **Message Threading**:
   - Group messages by user
   - Show conversation history

6. **Statistics Dashboard**:
   - Track message volume
   - Average response time
   - Resolution rates

---

## Testing the Feature

### Test as Suspended User

1. Create a test user account
2. Sign in as admin
3. Navigate to User Management
4. Suspend the test user with a reason
5. Sign out
6. Try to sign in with the suspended user credentials
7. Verify the suspension modal appears
8. Send a test message
9. Verify success confirmation appears

### Test as Administrator

1. Sign in as admin
2. Navigate to Messages page
3. Verify you see the test message
4. Click on the message to view details
5. Verify it's marked as read
6. Delete the message
7. Verify it's removed from the list

---

## Troubleshooting

### Message Not Sending

**Possible Causes:**
- Network connectivity issues
- Server error
- Invalid data format

**Solutions:**
- Check browser console for errors
- Verify MongoDB connection
- Check API endpoint logs

### Messages Not Appearing in Admin Panel

**Possible Causes:**
- Not signed in as admin
- Database connection issue
- Message not saved properly

**Solutions:**
- Verify admin authentication
- Check MongoDB connection
- Inspect database directly

### Modal Not Appearing

**Possible Causes:**
- User account not actually suspended
- JavaScript error
- Session state issue

**Solutions:**
- Verify user suspension status in database
- Check browser console for errors
- Clear browser cache and cookies

---

## File Structure

```
smart-decision-helper/
├── models/
│   └── SuspendedUserMessage.ts      # Message model
├── app/
│   ├── auth/signin/page.tsx         # Suspension modal
│   ├── admin/messages/page.tsx      # Admin messages view
│   └── api/
│       ├── suspended/
│       │   └── message/route.ts     # Send message API
│       └── admin/
│           └── messages/
│               ├── route.ts         # Get messages API
│               └── [messageId]/route.ts  # Update/delete API
└── components/
    └── AdminNavbar.tsx              # Navigation with Messages link
```

---

## Conclusion

The Suspended User Messaging System provides a professional, user-friendly way for suspended users to communicate with administrators. It balances security, usability, and functionality to create a fair and transparent suspension management process.

For additional help or questions, contact the development team.