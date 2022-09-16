export interface IMessagesMissingTranslation {
  text: string;
  langCode: string;
}

export interface ILangMessages {
  langCode: string;
  messages: string[];
}

export default class {
  static group(messages: IMessagesMissingTranslation[]): ILangMessages[] {
    const langs: ILangMessages[] = [];

    messages.forEach((message) => {
      const lang = langs.find((lang) => lang.langCode === message.langCode);

      if (lang) {
        lang.messages.push(message.text);
      } else {
        langs.push({
          langCode: message.langCode,
          messages: [message.text],
        });
      }
    });

    return langs;
  }
}
