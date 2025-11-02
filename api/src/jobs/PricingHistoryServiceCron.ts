import cron from 'node-cron';
import { AppDataSource } from "../database/data-source";
import { PricingHistory, PricingStatus } from "../entities/PricingHistory.entity";
import dayjs from 'dayjs';

const pricingRepository = AppDataSource.getRepository(PricingHistory);
export function startPricingStatusJob() {
  cron.schedule('0 0 * * *', async () => {
    const now = dayjs();

    await pricingRepository
      .createQueryBuilder()
      .update(PricingHistory)
      .set({ status: PricingStatus.ACTIVE })
      .where('status = :scheduled', { scheduled: PricingStatus.SCHEDULED })
      .andWhere('activationDate <= :now', { now: now.toDate() })
      .andWhere('expiresAt > :now', { now: now.toDate() })
      .execute();

    await pricingRepository
      .createQueryBuilder()
      .update(PricingHistory)
      .set({ status: PricingStatus.EXPIRED })
      .where('status != :expired', { expired: PricingStatus.EXPIRED })
      .andWhere('expiresAt <= :now', { now: now.toDate() })
      .execute();

    console.log('✔️ Cron job de atualização de status da precificação iniciado.');
  });
}