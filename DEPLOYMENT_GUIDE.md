# Deployment Guide - Social Media Tracker

## ✅ Completed: GitHub Push

### Repository Details
- **GitHub URL:** https://github.com/assistant4ed/social-media-tracker
- **Branch:** main
- **Status:** Successfully pushed with Vercel configuration

### What Was Pushed
- ✅ Complete Next.js 15 application with React 19
- ✅ Tailwind CSS styling
- ✅ Prisma database schema
- ✅ NextAuth.js authentication setup
- ✅ Environment configuration templates
- ✅ vercel.json configuration file

---

## 📋 Vercel Deployment Setup Instructions

### Step 1: Connect GitHub to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Authorize Vercel with GitHub (if not already done)
5. Select **`assistant4ed/social-media-tracker`** repository
6. Click **"Import"**

### Step 2: Configure Build Settings
Vercel should auto-detect these from `vercel.json`:
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
- **Output Directory:** `.next`

### Step 3: Set Environment Variables
Add these to Vercel Project Settings → **Environment Variables**:

**Required Variables:**
```
DATABASE_URL=<your-postgresql-url>
NEXTAUTH_SECRET=<generate-strong-secret-key>
NEXTAUTH_URL=https://your-vercel-url.vercel.app
```

**How to generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**How to get DATABASE_URL:**
- Option A: Use Vercel Postgres (recommended)
  - In Vercel dashboard → Storage → Create Database
  - Copy the connection string
  
- Option B: Use external PostgreSQL
  - Format: `postgresql://user:password@host:5432/dbname?schema=public`

### Step 4: Deploy
1. Click **"Deploy"** button
2. Vercel will:
   - Build the Next.js app
   - Install dependencies
   - Compile TypeScript
   - Prepare for production
3. Once successful, you'll get a live URL like: `https://social-media-tracker-xxx.vercel.app`

### Step 5: Database Setup (First Time Only)
After deployment, run database migrations:
```bash
# Via Vercel CLI (after `vercel link`):
vercel env pull
npm run db:push

# Or via the deployed app:
- Visit your Vercel URL
- The middleware should trigger automatic setup
```

---

## 🔗 Deployment URLs

| Resource | URL |
|----------|-----|
| GitHub Repository | https://github.com/assistant4ed/social-media-tracker |
| Vercel Dashboard | https://vercel.com/dashboard |
| Deployed App | https://social-media-tracker-xxx.vercel.app *(set after deployment)* |

---

## 🛠️ Local Testing Before Deployment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Run database migrations (if using local Postgres)
npm run db:push

# Start development server
npm run dev

# Build for production (test build)
npm run build
npm start
```

---

## ⚙️ Configuration Details

### Database
- **ORM:** Prisma 5.7.0
- **Schema:** `/prisma/schema.prisma`
- **Recommended:** Use Vercel Postgres for managed hosting

### Authentication
- **Library:** NextAuth.js 4.24.0
- **Providers:** Configure in `/app/api/auth/[...nextauth].ts`
- **Session:** JWT-based, encrypted with NEXTAUTH_SECRET

### Styling
- **Framework:** Tailwind CSS 3.3.6
- **Config:** `tailwind.config.ts`
- **UI Components:** Heroicons 2.0.18

### Build Optimization
- **Framework:** Next.js 15 (App Router)
- **React:** 19 with latest features
- **Output:** Optimized for Vercel Edge Runtime

---

## 📞 Support & Troubleshooting

### Common Issues

**"Build failed: Module not found"**
- Solution: Ensure all imports match the installed packages in package.json
- Check that TypeScript types are installed

**"Database connection failed"**
- Verify DATABASE_URL is correct in Environment Variables
- Ensure database user has proper permissions
- Check firewall/network rules

**"NextAuth error: NEXTAUTH_SECRET not set"**
- Generate a new secret with: `openssl rand -base64 32`
- Add to Vercel Environment Variables as `NEXTAUTH_SECRET`

**"NEXTAUTH_URL doesn't match deployment URL"**
- Set NEXTAUTH_URL to your exact Vercel deployment URL
- Example: `https://social-media-tracker-abc123.vercel.app`

---

## 🚀 Next Steps

1. ✅ Add Vercel integration via dashboard
2. ⏳ Configure environment variables
3. ⏳ Deploy to production
4. ⏳ Set up monitoring and logging
5. ⏳ Configure custom domain (optional)

---

**Repository:** https://github.com/assistant4ed/social-media-tracker  
**Last Updated:** 2026-03-24  
**Status:** Ready for Vercel deployment
