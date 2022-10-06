import { Express, Router } from 'express';
import ModuleRouter from '~/server/contracts/ModuleRouter';
import Handler from '~/server/modules/messages/Handler';

export default class MessageRouter implements ModuleRouter {
  handler: Handler;
  app: Express;
  router: Router = Router();

  constructor(app: Express, messageHandler: Handler) {
    this.app = app;
    this.handler = messageHandler;
  }
  getRouter(): Router {
    return this.router;
  }

  route() {
    this.router.post('', this.handler.createMessage);

    this.app.use('/messages', this.router);
  }
}
