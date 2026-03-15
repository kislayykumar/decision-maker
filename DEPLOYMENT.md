# Deployment Guide

This guide covers deploying the Smart Decision Helper application to Railway.

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. A MongoDB Atlas account (for the database)
3. (Optional) Google OAuth credentials

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account
3. Create a new cluster (free tier is sufficient)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
7. Replace `<password>` with your database user password
8. Add `/smart-decision-helper` at the end of the connection string

## Step 2: Generate NextAuth Secret

Generate a secure random string for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output - this will be your `NEXTAUTH_SECRET`.

## Step 3: Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. Push your code to GitHub:
   ```bash
   cd smart-decision-helper
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/smart-decision-helper.git
   git push -u origin main
   ```

2. Go to [Railway Dashboard](https://railway.app/dashboard)

3. Click "New Project" → "Deploy from GitHub repo"

4. Select your repository

5. Railway will automatically detect Next.js and start building

### Option B: Deploy with Railway CLI

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize project in the smart-decision-helper directory:
   ```bash
   cd smart-decision-helper
   railway init
   ```

4. Deploy:
   ```bash
   railway up
   ```

## Step 4: Configure Environment Variables

1. In the Railway dashboard, select your project

2. Click on your service (should be auto-named or you can rename it)

3. Go to the "Variables" tab

4. Add the following environment variables:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-decision-helper
   NEXTAUTH_SECRET=your-generated-secret-from-step-2
   NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   ```

   Note: Railway automatically provides `RAILWAY_PUBLIC_DOMAIN` which will be your app's URL.

5. (Optional) If using Google OAuth, add:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## Step 5: Set Up Google OAuth (Optional)

If you want to enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Create a new project or select existing

3. Enable "Google+ API"

4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"

5. Configure OAuth consent screen if prompted

6. Application type: "Web application"

7. Add Authorized redirect URIs:
   ```
   https://your-app-name.up.railway.app/api/auth/callback/google
   ```

8. Copy the Client ID and Client Secret to Railway environment variables

## Step 6: Verify Deployment

1. Once deployed, Railway will provide you with a public URL (e.g., `https://your-app.up.railway.app`)

2. Visit the URL to verify the application is running

3. Test the authentication flow:
   - Create a new account
   - Sign in
   - Create a decision
   - Go through the question flow
   - Submit feedback

## Step 7: Set Up Custom Domain (Optional)

1. In Railway dashboard, go to "Settings" tab

2. Click "Generate Domain" or add your custom domain

3. If using custom domain:
   - Add the provided CNAME record to your DNS provider
   - Update `NEXTAUTH_URL` environment variable to your custom domain

## Troubleshooting

### Build Fails

- Check that all dependencies are listed in package.json
- Verify Node.js version compatibility
- Check build logs in Railway dashboard

### Database Connection Issues

- Verify MongoDB Atlas connection string is correct
- Check that IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Ensure database user has read/write permissions

### Authentication Not Working

- Verify `NEXTAUTH_URL` matches your actual domain
- Check that `NEXTAUTH_SECRET` is set
- For Google OAuth, verify redirect URIs are configured correctly

### Application Crashes

- Check application logs in Railway dashboard
- Verify all environment variables are set
- Check for any missing dependencies

## Monitoring and Maintenance

### View Logs

```bash
railway logs
```

Or view them in the Railway dashboard under the "Deployments" tab.

### Restart Application

If needed, you can restart the application:
- In Railway dashboard: Deployments → Three dots → Restart
- Or with CLI: `railway restart`

### Update Application

Simply push to your GitHub repository:
```bash
git add .
git commit -m "Your update message"
git push
```

Railway will automatically detect the changes and redeploy.

## Production Checklist

Before going live, ensure:

- [ ] MongoDB Atlas connection string uses production credentials
- [ ] `NEXTAUTH_SECRET` is a strong, randomly generated string
- [ ] `NEXTAUTH_URL` matches your production domain
- [ ] Google OAuth redirect URIs include production domain
- [ ] Database has proper backups configured
- [ ] Application logs are being monitored
- [ ] Error tracking is set up (optional but recommended)

## Scaling

Railway provides automatic scaling options:
- Horizontal scaling: Add more instances
- Vertical scaling: Increase resources per instance

Configure in Railway dashboard → Settings → Resources

## Cost Estimation

- Railway: Free tier available, then pay-as-you-go
- MongoDB Atlas: Free tier (512MB) available, then paid plans
- Total estimated cost for small app: $0-5/month

## Support

For Railway support:
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Email: team@railway.app

For application issues:
- Open an issue on GitHub
- Check application logs for errors