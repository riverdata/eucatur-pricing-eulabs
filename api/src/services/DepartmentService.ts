import { AppDataSource } from "../database/data-source";
import { Department } from "../entities/Department.entity";

const DepartmentService = {
  async create(data: Partial<Department>): Promise<Department> {
    const repository = AppDataSource.getRepository(Department);
    const instance = repository.create({ ...data });

    return repository.save(instance);
  },

  async update(id: string, data: object) {
    const repository = AppDataSource.getRepository(Department);

    await repository.update({ id }, { ...data });
  },

  async getAll(): Promise<Department[] | null> {
    const repository = AppDataSource.getRepository(Department);

    return repository.find({
      order: {
        description: "ASC"
      },
      relations: ['manager'],
    });
  },
  
  async getByOne(data: object): Promise<Department | null> {
    const repository = AppDataSource.getRepository(Department);

    return repository.findOne({
      where: { ...data },
      relations: ['manager']
    });
  },

  async delete(id: string) {
    const repository = AppDataSource.getRepository(Department);

    return await repository.softDelete(id);
  }
};

export default DepartmentService;
