// export default from "./http";

import HttpRequest from '../axios/http';
import type { App } from 'vue';

const httpInstance = new HttpRequest({})

export default {
  install(app: App) {
    app.config.globalProperties.$http = httpInstance;
    app.provide('http', httpInstance);
  }
};