import { describe, beforeEach, test, jest, expect } from '@jest/globals';
import { mock, MockProxy, mockDeep } from 'jest-mock-extended';
import MessagesHandler from '~/server/modules/messages/Handler';
import MessageCreator from '~/services/MessageCreator';

type HandlerParams = Parameters<MessagesHandler['createMessage']>;

type Request = HandlerParams[0];
type Response = HandlerParams[1];

describe('MessageHandler', () => {
  let messageCreatorMock: MockProxy<MessageCreator>;
  let messagesHandler: MessagesHandler;
  let mockRequest: MockProxy<Request>;
  let mockResponse: MockProxy<Response>;

  beforeEach(() => {
    messageCreatorMock = mock<MessageCreator>();
    messagesHandler = new MessagesHandler(messageCreatorMock);
    mockRequest = mockDeep<Request>();
    mockResponse = mockDeep<Response>();

    mockResponse.status = jest.fn((status) => {
      mockResponse.statusCode = status;
      return mockResponse;
    }) as unknown as jest.MockedFunction<typeof mockResponse.status>;
  });

  test('Should call messageCreator.create', () => {
    const createMethod = messageCreatorMock.create as jest.MockedFunction<
      typeof messageCreatorMock.create
    >;

    mockRequest.body.text = 'Hello world';

    messagesHandler.createMessage(mockRequest, mockResponse);

    expect(createMethod).toBeCalledWith('Hello world');
  });

  test('Should return 422 response if no text is passed', () => {
    mockRequest.body.text = undefined;

    messagesHandler.createMessage(mockRequest, mockResponse);

    const mockStatusMethod = mockResponse.status as jest.MockedFunction<
      typeof mockResponse.status
    >;

    expect(mockStatusMethod).toBeCalledWith(422);
  });
});
