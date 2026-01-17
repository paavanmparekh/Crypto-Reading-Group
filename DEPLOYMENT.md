# Vercel Deployment Guide

Quick reference guide for deploying the Cryptography Reading Group website to Vercel.

## Prerequisites
- ✅ Local database setup complete
- ✅ All functionalities tested locally
- ✅ Code pushed to GitHub repository

## Deployment Steps

### 1. Create Vercel Project
1. Visit [vercel.com/new](https://vercel.com/new)
2. Sign in with GitHub
3. Import your repository: `crypto-reading-group-new`
4. Framework: **Next.js** (auto-detected)
5. Click **Deploy**

### 2. Add Vercel Postgres Database
1. Go to your project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name (e.g., `crypto-reading-group-db`)
6. Click **Create**

> [!NOTE]
> Vercel automatically adds these environment variables to your project:
> - `POSTGRES_URL`
> - `POSTGRES_PRISMA_URL`
> - `POSTGRES_URL_NON_POOLING`

### 3. Configure Environment Variables
Go to **Settings** → **Environment Variables**

#### Required Variables
```bash
# Generate secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# Your production URL
NEXTAUTH_URL=https://your-app.vercel.app
```

#### Optional Variables
```bash
# For email functionality (get from resend.com)
RESEND_API_KEY=re_your_api_key

# For file uploads (auto-configured if using Vercel Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

### 4. Run Database Migrations

**Option A: Using Vercel CLI** (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

**Option B: Update Build Command**

In Vercel project settings → **Build & Development Settings**:
```bash
Build Command: prisma generate && prisma migrate deploy && next build
```

Then redeploy the project.

### 5. Create Production Admin User

**Method 1: Using Prisma Studio**
```bash
# Pull production environment
vercel env pull

# Open Prisma Studio
npx prisma studio
```
Manually create admin user with hashed password.

**Method 2: Using Vercel SQL Editor**
1. Go to **Storage** → Your Postgres database
2. Click **Query** tab
3. Run this SQL (replace with your details):

```sql
-- First, hash your password using bcrypt (use online tool or Node.js)
-- Example: bcrypt.hash('your-password', 10)

INSERT INTO "Admin" (id, email, password, name, "createdAt")
VALUES (
  gen_random_uuid()::text,
  'your-email@example.com',
  '$2a$10$your_hashed_password_here',
  'Your Name',
  NOW()
);
```

**Method 3: Create Seed Script for Production**
```bash
# Create production seed script
npm run db:seed

# Or manually run in Vercel terminal
```

### 6. Verify Deployment

Test these URLs (replace with your domain):

- ✅ Home: `https://your-app.vercel.app/`
- ✅ Talks: `https://your-app.vercel.app/talks`
- ✅ Members: `https://your-app.vercel.app/members`
- ✅ Admin Login: `https://your-app.vercel.app/admin/login`

### 7. Post-Deployment Tasks

1. **Test Admin Login**
   - Login with your production admin credentials
   - Verify dashboard loads correctly

2. **Add Real Content**
   - Add actual talks via admin panel
   - Add real team members
   - Remove or update sample data

3. **Configure Custom Domain** (Optional)
   - Go to **Settings** → **Domains**
   - Add your custom domain
   - Update `NEXTAUTH_URL` to match

4. **Set Up Email** (Optional)
   - Get API key from [Resend](https://resend.com)
   - Add `RESEND_API_KEY` to environment variables
   - Test mailing list subscription

## Environment Variables Summary

| Variable | Environment | Required | Source |
|----------|-------------|----------|--------|
| `POSTGRES_URL` | Production | ✅ Yes | Auto-added by Vercel |
| `POSTGRES_PRISMA_URL` | Production | ✅ Yes | Auto-added by Vercel |
| `POSTGRES_URL_NON_POOLING` | Production | ✅ Yes | Auto-added by Vercel |
| `NEXTAUTH_SECRET` | Production | ✅ Yes | Generate with OpenSSL |
| `NEXTAUTH_URL` | Production | ✅ Yes | Your Vercel URL |
| `RESEND_API_KEY` | Production | ⚠️ Optional | resend.com |
| `BLOB_READ_WRITE_TOKEN` | Production | ⚠️ Optional | Vercel Blob Storage |

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure Prisma version matches (`5.22.0`)
- Verify all environment variables are set

### Database Connection Errors
- Verify Postgres database is created
- Check environment variables are correct
- Ensure migrations have run

### Admin Login Not Working
- Verify admin user exists in database
- Check `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your domain

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Check migration status
npx prisma migrate status
```

## Useful Commands

```bash
# View production logs
vercel logs

# Deploy specific branch
vercel --prod

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# Open Prisma Studio with production DB
vercel env pull && npx prisma studio
```

## Security Checklist

- ✅ `NEXTAUTH_SECRET` is strong and unique
- ✅ Admin password is strong and hashed
- ✅ `.env` files are in `.gitignore`
- ✅ Database credentials are not exposed
- ✅ HTTPS is enabled (automatic on Vercel)

## Next Steps After Deployment

1. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor database usage

2. **Set Up Backups**
   - Configure database backups in Vercel
   - Export data periodically

3. **Update Content**
   - Add real talks and members
   - Update homepage content
   - Customize branding

4. **Enable Features**
   - Set up email notifications
   - Configure file uploads
   - Add analytics

---

**Deployment Complete!** 🎉

Your Cryptography Reading Group website is now live and ready to use.
