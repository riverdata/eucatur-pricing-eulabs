import { AppDataSource } from "../database/data-source";
import { AgencyType } from "../entities/AgencyType.entity";

const AgencyTypeService = {
  async create(data: Partial<AgencyType>): Promise<AgencyType> {
    const repository = AppDataSource.getRepository(AgencyType);
    const instance = repository.create({ ...data });

    return repository.save(instance);
  },

  async getAll(): Promise<AgencyType[] | null> {
    const repository = AppDataSource.getRepository(AgencyType);

    return repository.find({
      order: {
        description: "ASC"
      }
    });
  },
  
  async getByAgencyType(agency_type: string): Promise<AgencyType | null> {
    const repository = AppDataSource.getRepository(AgencyType);

    return repository.findOneBy({ agency_type });
  },
};

export default AgencyTypeService;
