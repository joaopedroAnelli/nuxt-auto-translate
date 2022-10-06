import { Express, Router } from 'express';

export default interface ModuleRouter {
  app: Express;
  router: Router;

  route(): void;

  getRouter(): Router;
}
