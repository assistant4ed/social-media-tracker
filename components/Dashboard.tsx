"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ComparisonCard from "./ComparisonCard";
import { useRouter } from "next/navigation";

interface Account {
  id: string;
  platform: string;
  handle: string;
  followers: number;
}

interface Comparison {
  accountId: string;
  handle: string;
  platform: string;
  currentMonth: {
    followers: number;
    date: string;
  };
  previousMonth: {
    followers: number;
    date: string;
  };
  growth: {
    absolute: number;
    percentage: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [accountsRes, comparisonsRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/analytics/comparison"),
      ]);

      if (accountsRes.ok && comparisonsRes.ok) {
        setAccounts(await accountsRes.json());
        setComparisons(await comparisonsRes.json());
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectAccount = async (platform: string) => {
    try {
      setConnecting(platform);
      const res = await fetch("/api/accounts/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      if (res.ok) {
        const { authUrl } = await res.json();
        window.location.href = authUrl;
      }
    } catch (err) {
      setError(`Failed to connect ${platform}`);
      setConnecting(null);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your social media growth</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Account Button */}
        {accounts.length < 6 && (
          <div className="mb-8">
            <button
              onClick={() => router.push("/connect")}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              + Connect Account
            </button>
          </div>
        )}

        {/* Accounts Grid */}
        {accounts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {comparisons.map((comparison) => (
                <ComparisonCard key={comparison.accountId} data={comparison} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h-6m6 0h-6"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No accounts connected yet
            </h3>
            <p className="text-gray-600 mb-6">
              Connect your social media accounts to start tracking your growth
            </p>
            <button
              onClick={() => router.push("/connect")}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Connect Your First Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
