import { AppDataSource } from "../database/data-source";
import { Line } from "../entities/Line.entity";

const LineService = {
  async create(data: Partial<Line>): Promise<Line> {
    const repository = AppDataSource.getRepository(Line);
    const instance = repository.create({ ...data });

    return repository.save(instance);
  },

  async update(id: string, data: Partial<Line>): Promise<Line | null> {
    const repository = AppDataSource.getRepository(Line);

    await repository.update({ id }, { ...data });
    const updatedData = await repository.findOneBy({ id });
    return updatedData;
  },

  async getAll(): Promise<Line[]> {
    const repository = AppDataSource.getRepository(Line);

    return repository.createQueryBuilder("line")
      .andWhere("line.line_status = :status", { status: "NORMAL" })
      .andWhere("line.company_code = :company_code", { company_code: "00053" })
      .orderBy("line.line_code", "ASC")
      .getMany();
  },

  async getAllSync(): Promise<Line[]> {
    const repository = AppDataSource.getRepository(Line);

    return repository.createQueryBuilder("line")
      .andWhere("line.line_status = :status", { status: "NORMAL" })
      .andWhere("line.line_code != :code", { code: "E0097" })
      .orderBy("line.line_code", "ASC")
      .getMany();
  },

  async getByLineCode(line_code: string): Promise<Line | null> {
    const repository = AppDataSource.getRepository(Line);

    return repository.findOneBy({ line_code });
  },

  async getByDescription(description: string): Promise<Line | null> {
    const repository = AppDataSource.getRepository(Line);

    return repository.findOneBy({ description });
  }
};

export default LineService;
