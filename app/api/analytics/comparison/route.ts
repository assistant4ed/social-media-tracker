import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ComparisonData {
  accountId: string;
  handle: string;
  platform: string;
  currentMonth: {
    followers: number;
    date: Date;
  };
  previousMonth: {
    followers: number;
    date: Date;
  };
  growth: {
    absolute: number;
    percentage: number;
  };
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all user accounts
    const accounts = await prisma.socialAccount.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const comparisons: ComparisonData[] = [];

    for (const account of accounts) {
      // Get current month data (latest)
      const currentData = await prisma.followerHistory.findFirst({
        where: {
          accountId: account.id,
          date: {
            gte: currentMonthStart,
            lte: now,
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      // Get previous month data
      const previousData = await prisma.followerHistory.findFirst({
        where: {
          accountId: account.id,
          date: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      const currentFollowers = currentData?.followerCount ?? account.followers;
      const previousFollowers = previousData?.followerCount ?? currentFollowers;

      const absolute = currentFollowers - previousFollowers;
      const percentage =
        previousFollowers > 0
          ? ((absolute / previousFollowers) * 100).toFixed(2)
          : 0;

      comparisons.push({
        accountId: account.id,
        handle: account.handle,
        platform: account.platform,
        currentMonth: {
          followers: currentFollowers,
          date: currentData?.date || now,
        },
        previousMonth: {
          followers: previousFollowers,
          date: previousData?.date || previousMonthStart,
        },
        growth: {
          absolute,
          percentage: parseFloat(percentage as string),
        },
      });
    }

    return NextResponse.json(comparisons, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch comparisons:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparisons" },
      { status: 500 }
    );
  }
}
