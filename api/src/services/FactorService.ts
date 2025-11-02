import { AppDataSource } from "../database/data-source";
import { Factor } from "../entities/Factor.entity";

const FactorService = {
  async create(data: Partial<Factor>): Promise<Factor> {
    const repository = AppDataSource.getRepository(Factor);
    const instance = repository.create({ ...data });

    return repository.save(instance);
  },

  async update(id: string, data: object) {
    const repository = AppDataSource.getRepository(Factor);

    await repository.update({ id }, { ...data });
  },

  async getAll(): Promise<Factor[] | null> {
    const repository = AppDataSource.getRepository(Factor);

    return repository.find({
      order: {
        description: "ASC"
      }
    });
  },
  
  async getByOne(data: object): Promise<Factor | null> {
    const repository = AppDataSource.getRepository(Factor);

    return repository.findOne({
      where: { ...data }
    });
  },

  async delete(id: string) {
    const repository = AppDataSource.getRepository(Factor);

    return await repository.softDelete(id);
  }
};

export default FactorService;
