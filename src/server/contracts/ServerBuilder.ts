export default interface ServerBuilder {
  next?: ServerBuilder;

  setNext(next: ServerBuilder): void;

  build(): void;
}
