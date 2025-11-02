import { User, UserRole } from "../entities";
import { AppDataSource } from "../database/data-source";
import { Not } from "typeorm";

const UserService = {
  async create(data: Partial<User>, role: UserRole): Promise<User> {
    const repository = AppDataSource.getRepository(User);
    const instance = repository.create({ ...data, role });

    return repository.save(instance);
  },

  async getAll(): Promise<User[]> {
    const repository = AppDataSource.getRepository(User);
    return repository.find({
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        status: true,
      },
      order: {
        role: "ASC"
      },
      relations: ['department'],
    });
  },

  async getByEmail(email: string, id: string): Promise<User | null> {
    const repository = AppDataSource.getRepository(User);
  
    return repository.findOne({
      where: {
        email,
        id: Not(id),
      },
      relations: ['department'],
    });
  },

  async getByOne(data: object): Promise<User | null> {
    const repository = AppDataSource.getRepository(User);

    return repository.findOne({
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        status: true,
      },
      where: { ...data },
      relations: ['department'],
    });
  },

  async getByOnePassWord(data: object): Promise<User | null> {
    const repository = AppDataSource.getRepository(User);

    return repository.findOne({
      where: { ...data },
      relations: ['department'],
    });
  },

  async update(id: string, data: object) {
    const repository = AppDataSource.getRepository(User);

    await repository.update({ id }, { ...data });
  },

  async delete(id: string) {
    const repository = AppDataSource.getRepository(User);

    return await repository.softDelete(id);
  }
};

export default UserService;
