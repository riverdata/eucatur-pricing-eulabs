import { AppDataSource } from "../database/data-source";
import { Agency } from "../entities/Agency.entity";

const AgencyService = {
  async create(data: Partial<Agency>): Promise<Agency> {
    const repository = AppDataSource.getRepository(Agency);
    const instance = repository.create({ ...data });

    return repository.save(instance);
  },

  async update(id: string, data: object) {
    const repository = AppDataSource.getRepository(Agency);

    return await repository.update({ id }, { ...data });
  },

  async getAll(): Promise<Agency[] | null> {
    const repository = AppDataSource.getRepository(Agency);

    return repository.find({
      order: {
        description: "ASC"
      },
      relations: ['agency_type']
    });
  },

  async getAllActive(): Promise<Agency[] | null> {
    const repository = AppDataSource.getRepository(Agency);

    return repository.createQueryBuilder('agency')
      .leftJoinAndSelect('agency.agency_type', 'agency_type')
      .where('agency.agency_status = :status', { status: 'NORMAL' })
      .andWhere('agency.deletedAt IS NULL')
      .orderBy('agency_type.description', 'ASC')
      .addOrderBy('agency.description', 'ASC')
      .getMany();
  },

  async getByAgencyCode(agency_code: string): Promise<Agency | null> {
    const repository = AppDataSource.getRepository(Agency);

    return repository.findOneBy({ agency_code });
  },
};

export default AgencyService;
