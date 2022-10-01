import { Express, Router } from 'express';
import ModuleRouter from '~/server/contracts/ModuleRouter';
import Handler from '~/server/modules/translations/Handler';

export default class TranslationRouter implements ModuleRouter {
  handler: Handler;
  app: Express;
  router: Router = Router();

  constructor(app: Express, translationHandler: Handler) {
    this.app = app;
    this.handler = translationHandler;
  }

  route() {
    this.router.get('', this.handler.listTranslations);

    this.app.use('/translations', this.router);
  }
}
