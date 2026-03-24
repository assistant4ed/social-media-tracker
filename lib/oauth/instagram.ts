import axios from "axios";

const INSTAGRAM_GRAPH_API = "https://graph.instagram.com/v18.0";

export interface InstagramAccount {
  id: string;
  username: string;
  name: string;
  followers_count: number;
  media_count: number;
}

export async function getInstagramAuthUrl(redirectUri: string): Promise<string> {
  const clientId = process.env.INSTAGRAM_APP_ID;
  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    scope: "user_profile,instagram_business_content_publish,instagram_business_manage_messages",
    response_type: "code",
  });
  return `https://api.instagram.com/oauth/authorize?${params}`;
}

export async function exchangeInstagramCode(
  code: string,
  redirectUri: string
): Promise<{
  access_token: string;
  user_id: string;
}> {
  try {
    const response = await axios.post(
      "https://graph.instagram.com/v18.0/oauth/access_token",
      {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Instagram token exchange error:", error);
    throw new Error("Failed to exchange Instagram code");
  }
}

export async function getInstagramProfile(
  accessToken: string,
  userId: string
): Promise<InstagramAccount> {
  try {
    const response = await axios.get(
      `${INSTAGRAM_GRAPH_API}/${userId}`,
      {
        params: {
          fields: "id,username,name,followers_count,media_count",
          access_token: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Instagram profile:", error);
    throw new Error("Failed to fetch Instagram profile");
  }
}

export async function getInstagramFollowers(
  accessToken: string,
  userId: string
): Promise<number> {
  try {
    const response = await axios.get(
      `${INSTAGRAM_GRAPH_API}/${userId}`,
      {
        params: {
          fields: "followers_count",
          access_token: accessToken,
        },
      }
    );
    return response.data.followers_count;
  } catch (error) {
    console.error("Failed to fetch Instagram followers:", error);
    throw new Error("Failed to fetch follower count");
  }
}
