import { Express } from 'express';

export default interface ModuleRouter {
  app: Express;

  route(): void;
}
