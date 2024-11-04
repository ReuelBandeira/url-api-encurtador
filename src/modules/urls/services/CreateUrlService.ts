import AppError from '@shared/errors/AppError';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { inject, injectable } from 'tsyringe';
import { validate } from 'class-validator';
import IEmployeeRepository from '@modules/employee/repositories/IEmployeeRepository';
import Url from '../infra/typeorm/entities/Url';
import IUrlRepository from '../repositories/IUrlRepository';

interface IRequest {
  originalUrl: string;
  id_employee?: number | null;
}

@injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class CreateUrlService {
  constructor(
    @inject('UrlRepository')
    private UrlRepository: IUrlRepository,

    @inject('EmployeeRepository')
    private employeesRepository: IEmployeeRepository
  ) {}

  async execute({ originalUrl, id_employee }: IRequest): Promise<Url> {
    const url = new Url();
    url.originalUrl = originalUrl;

    // Validação da entidade
    const errors = await validate(url);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => {
          const constraints = err.constraints || {};
          return Object.values(constraints);
        })
        .flat()
        .join(',');

      throw new AppError(`Validation failed: ${errorMessages}`, 400);
    }

    const checkDescriptionExist = await this.UrlRepository.findByName(
      originalUrl
    );

    if (checkDescriptionExist) {
      throw new AppError(`Essa url já foi encurtada`);
    }

    // Função para gerar URL encurtada mantendo o domínio
    // eslint-disable-next-line no-shadow
    function generateShortUrl(originalUrl: string): string {
      const domain = new URL(originalUrl).origin; // Extraindo o domínio
      const shortPath = Math.random().toString(36).substr(2, 6); // Gerando a parte encurtada
      return `${domain}/${shortPath}`; // Compondo a URL final
    }

    // Gera a URL encurtada para a originalUrl recebida
    const shortUrl = generateShortUrl(originalUrl);

    let employeeId = null;

    if (id_employee) {
      const employeeExists = await this.employeesRepository.findById(
        id_employee
      );

      if (employeeExists) {
        employeeId = employeeExists.id;
      }
    }

    const urls = await this.UrlRepository.create({
      originalUrl,
      shortUrl,
      clicks: 0,
      id_employee: Number(employeeId) || null,
    });

    return urls;
  }
}
