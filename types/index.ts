// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

// Social Account types
export type Platform = "instagram" | "twitter" | "youtube" | "tiktok" | "facebook" | "linkedin";

export interface SocialAccount {
  id: string;
  userId: string;
  platform: Platform;
  accountId: string;
  handle: string;
  followers: number;
  accessToken?: string;
  refreshToken?: string;
  connectedAt: Date;
  updatedAt: Date;
}

// History types
export interface FollowerHistory {
  id: string;
  accountId: string;
  followerCount: number;
  date: Date;
  createdAt: Date;
}

// Analytics types
export interface GrowthMetrics {
  absolute: number;
  percentage: number;
}

export interface MonthComparison {
  accountId: string;
  handle: string;
  platform: Platform;
  currentMonth: {
    followers: number;
    date: Date;
  };
  previousMonth: {
    followers: number;
    date: Date;
  };
  growth: GrowthMetrics;
}

// Team types
export type TeamRole = "owner" | "editor" | "viewer";

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamAccess {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  grantedAt: Date;
  grantedBy?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
  }
}
