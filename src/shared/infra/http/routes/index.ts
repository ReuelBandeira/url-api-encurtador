import { Router } from 'express';

import employeeRouter from '@modules/employee/infra/http/routes/employees.routes';
import urlsRouter from '@modules/urls/infra/http/routes/url.routes';
import sessionsRouter from '@modules/employee/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/employee', employeeRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/urls', urlsRouter);

export default routes;
