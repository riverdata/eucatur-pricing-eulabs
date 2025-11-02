import dayjs from "dayjs";
import { AppDataSource } from "../database/data-source";
import { PricingHistory, PricingStatus } from "../entities/PricingHistory.entity";
function generatePricingCode() {
  const now = new Date();
  const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PRC-${dateCode}-${random}`;
}

const PricingHistoryService = {
  async create(data: Partial<PricingHistory>): Promise<PricingHistory> {
    const repository = AppDataSource.getRepository(PricingHistory);

    let isUnique = false;
    let attempts = 0;
    let pricing = "";
    while (!isUnique && attempts < 5) {
      pricing = generatePricingCode();

      const exists = await repository.findOne({
        where: { pricing_code: pricing }
      });

      if (!exists) {
        isUnique = true;
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error("Não foi possível gerar um código de precificação único.");
    }
    data.pricing_code = pricing;
    const instance = repository.create({ ...data });
    return repository.save(instance);
  },

  async update(id: string, data: PricingHistory) {
    const repository = AppDataSource.getRepository(PricingHistory);
    await repository.update({ id }, { ...data });
  },

  async getAll(): Promise<PricingHistory[] | null> {
    const repository = AppDataSource.getRepository(PricingHistory);
    const now = dayjs().toDate();
  
    return repository
      .createQueryBuilder('pricing')
      .leftJoinAndSelect('pricing.line', 'line')
      .orderBy(`
        CASE 
          WHEN pricing.activationDate > :now THEN 0 
          ELSE 1 
        END
      `, 'ASC')
      .addOrderBy('pricing.activationDate', 'ASC')
      .addOrderBy('pricing.status', 'ASC')
      .setParameter('now', now)
      .getMany();
  },

  async getByOne(data: object): Promise<PricingHistory | null> {
    const repository = AppDataSource.getRepository(PricingHistory);

    return repository.findOne({
      where: { ...data },
      relations: ['line']
    });
  },

  async getBy(data: object): Promise<PricingHistory | null> {
    const repository = AppDataSource.getRepository(PricingHistory);

    return repository.findOne({
      where: { ...data },
      relations: ['line']
    });
  },

  async delete(id: string) {
    const repository = AppDataSource.getRepository(PricingHistory);

    return await repository.softDelete(id);
  },

  async deletePermanently(id: string) {
    const repository = AppDataSource.getRepository(PricingHistory);
    return await repository.delete(id);
  }
};

export default PricingHistoryService;
