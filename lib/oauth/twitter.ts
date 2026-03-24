import axios from "axios";
import crypto from "crypto";

export interface TwitterProfile {
  id: string;
  username: string;
  name: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

// Twitter v2 API endpoints
const TWITTER_API_BASE = "https://api.twitter.com/2";
const TWITTER_OAUTH_URL = "https://twitter.com/i/oauth2/authorize";

export function generateTwitterAuthUrl(
  redirectUri: string,
  state?: string
): string {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const codeChallenge = generateCodeChallenge();
  
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId || "",
    redirect_uri: redirectUri,
    scope: "tweet.read users.read follows.read offline.access",
    state: state || crypto.randomBytes(16).toString("hex"),
    code_challenge: codeChallenge,
    code_challenge_method: "plain",
  });

  return `${TWITTER_OAUTH_URL}?${params}`;
}

export function generateCodeChallenge(): string {
  return crypto.randomBytes(32).toString("hex").substring(0, 128);
}

export async function exchangeTwitterCode(
  code: string,
  redirectUri: string,
  codeVerifier: string
): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}> {
  try {
    const response = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      {
        code,
        grant_type: "authorization_code",
        client_id: process.env.TWITTER_CLIENT_ID,
        client_secret: process.env.TWITTER_CLIENT_SECRET,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Twitter token exchange error:", error);
    throw new Error("Failed to exchange Twitter code");
  }
}

export async function getTwitterProfile(
  accessToken: string
): Promise<TwitterProfile> {
  try {
    const response = await axios.get(
      `${TWITTER_API_BASE}/users/me`,
      {
        params: {
          "user.fields": "id,name,username,public_metrics",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch Twitter profile:", error);
    throw new Error("Failed to fetch Twitter profile");
  }
}

export async function getTwitterFollowers(
  accessToken: string,
  userId: string
): Promise<number> {
  try {
    const response = await axios.get(
      `${TWITTER_API_BASE}/users/${userId}`,
      {
        params: {
          "user.fields": "public_metrics",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data.public_metrics.followers_count;
  } catch (error) {
    console.error("Failed to fetch Twitter followers:", error);
    throw new Error("Failed to fetch follower count");
  }
}
