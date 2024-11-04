import ensureAuthenticated from '@modules/employee/infra/http/middlewares/ensureAuthenticate';
import { Router } from 'express';
import UrlController from '../controllers/UrlController';

const UrlRouter = Router();

const urlsController = new UrlController();

UrlRouter.post('/public', urlsController.create);

UrlRouter.use(ensureAuthenticated);

UrlRouter.post('/', urlsController.create);
UrlRouter.get('/', urlsController.findUrl);
UrlRouter.get('/search', urlsController.show);
UrlRouter.put('/:id', urlsController.update);
UrlRouter.delete('/:id', urlsController.delete);

export default UrlRouter;
