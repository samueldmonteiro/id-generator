import prisma from '../lib/prisma';

export class BadgeSubscriptionRepository {

  async prisma() {
    return prisma.badgeSubscription;
  }
}