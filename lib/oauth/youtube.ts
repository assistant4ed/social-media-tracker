import axios from "axios";

export interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    profileImageUrl?: string;
  };
  statistics: {
    viewCount: string;
    commentCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export function getYouTubeAuthUrl(redirectUri: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeYouTubeCode(
  code: string,
  redirectUri: string
): Promise<{
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
}> {
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }
    );
    return response.data;
  } catch (error) {
    console.error("YouTube token exchange error:", error);
    throw new Error("Failed to exchange YouTube code");
  }
}

export async function getYouTubeChannel(
  accessToken: string
): Promise<YouTubeChannel> {
  try {
    const response = await axios.get(
      `${YOUTUBE_API_BASE}/channels`,
      {
        params: {
          part: "snippet,statistics",
          mine: true,
          access_token: accessToken,
        },
      }
    );
    return response.data.items[0];
  } catch (error) {
    console.error("Failed to fetch YouTube channel:", error);
    throw new Error("Failed to fetch YouTube channel");
  }
}

export async function getYouTubeSubscriberCount(
  accessToken: string,
  channelId: string
): Promise<number> {
  try {
    const response = await axios.get(
      `${YOUTUBE_API_BASE}/channels`,
      {
        params: {
          id: channelId,
          part: "statistics",
          access_token: accessToken,
        },
      }
    );
    const stats = response.data.items[0].statistics;
    return parseInt(stats.subscriberCount || "0", 10);
  } catch (error) {
    console.error("Failed to fetch YouTube subscriber count:", error);
    throw new Error("Failed to fetch subscriber count");
  }
}
