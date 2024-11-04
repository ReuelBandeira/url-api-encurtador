// eslint-disable-next-line import/no-unresolved
import Url from '@modules/urls/infra/typeorm/entities/Url';
// eslint-disable-next-line import/no-unresolved
import AppError from '@shared/errors/AppError';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { inject, injectable } from 'tsyringe';
// eslint-disable-next-line import/no-unresolved

import IUrlRepository from '../repositories/IUrlRepository';

interface IRequest {
  id: number;
}

@injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class DeleteUrlService {
  constructor(
    @inject('UrlRepository')
    private UrlRepository: IUrlRepository
  ) {}

  async execute({ id }: IRequest): Promise<Url> {
    const urls = await this.UrlRepository.findById(id);

    if (!urls) {
      throw new AppError(`A url com o id: ${id} não existe.`);
    }

    await this.UrlRepository.delete(id);

    return urls;
  }
}
