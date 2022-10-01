import express, { Express } from 'express';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

export default class NuxtAutoTranslateServerApp {
  private static instance: Express;

  private constructor() {}

  static getInstance() {
    if (NuxtAutoTranslateServerApp.instance) {
      return NuxtAutoTranslateServerApp.instance;
    }

    const app = express();

    app.all('*', jsonParser);

    NuxtAutoTranslateServerApp.instance = app;

    return NuxtAutoTranslateServerApp.instance;
  }
}
