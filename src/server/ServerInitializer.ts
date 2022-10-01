import ServerBuilder from '~/server/contracts/ServerBuilder';

export default class ServerInitializer {
  serverBuilders: ServerBuilder[];

  constructor(serverBuilders: ServerBuilder[] = []) {
    this.serverBuilders = serverBuilders;
  }

  init() {
    this.serverBuilders.forEach((builder, index) => {
      this.buildChain(builder, index);
    });

    const [firstBuilder] = this.serverBuilders;

    firstBuilder?.build();
  }

  private buildChain(builder: ServerBuilder, builderIndex: number) {
    const lastIndex = this.serverBuilders.length - 1;

    if (lastIndex === builderIndex) return;

    const nextBuilder = this.serverBuilders[builderIndex + 1];

    builder.setNext(nextBuilder);
  }
}
