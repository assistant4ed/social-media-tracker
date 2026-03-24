import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teamId = req.nextUrl.searchParams.get("teamId");

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Check if user has access to this team
    const access = await prisma.teamAccess.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const members = await prisma.teamAccess.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { teamId, email, role } = await req.json();

    if (!teamId || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user is team owner
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team || team.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by email
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add user to team
    const teamAccess = await prisma.teamAccess.upsert({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUser.id,
        },
      },
      update: {
        role,
      },
      create: {
        teamId,
        userId: targetUser.id,
        role,
        grantedBy: session.user.id,
      },
    });

    return NextResponse.json(teamAccess, { status: 201 });
  } catch (error) {
    console.error("Failed to add team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { teamId, userId } = await req.json();

    if (!teamId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user is team owner
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team || team.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.teamAccess.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    return NextResponse.json({ message: "Member removed" }, { status: 200 });
  } catch (error) {
    console.error("Failed to remove team member:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
