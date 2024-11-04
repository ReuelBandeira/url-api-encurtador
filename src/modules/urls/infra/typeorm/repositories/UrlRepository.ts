import ICreateUrlDTO from '@modules/urls/dtos/ICreateUrlDTO';
import IUrlRepository from '@modules/urls/repositories/IUrlRepository';
import { getRepository, Like, Repository } from 'typeorm';
import Url from '../entities/Url';

export default class UrlRepository implements IUrlRepository {
  private ormRepository: Repository<Url>;

  constructor() {
    this.ormRepository = getRepository(Url);
  }

  public async findById(id: number): Promise<Url | undefined> {
    const urls = await this.ormRepository.findOne({
      where: { id },
    });

    return urls;
  }

  public async findByName(originalUrl: string): Promise<Url | undefined> {
    const urls = await this.ormRepository.findOne({
      where: { originalUrl },
    });

    return urls;
  }

  public async findBySearch(id: number, id_employee?: number): Promise<Url[]> {
    const whereCondition = id_employee ? { id, id_employee } : { id };

    return this.ormRepository.find({
      relations: ['employee'],
      where: whereCondition,
    });
  }

  public async create(urlsData: ICreateUrlDTO): Promise<Url> {
    const urls = this.ormRepository.create(urlsData);
    await this.ormRepository.save(urls);
    return urls;
  }

  public async update(UrlData: Url): Promise<Url> {
    const urls = await this.ormRepository.save(UrlData);
    return urls;
  }

  public async updateClicks(UrlData: Url): Promise<Url> {
    const urls = await this.ormRepository.save(UrlData);
    return urls;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete({ id });
  }

  public async findAllRegisters(id_employee: number): Promise<Url[]> {
    return this.ormRepository.find({
      relations: ['employee'],
      where: { id_employee },
      order: { id: 'DESC' },
    });
  }
}
