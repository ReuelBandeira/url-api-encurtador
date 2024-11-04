/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-unresolved
import AppError from '@shared/errors/AppError';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { inject, injectable } from 'tsyringe';
import { validate } from 'class-validator';
import Url from '../infra/typeorm/entities/Url';
import IUrlRepository from '../repositories/IUrlRepository';

interface IRequest {
  id: number;
  originalUrl: string;
}

@injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class UpdateUrlService {
  constructor(
    @inject('UrlRepository')
    private UrlRepository: IUrlRepository
  ) {}

  async execute({ id, originalUrl }: IRequest): Promise<Url> {
    const url = new Url();
    url.originalUrl = originalUrl;

    // Validação da entidade
    const errors = await validate(url);
    if (errors.length > 0) {
      // Formate os erros para uma mensagem compreensível
      const errorMessages = errors
        .map((err) => {
          // Use o operador de coalescência nula para garantir que constraints não seja undefined
          const constraints = err.constraints || {};
          return Object.values(constraints);
        })
        .flat()
        .join(', ');

      throw new AppError(`Validation failed: ${errorMessages}`, 400);
    }
    const urls = await this.UrlRepository.findById(id);

    if (!urls) {
      throw new AppError(`Está url: ${id} não existe`);
    }

    Object.assign(urls, {
      originalUrl,
    });

    await this.UrlRepository.update(urls);

    return urls;
  }
}
