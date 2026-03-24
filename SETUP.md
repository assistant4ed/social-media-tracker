# Quick Start Guide

## 1️⃣ Install Dependencies

```bash
npm install
```

## 2️⃣ Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and paste it into `.env.local` as `NEXTAUTH_SECRET`

## 3️⃣ Set Up `.env.local`

```bash
cp .env.local.example .env.local
```

Fill in these required values:

```env
DATABASE_URL="file:./social-tracker.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-from-step-2"
```

Optional OAuth (for full functionality):
```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## 4️⃣ Initialize Database

```bash
npm run db:push
```

## 5️⃣ Seed with Demo Data (Optional)

```bash
npm run seed
```

**Demo Login:**
- Email: `demo@example.com`
- Password: `password123`

## 6️⃣ Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 → Sign up or use demo account

## 🎯 Next Steps

1. **Connect Social Accounts**
   - Go to Dashboard → Connect Account
   - Choose a platform
   - Authorize access
   - Data will start tracking

2. **Set Up OAuth (Optional)**
   - Follow instructions in README.md
   - Add API credentials to `.env.local`
   - Restart dev server

3. **Deploy to Production**
   - Upgrade to PostgreSQL
   - Use Vercel, Railway, or self-hosted
   - See README.md for deployment guide

## ✅ What You Get

- ✅ Full-stack Next.js app
- ✅ User authentication
- ✅ Social account tracking
- ✅ Month-over-month analytics
- ✅ Team collaboration ready
- ✅ Responsive UI

## 📖 Features Ready to Use

1. **Dashboard** - View all connected accounts with growth metrics
2. **Account Connection** - OAuth flow for Instagram, Twitter, YouTube
3. **Analytics** - Compare followers month-over-month
4. **Team Management** - Share dashboard with team members
5. **Historical Data** - Track follower changes over time

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Database locked?**
```bash
rm social-tracker.db
npm run db:push
```

**Need fresh start?**
```bash
rm -rf node_modules .next social-tracker.db
npm install
npm run db:push
```

---

💡 **Tip:** Check `README.md` for detailed setup instructions and deployment options.
