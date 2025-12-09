-- CreateEnum
CREATE TYPE "BadgeSubscriptionPosition" AS ENUM ('ESTAGIARIO', 'ADMINISTRATIVO', 'PRECEPTOR', 'TUTOR', 'PROFESSOR', 'PROFESSORA');

-- CreateTable
CREATE TABLE "badge_subscriptions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "courseName" VARCHAR(100) NOT NULL,
    "position" "BadgeSubscriptionPosition" NOT NULL DEFAULT 'ESTAGIARIO',
    "image" VARCHAR(200) NOT NULL,

    CONSTRAINT "badge_subscriptions_pkey" PRIMARY KEY ("id")
);
