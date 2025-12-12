import prisma from "@/src/lib/prisma";
import { DashboardClient } from "./dashboard-client";
import { BadgeSubscriptionPosition } from "@/src/generated/prisma/enums";

interface DashboardPageProps {
  searchParams: Promise<{
    role?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const role = params.role;
  const sort = params.sort || "recent";
  const currentPage = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const skip = (currentPage - 1) * limit;

  const where: any = {};
  if (
    role &&
    Object.values(BadgeSubscriptionPosition).includes(
      role as BadgeSubscriptionPosition
    )
  ) {
    where.position = role as BadgeSubscriptionPosition;
  }

  const [totalItems, subscriptions] = await Promise.all([
    prisma.badgeSubscription.count({ where }),
    prisma.badgeSubscription.findMany({
      where,
      orderBy: {
        id: sort === "oldest" ? "asc" : "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DashboardClient
        initialSubscriptions={subscriptions}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={limit}
      />
    </div>
  );
}
