"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConnectPage() {
  const router = useRouter();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const platforms = [
    {
      name: "Instagram",
      id: "instagram",
      color: "from-pink-400 to-purple-600",
      icon: "📷",
      description: "Connect your Instagram business account",
    },
    {
      name: "Twitter / X",
      id: "twitter",
      color: "from-blue-400 to-blue-600",
      icon: "𝕏",
      description: "Track your X followers",
    },
    {
      name: "YouTube",
      id: "youtube",
      color: "from-red-400 to-red-600",
      icon: "▶",
      description: "Monitor your channel subscribers",
    },
    {
      name: "TikTok",
      id: "tiktok",
      color: "from-black to-gray-800",
      icon: "♪",
      description: "Coming soon",
    },
    {
      name: "Facebook",
      id: "facebook",
      color: "from-blue-600 to-blue-800",
      icon: "f",
      description: "Coming soon",
    },
    {
      name: "LinkedIn",
      id: "linkedin",
      color: "from-blue-500 to-blue-700",
      icon: "in",
      description: "Coming soon",
    },
  ];

  const connectAccount = async (platform: string) => {
    if (["tiktok", "facebook", "linkedin"].includes(platform)) {
      setError(`${platform} is coming soon`);
      return;
    }

    try {
      setConnecting(platform);
      setError("");

      const res = await fetch("/api/accounts/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      if (res.ok) {
        const { authUrl } = await res.json();
        window.location.href = authUrl;
      } else {
        setError("Failed to connect account");
        setConnecting(null);
      }
    } catch (err) {
      setError("An error occurred");
      setConnecting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <button
            onClick={() => router.back()}
            className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Connect Your Accounts</h1>
          <p className="text-gray-600 text-lg">
            Choose a platform to start tracking your followers
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div
                className={`bg-gradient-to-r ${platform.color} p-6 text-white flex items-center justify-between`}
              >
                <div>
                  <h3 className="text-2xl font-bold">{platform.name}</h3>
                </div>
                <div className="text-5xl">{platform.icon}</div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-6">{platform.description}</p>

                <button
                  onClick={() => connectAccount(platform.id)}
                  disabled={
                    connecting === platform.id ||
                    ["tiktok", "facebook", "linkedin"].includes(platform.id)
                  }
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    ["tiktok", "facebook", "linkedin"].includes(platform.id)
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : connecting === platform.id
                      ? "bg-gray-400 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {connecting === platform.id ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⟳</span>
                      Connecting...
                    </>
                  ) : ["tiktok", "facebook", "linkedin"].includes(platform.id) ? (
                    "Coming Soon"
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </span>
              <span>Click the platform you want to connect</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </span>
              <span>You'll be redirected to the platform to authorize access</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </span>
              <span>We'll securely store your access token</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </span>
              <span>Your follower data will be tracked daily</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
