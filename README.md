# Social Media Follower Tracker

A full-stack web application to track social media follower growth across multiple platforms. Monitor your Instagram, Twitter/X, YouTube, and other social accounts in one unified dashboard.

## 🌟 Features

- **Multi-Platform Support**: Track followers on Instagram, Twitter/X, YouTube, and more
- **Month-over-Month Analytics**: Compare growth between current and previous month
- **Team Collaboration**: Share dashboards with team members with role-based access
- **Historical Data Tracking**: Daily snapshots of follower counts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: Email/password and Google OAuth support
- **Real-time Updates**: OAuth integration for seamless account connection

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React** - UI components
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication library

### Backend
- **Next.js API Routes** - Backend endpoints
- **Prisma ORM** - Database abstraction
- **SQLite** - Local database (upgradeable to PostgreSQL)

### Authentication
- **NextAuth.js** - Session management
- **bcryptjs** - Password hashing
- **OAuth 2.0** - Social platform integration

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- GitHub account (for Google OAuth setup)
- Social platform API access (Instagram Graph API, Twitter v2 API, YouTube API)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd social-tracker
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

```env
DATABASE_URL="file:./social-tracker.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

INSTAGRAM_APP_ID="your-instagram-app-id"
INSTAGRAM_APP_SECRET="your-instagram-app-secret"

TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
```

### 3. Set Up OAuth Providers

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add `http://localhost:3000/api/auth/callback/google` to Redirect URIs
6. Copy Client ID and Secret to `.env.local`

#### Instagram Business Account
1. Go to [Meta Developers](https://developers.facebook.com)
2. Create an app and add Instagram Graph API
3. Get your App ID and App Secret
4. Add redirect URI in app settings

#### Twitter API
1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create a project and app
3. Enable OAuth 2.0
4. Set redirect URI to `http://localhost:3000/api/accounts/callback`
5. Copy credentials to `.env.local`

### 4. Set Up Database

```bash
# Push Prisma schema to SQLite
npm run db:push

# Optional: Seed with mock data
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Test Login

Use the seed account credentials:
- **Email**: demo@example.com
- **Password**: password123

(Only available if you ran `npm run seed`)

## 📊 Project Structure

```
social-tracker/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts    # NextAuth config
│   │   │   └── signup/route.ts           # Signup endpoint
│   │   ├── accounts/
│   │   │   ├── route.ts                  # List/delete accounts
│   │   │   ├── connect/route.ts          # Start OAuth flow
│   │   │   └── callback/route.ts         # OAuth callback handler
│   │   ├── analytics/
│   │   │   └── comparison/route.ts       # Month-over-month data
│   │   └── team/
│   │       └── members/route.ts          # Team management
│   ├── dashboard/
│   │   └── page.tsx                      # Main dashboard
│   ├── login/
│   │   └── page.tsx                      # Login page
│   ├── signup/
│   │   └── page.tsx                      # Signup page
│   ├── connect/
│   │   └── page.tsx                      # Connect accounts page
│   ├── layout.tsx                        # Root layout
│   └── globals.css                       # Global styles
├── components/
│   ├── Dashboard.tsx                     # Dashboard logic
│   └── ComparisonCard.tsx                # Account comparison card
├── lib/
│   ├── db.ts                             # Prisma singleton
│   └── oauth/
│       ├── instagram.ts                  # Instagram API
│       ├── twitter.ts                    # Twitter API
│       └── youtube.ts                    # YouTube API
├── prisma/
│   └── schema.prisma                     # Database schema
├── public/                               # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.local.example
```

## 🔐 Database Schema

### Core Models

**User**
- `id` - Unique identifier
- `email` - Email address
- `password` - Hashed password
- `googleId` - Google OAuth ID
- `name` - User's name
- `createdAt`, `updatedAt`

**SocialAccount**
- `id` - Unique identifier
- `userId` - Owner
- `platform` - instagram, twitter, youtube, etc.
- `accountId` - Platform-specific ID
- `handle` - Username/handle
- `followers` - Current count
- `accessToken`, `refreshToken` - OAuth tokens
- `connectedAt`, `updatedAt`

**FollowerHistory**
- `id` - Unique identifier
- `accountId` - Reference to SocialAccount
- `followerCount` - Snapshot count
- `date` - Date of snapshot
- Unique constraint on `(accountId, date)`

**Team**
- `id` - Unique identifier
- `name` - Team name
- `ownerId` - Owner user ID
- `createdAt`, `updatedAt`

**TeamAccess**
- `teamId` - Team reference
- `userId` - User reference
- `role` - "owner", "editor", "viewer"
- `grantedAt`, `grantedBy`

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/session` - Get current session

### Accounts
- `GET /api/accounts` - List user's social accounts
- `POST /api/accounts/connect` - Initiate OAuth connection
- `GET /api/accounts/callback` - OAuth callback handler
- `DELETE /api/accounts` - Disconnect account

### Analytics
- `GET /api/analytics/comparison` - Month-over-month growth data

### Team
- `GET /api/team/members` - List team members
- `POST /api/team/members` - Invite member to team
- `DELETE /api/team/members` - Remove team member

## 📈 How It Works

1. **User Signs Up** → Creates account with email/password
2. **Connects Social Account** → Clicks platform, redirected to OAuth provider
3. **Authorizes Access** → User grants permissions
4. **Callback Handler** → Stores token securely in database
5. **Data Fetched** → Initial follower count saved
6. **Historical Tracking** → Daily cron job captures follower snapshots
7. **Analytics** → Comparison calculated between periods

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Set `DATABASE_URL` to PostgreSQL connection string (upgrade from SQLite)
5. Deploy

### Self-Hosted (Railway, Heroku, etc.)

1. Create PostgreSQL database
2. Set `DATABASE_URL` to connection string
3. Deploy application
4. Run migrations: `npm run db:push`

### Environment Variables for Production

```env
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
DATABASE_URL="postgresql://..."  # Use PostgreSQL in production
```

## 🔄 Data Refresh Strategy

### Manual Refresh
- Click "Refresh" button on dashboard to fetch latest counts immediately

### Automatic Daily Refresh
Add a cron job (using services like Vercel Cron or GitHub Actions):

```bash
# Run daily at 2 AM UTC
GET https://your-domain.com/api/cron/refresh-followers?secret=CRON_SECRET
```

## 🛡️ Security Considerations

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ OAuth tokens stored securely
- ✅ Session-based authentication
- ✅ CSRF protection via NextAuth
- ✅ Input validation on all endpoints
- ✅ Role-based access control

## 🚦 Limitations & Future Enhancements

### Current Limitations
- Instagram: Requires Business Account
- Twitter: Limited to OAuth 2.0
- Manual sync required for other platforms

### Planned Features
- TikTok integration
- Facebook Page tracking
- LinkedIn company insights
- Advanced analytics (trend analysis, predictions)
- Email notifications for milestones
- API webhooks
- Custom reports
- Multi-language support

## 🐛 Troubleshooting

### OAuth Redirect URI Mismatch
- Ensure redirect URIs match exactly in both app and OAuth provider
- Check for trailing slashes or protocol mismatches

### "Invalid State" Error
- Clear cookies and try again
- Verify `NEXTAUTH_SECRET` is set
- Check clock synchronization on server

### Follower Count Not Updating
- Verify OAuth tokens haven't been revoked
- Check platform API rate limits
- Review API credentials

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Development

### Run TypeScript Check
```bash
npx tsc --noEmit
```

### Format Code
```bash
npx prettier --write .
```

### Run in Production Mode
```bash
npm run build
npm run start
```

---

**Happy tracking! 📊**
