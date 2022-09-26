import { describe, expect, test, jest } from '@jest/globals';
import { render } from '@testing-library/vue';
import AutoTranslate from '~/components/AutoTranslate';

describe('AutoTranslate', () => {
  const defaultOptions = {
    mocks: {
      $t: (text: string) => text,
      $te: () => true,
      $axios: {
        $post: () => {},
      },
    },
    attrs: {
      text: 'Hello world',
    },
  };

  test('Should simple render', () => {
    const { getByText, container } = render(AutoTranslate, defaultOptions);

    getByText('Hello world');
    expect(container).toMatchSnapshot();
  });

  test('Should change tag', () => {
    const { container } = render(AutoTranslate, defaultOptions);

    expect(container).toMatchSnapshot();
  });

  test('Should fall throug classes', () => {
    const { container } = render(AutoTranslate, defaultOptions);

    expect(container).toMatchSnapshot();
    expect(container.children[0].classList.contains('my-class')).toBeTruthy();
  });

  test('Should send text to server if not exists', () => {
    const sendToServer = jest.fn();
    render(AutoTranslate, {
      ...defaultOptions,
      mocks: {
        ...defaultOptions.mocks,
        $te: () => false,
        $axios: {
          $post: sendToServer,
        },
      },
    });

    expect(sendToServer).toHaveBeenCalled();
    expect(sendToServer).toBeCalledWith('/api/nuxt-auto-translate/messages', {
      text: 'Hello world',
    });
  });

  test('Should not send text to server if exists', () => {
    const sendToServer = jest.fn();
    render(AutoTranslate, {
      ...defaultOptions,
      mocks: {
        ...defaultOptions.mocks,
        $te: () => true,
        $axios: {
          $post: sendToServer,
        },
      },
    });

    expect(sendToServer).not.toBeCalled();
  });
});
