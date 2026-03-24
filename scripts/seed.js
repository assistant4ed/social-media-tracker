const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with mock data...");

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: await hash("password123", 10),
    },
  });

  console.log("✓ Created user:", user.email);

  // Create mock social accounts
  const accounts = [
    {
      platform: "instagram",
      accountId: "123456789",
      handle: "demo_instagram",
      followers: 15420,
    },
    {
      platform: "twitter",
      accountId: "987654321",
      handle: "demo_twitter",
      followers: 8950,
    },
    {
      platform: "youtube",
      accountId: "UCxxx",
      handle: "Demo Channel",
      followers: 42500,
    },
  ];

  for (const acc of accounts) {
    const account = await prisma.socialAccount.upsert({
      where: {
        platform_accountId: {
          platform: acc.platform,
          accountId: acc.accountId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        platform: acc.platform,
        accountId: acc.accountId,
        handle: acc.handle,
        followers: acc.followers,
        connectedAt: new Date(),
      },
    });

    // Create 30 days of history
    const now = new Date();
    for (let i = 30; i > 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const variance = Math.floor(Math.random() * 200) - 100;
      const followerCount = acc.followers - (variance * (30 - i)) / 30;

      await prisma.followerHistory.upsert({
        where: {
          accountId_date: {
            accountId: account.id,
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          },
        },
        update: {},
        create: {
          accountId: account.id,
          followerCount: Math.max(100, Math.round(followerCount)),
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        },
      });
    }

    console.log(`✓ Created ${acc.platform} account with history`);
  }

  console.log("\n✅ Seeding complete!");
  console.log("\nTest account credentials:");
  console.log("  Email: demo@example.com");
  console.log("  Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
