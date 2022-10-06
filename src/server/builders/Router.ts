import ModuleRouter from '~/server/contracts/ModuleRouter';
import ServerBuilder from '~/server/contracts/ServerBuilder';

export default class Router implements ServerBuilder {
  routers: ModuleRouter[];
  next: ServerBuilder | undefined;

  constructor(routers: ModuleRouter[] = []) {
    this.routers = routers;
  }

  build() {
    this.routers.forEach((router) => router.route());

    if (this.next) this.next.build();
  }

  setNext(next: ServerBuilder): void {
    this.next = next;
  }
}
