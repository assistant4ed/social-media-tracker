import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { getInstagramAuthUrl } from "@/lib/oauth/instagram";
import { generateTwitterAuthUrl } from "@/lib/oauth/twitter";
import { getYouTubeAuthUrl } from "@/lib/oauth/youtube";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { platform } = await req.json();
    
    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const redirectUri = `${baseUrl}/api/accounts/callback`;

    let authUrl: string;

    switch (platform.toLowerCase()) {
      case "instagram":
        authUrl = await getInstagramAuthUrl(redirectUri);
        break;
      case "twitter":
        authUrl = generateTwitterAuthUrl(redirectUri);
        break;
      case "youtube":
        authUrl = getYouTubeAuthUrl(redirectUri);
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported platform" },
          { status: 400 }
        );
    }

    return NextResponse.json({ authUrl }, { status: 200 });
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth" },
      { status: 500 }
    );
  }
}
