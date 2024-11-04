import Employee from '@modules/employee/infra/typeorm/entities/Employee';
import { sign } from 'jsonwebtoken';
// eslint-disable-next-line import/no-unresolved
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { inject, injectable } from 'tsyringe';
import IHashProvider from '@modules/employee/providers/HashProvider/models/IHashProvider';
import IEmployeeRepository from '../repositories/IEmployeeRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  employee: Employee;
  token: string;
}

@injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class AuthenticateEmployeeService {
  constructor(
    @inject('EmployeeRepository')
    private employeesRepository: IEmployeeRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const employee = await this.employeesRepository.findByEmail(email);

    if (!employee) {
      throw new AppError('Combinação incorreta.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      employee.password
    );

    if (!passwordMatched) {
      throw new AppError('Combinação incorreta.', 401);
    }

    const subjectObject = {
      id: employee.id,
      email: employee.email,
      role: employee.role,
    };

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign(subjectObject, secret, {
      expiresIn,
    });

    return { employee, token };
  }
}
