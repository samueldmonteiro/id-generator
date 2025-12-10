'use server'

import prisma from "@/src/lib/prisma";
import { BadgeSubscriptionPosition } from "@/src/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export async function createLink(data: {
  type: BadgeSubscriptionPosition;
  limit?: number;
  expiresAt?: Date;
}) {
  try {
    const code = crypto.randomUUID();
    const createdLink = await prisma.subscriptionLink.create({
      data: {
        code,
        type: data.type,
        limit: data.limit || null,
        expiresAt: data.expiresAt || null,
        active: true,
      },
    });

    revalidatePath("/dashboard/links");
    return { success: true, code: createdLink.code, data: createdLink };
  } catch (error) {
    console.error("Error creating link:", error);
    return { success: false, error: "Failed to create link" };
  }
}

export async function getActiveLinks() {
  try {
    const links = await prisma.subscriptionLink.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: links };
  } catch (error) {
    console.error("Error fetching links:", error);
    return { success: false, error: "Failed to fetch links" };
  }
}

export async function updateLinkExpiry(id: number, expiresAt: Date | null) {
  try {
    await prisma.subscriptionLink.update({
      where: { id },
      data: { expiresAt },
    });
    revalidatePath("/dashboard/links");
    return { success: true };
  } catch (error) {
    console.error("Error updating link:", error);
    return { success: false, error: "Failed to update link" };
  }
}

export async function toggleLinkStatus(id: number, active: boolean) {
  try {
    await prisma.subscriptionLink.update({
      where: { id },
      data: { active },
    });
    revalidatePath("/dashboard/links");
    return { success: true };
  } catch (error) {
    console.error("Error toggling link status:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}
