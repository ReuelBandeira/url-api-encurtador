import ICreateUrlDTO from '../dtos/ICreateUrlDTO';
import Url from '../infra/typeorm/entities/Url';

export default interface IUrlRepository {
  findById(id: number): Promise<Url | undefined>;
  findByName(originalUrl: string): Promise<Url | undefined>;
  findBySearch(id: number): Promise<Url[]>;
  create(data: ICreateUrlDTO): Promise<Url>;
  update(url: Url): Promise<Url>;
  delete(id: number): Promise<void>;
  findAllRegisters(id_employee: number): Promise<Url[]>;
}
