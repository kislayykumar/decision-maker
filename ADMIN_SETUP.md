# 🔐 Admin Setup Guide

This guide explains how to set up and use the admin dashboard for the Smart Decision Helper application.

## Table of Contents
- [Creating the First Admin Account](#creating-the-first-admin-account)
- [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
- [Admin Features](#admin-features)
- [API Endpoints](#api-endpoints)
- [Security Considerations](#security-considerations)

## Creating the First Admin Account

### Step 1: Initialize Admin Account

After setting up your MongoDB database and starting the application, you need to create the first admin account.

**Using the API endpoint:**

```bash
curl -X POST http://localhost:3000/api/admin/init \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password",
    "email": "admin@yourdomain.com",
    "name": "Admin User"
  }'
```

**Important Notes:**
- The `/api/admin/init` endpoint can only be used ONCE to create the initial admin
- After the first admin is created, this endpoint will be disabled for security
- Use a strong password (minimum 6 characters recommended, but use 12+ in production)
- Save these credentials securely

### Step 2: Verify Admin Account Creation

You should receive a response like:
```json
{
  "success": true,
  "message": "Admin account created successfully",
  "admin": {
    "_id": "...",
    "username": "admin",
    "email": "admin@yourdomain.com",
    "name": "Admin User",
    "createdAt": "..."
  }
}
```

## Accessing the Admin Dashboard

### Login Process

1. **Navigate to Sign In Page**
   - Go to: `http://localhost:3000/auth/signin` (or your deployed URL)

2. **Enter Admin Credentials**
   - Email: The email you set during initialization (e.g., `admin@yourdomain.com`)
   - Password: The password you set during initialization

3. **Access Admin Dashboard**
   - After successful login, navigate to: `/admin`
   - Or click "Admin" in the navigation menu (only visible to admin users)

### What Makes an Account "Admin"?

An account is considered an admin if:
- It was created via the `/api/admin/init` endpoint
- The account has `isAdmin: true` set in the User model
- The account authenticates through the admin authentication provider

## Admin Features

### 1. Overview Tab

**Statistics Dashboard**
- Total Users
- Active Users
- Suspended Users
- Total Decisions Made
- User Satisfaction Rate
- New Users This Week
- New Decisions This Week

**Top Users**
- See the most active users
- View decision counts per user
- Identify power users

### 2. Users Tab

**User Management**
- Search users by name or email
- Filter by status (All/Active/Suspended)
- View user statistics (decisions, feedback)
- Suspend/Unsuspend users with reasons
- Delete users (with confirmation)
- View suspension reasons

**User Actions:**
```
Suspend User → Provide reason → User account suspended
Unsuspend User → User account reactivated
Delete User → Confirm → User permanently removed
```

### 3. Settings Tab

**Admin Account Management**
- Change admin password
- Requires current password verification
- Set new password (minimum 6 characters)

## API Endpoints

### Admin Statistics
```
GET /api/admin/stats
Authorization: Admin session required
```

Returns comprehensive system statistics including user growth, decision activity, and top users.

### List Users
```
GET /api/admin/users?page=1&limit=10&search=&status=all
Authorization: Admin session required
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `search`: Search by name or email
- `status`: Filter by status (all/active/suspended)

### Modify User
```
PATCH /api/admin/users/:userId
Authorization: Admin session required
Body: {
  "action": "suspend" | "unsuspend" | "makeAdmin" | "removeAdmin",
  "suspendedReason": "Optional reason for suspension"
}
```

### Delete User
```
DELETE /api/admin/users/:userId
Authorization: Admin session required
```

### Change Admin Password
```
POST /api/admin/password
Authorization: Admin session required
Body: {
  "currentPassword": "current-password",
  "newPassword": "new-password"
}
```

## Security Considerations

### Best Practices

1. **Strong Passwords**
   - Use passwords with at least 12 characters
   - Include uppercase, lowercase, numbers, and symbols
   - Never use common passwords

2. **Secure the Init Endpoint**
   - The `/api/admin/init` endpoint is automatically disabled after first use
   - In production, consider removing or protecting this endpoint further

3. **Environment Variables**
   ```env
   NEXTAUTH_SECRET=<very-strong-random-string>
   MONGODB_URI=<your-mongodb-connection-string>
   ```

4. **HTTPS in Production**
   - Always use HTTPS in production
   - Never transmit admin credentials over HTTP
   - Railway automatically provides HTTPS

5. **Session Security**
   - Admin sessions use NextAuth.js
   - Sessions are encrypted and secure
   - Sessions expire based on NextAuth configuration

6. **MongoDB Security**
   - Use MongoDB Atlas with IP whitelisting
   - Use strong database passwords
   - Enable MongoDB authentication

### Production Checklist

- [ ] Created strong admin password (12+ characters)
- [ ] Saved admin credentials securely
- [ ] Tested admin login
- [ ] Verified admin dashboard access
- [ ] Set secure `NEXTAUTH_SECRET`
- [ ] Enabled HTTPS (automatic on Railway)
- [ ] Configured MongoDB security
- [ ] Tested user management features
- [ ] Reviewed and understood all admin capabilities

## Troubleshooting

### Cannot Access Admin Dashboard

**Issue**: Redirected to dashboard when accessing `/admin`

**Solution**: 
- Ensure you're logged in with admin credentials
- Verify the account has `isAdmin: true` in the database
- Check browser console for errors

### Cannot Create Admin Account

**Issue**: `/api/admin/init` returns "Admin already exists"

**Solution**:
- An admin account already exists
- Use the existing admin credentials
- If credentials are lost, manually update the database

### Forgot Admin Password

**Solution**:
1. Access MongoDB directly
2. Find the admin document in the `admins` collection
3. Generate a new bcrypt hash for your new password
4. Update the password field
5. Or delete the admin and recreate using `/api/admin/init`

### MongoDB Connection Issues

**Issue**: Admin features not working

**Solution**:
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas connection string
- Ensure IP whitelist includes your IP
- Test connection with MongoDB Compass

## Additional Resources

- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security Best Practices](./README.md#security)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review application logs
3. Check MongoDB connection and data
4. Verify environment variables are set correctly

---

**Important**: Keep your admin credentials secure. Admin accounts have full control over user accounts and system data.