import { AppDataSource } from "../database/data-source";
import { Category } from "../entities/Category.entity";

const CategoryService = {
  async create(data: Partial<Category>): Promise<Category> {
    const repository = AppDataSource.getRepository(Category);
    const instance = repository.create({ ...data });

    return repository.save(instance);
  },

  async update(id: string, data: Partial<Category>): Promise<Category | null> {
    const repository = AppDataSource.getRepository(Category);

    await repository.update({ id }, { ...data });
    const updatedData = await repository.findOneBy({ id });
    return updatedData;
  },

  async getAll(): Promise<Category[] | null> {
    const repository = AppDataSource.getRepository(Category);

    return repository.find({
      order: {
        description: "ASC"
      }
    });
  },

  async getByClassCode(class_code: string): Promise<Category | null> {
    const repository = AppDataSource.getRepository(Category);

    return repository.findOneBy({ class_code });
  },
};

export default CategoryService;
