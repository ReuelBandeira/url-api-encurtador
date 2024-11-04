/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable radix */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import CreateUrlService from '@modules/urls/services/CreateUrlService';
import UpdateUrlService from '@modules/urls/services/UpdateUrlService';
import DeleteUrlService from '@modules/urls/services/DeleteUrlService';
import UrlRepository from '../../typeorm/repositories/UrlRepository';

export default class UrlController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { originalUrl } = request.body;

    const employeeId = request.user ? request.user.id : null;

    const createUrl = container.resolve(CreateUrlService);

    const urls = await createUrl.execute({
      originalUrl: String(originalUrl),
      id_employee: employeeId,
    });

    return response.status(201).json(urls);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const { id: id_employee, username } = request.user || {
      id: null,
      username: 'usuário desconhecido',
    };

    const urlsRepository = new UrlRepository();

    const urls = await urlsRepository.findBySearch(
      Number(id),
      id_employee ? Number(id_employee) : undefined
    );

    if (!urls || urls.length === 0) {
      throw new AppError(
        `Não existe URL encurtada por esse usuário: ${username} e com o ID de registro: ${id}`,
        404
      );
    }

    const updatedClicks = Number(urls[0].clicks) + 1;

    const updatedUrl = await urlsRepository.updateClicks({
      ...urls[0],
      clicks: updatedClicks,
    });

    return response.json(updatedUrl);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { originalUrl } = request.body;

    const idParsed = parseInt(id);
    const updateUrl = container.resolve(UpdateUrlService);

    const Url = await updateUrl.execute({
      id: idParsed,
      originalUrl,
    });

    return response.status(201).json(Url);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const parsedId = parseInt(id);

    const deleteUrl = container.resolve(DeleteUrlService);

    await deleteUrl.execute({ id: parsedId });

    return response.status(204).json({});
  }

  public async findUrl(
    request: Request,
    response: Response
  ): Promise<Response> {
    const urls = new UrlRepository();

    const { id: id_employee, username } = request.user || {
      id: null,
      username: 'usuário desconhecido',
    };

    const urls_registers = await urls.findAllRegisters(Number(id_employee));

    if (!urls_registers || urls_registers.length === 0) {
      throw new AppError(
        `Não existem URLs encurtadas por esse usuário: ${username}`,
        404
      );
    }

    return response.json({
      urls_registers,
    });
  }
}
