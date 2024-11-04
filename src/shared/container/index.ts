import { container } from 'tsyringe';
import '@modules/employee/providers';

import IUrlRepository from '@modules/urls/repositories/IUrlRepository';
import UrlRepository from '@modules/urls/infra/typeorm/repositories/UrlRepository';

import IEmployeesRepository from '@modules/employee/repositories/IEmployeeRepository';
import EmployeesRepository from '@modules/employee/infra/typeorm/repositories/EmployeeRepository';

container.registerSingleton<IUrlRepository>('UrlRepository', UrlRepository);

container.registerSingleton<IEmployeesRepository>(
  'EmployeeRepository',
  EmployeesRepository
);
