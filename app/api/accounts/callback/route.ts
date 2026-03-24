import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  exchangeInstagramCode,
  getInstagramProfile,
} from "@/lib/oauth/instagram";
import { exchangeTwitterCode, getTwitterProfile } from "@/lib/oauth/twitter";
import { exchangeYouTubeCode, getYouTubeChannel } from "@/lib/oauth/youtube";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const platform = searchParams.get("platform") || "instagram";

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 }
      );
    }

    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const redirectUri = `${baseUrl}/api/accounts/callback`;

    let accountData: any;

    // Exchange code for token and fetch profile
    switch (platform.toLowerCase()) {
      case "instagram": {
        const { access_token, user_id } = await exchangeInstagramCode(
          code,
          redirectUri
        );
        const profile = await getInstagramProfile(access_token, user_id);
        accountData = {
          platform: "instagram",
          accountId: profile.id,
          handle: profile.username,
          followers: profile.followers_count,
          accessToken: access_token,
        };
        break;
      }

      case "twitter": {
        const { access_token } = await exchangeTwitterCode(code, redirectUri, "");
        const profile = await getTwitterProfile(access_token);
        accountData = {
          platform: "twitter",
          accountId: profile.id,
          handle: profile.username,
          followers: profile.public_metrics.followers_count,
          accessToken: access_token,
        };
        break;
      }

      case "youtube": {
        const { access_token, refresh_token } = await exchangeYouTubeCode(
          code,
          redirectUri
        );
        const channel = await getYouTubeChannel(access_token);
        accountData = {
          platform: "youtube",
          accountId: channel.id,
          handle: channel.snippet.title,
          followers: parseInt(channel.statistics.subscriberCount || "0", 10),
          accessToken: access_token,
          refreshToken: refresh_token,
        };
        break;
      }

      default:
        return NextResponse.json(
          { error: "Unsupported platform" },
          { status: 400 }
        );
    }

    // Save social account to database
    const account = await prisma.socialAccount.upsert({
      where: {
        platform_accountId: {
          platform: accountData.platform,
          accountId: accountData.accountId,
        },
      },
      update: {
        followers: accountData.followers,
        accessToken: accountData.accessToken,
        refreshToken: accountData.refreshToken,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        platform: accountData.platform,
        accountId: accountData.accountId,
        handle: accountData.handle,
        followers: accountData.followers,
        accessToken: accountData.accessToken,
        refreshToken: accountData.refreshToken,
        connectedAt: new Date(),
      },
    });

    // Create initial history entry
    await prisma.followerHistory.create({
      data: {
        accountId: account.id,
        followerCount: accountData.followers,
        date: new Date(),
      },
    });

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard?connected=true", baseUrl));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent("Failed to connect account")}`,
        req.nextUrl.origin
      )
    );
  }
}
