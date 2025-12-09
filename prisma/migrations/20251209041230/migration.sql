/*
  Warnings:

  - Added the required column `badgeFile` to the `badge_subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "badge_subscriptions" ADD COLUMN     "badgeFile" VARCHAR(200) NOT NULL;
