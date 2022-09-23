import { describe, test, expect, jest } from '@jest/globals';
import MessageCreator from '../src/services/MessageCreator';
import { prismaMock } from './prisma.mock';

describe('MessageCreator', () => {
  test('should create message', async () => {
    const createMessage = prismaMock.message.create as jest.MockedFunction<
      typeof prismaMock.message.create
    >;

    createMessage.mockResolvedValue({
      text: 'created',
    });

    const getMessage = prismaMock.message.findFirst as jest.MockedFunction<
      typeof prismaMock.message.findFirst
    >;

    getMessage.mockResolvedValue(null);

    const messageCreator = new MessageCreator(prismaMock);

    await messageCreator.create('Test!');

    expect(createMessage.mock.calls.length).toBe(1);
    expect(createMessage).toBeCalledWith({
      data: {
        text: 'Test!',
      },
    });
  });
});
