-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('ESTAGIARIO', 'INSTITUCIONAL');

-- CreateTable
CREATE TABLE "subscription_links" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" "BadgeSubscriptionPosition" NOT NULL,
    "limit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_links_code_key" ON "subscription_links"("code");
