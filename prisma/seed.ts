import 'dotenv/config';
import prisma from "../src/lib/prisma";
import { BadgeSubscriptionPosition } from "../src/generated/prisma/enums";



async function main() {
  console.log("Seeding database...");

  const subscriptions = [
    {
      name: "Ana Silva",
      courseName: "Engenharia de Software",
      position: "ESTAGIARIO" as BadgeSubscriptionPosition,
      image: "https://github.com/shadcn.png",
      badgeFile: "https://example.com/badge1.pdf",
    },
    {
      name: "Carlos Souza",
      courseName: null,
      position: "PROFESSOR" as BadgeSubscriptionPosition,
      image: "", // Fallback test
      badgeFile: "https://example.com/badge2.pdf",
    },
    {
      name: "Mariana Oliveira",
      courseName: null,
      position: "ADMINISTRATIVO" as BadgeSubscriptionPosition,
      image: "https://github.com/shadcn.png",
      badgeFile: "https://example.com/badge3.pdf",
    },
    {
      name: "Pedro Santos",
      courseName: "Medicina",
      position: "ESTAGIARIO" as BadgeSubscriptionPosition,
      image: "",
      badgeFile: "https://example.com/badge4.pdf",
    },
    {
      name: "Fernanda Costa",
      courseName: null,
      position: "TUTOR" as BadgeSubscriptionPosition,
      image: "https://github.com/shadcn.png",
      badgeFile: "https://example.com/badge5.pdf",
    },
  ];

  for (const sub of subscriptions) {
    await prisma.badgeSubscription.create({
      data: sub,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });