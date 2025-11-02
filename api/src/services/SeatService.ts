import { AppDataSource } from "../database/data-source";
import { Seat } from "../entities/Seat.entity";

const SeatService = {
  async create(seat: Partial<Seat>): Promise<Seat> {
    const repository = AppDataSource.getRepository(Seat);
    const instance = repository.create({ ...seat });

    return repository.save(instance);
  },
  async getAll(): Promise<Seat[] | null> {
    const repository = AppDataSource.getRepository(Seat);

    return repository.find({
      order: {
        description: "ASC"
      }
    });
  }
};

export default SeatService;
