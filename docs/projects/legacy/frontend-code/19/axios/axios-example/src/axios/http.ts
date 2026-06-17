// 封装axios

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type CancelTokenSource,
  type AxiosError,
} from "axios";

// 扩展 InternalAxiosRequestConfig 类型
declare module "axios" {
  interface InternalAxiosRequestConfig {
    allowDuplicate?: boolean;
  }
}

export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
  CancelTokenSource,
};

import { handleChangeRequestHeader, handleRequestHeaderAuth,
  handleAuthError,
  handleGeneralError,
  handleNetworkError,
  handleTokenRefresh
 } from "./tool";

import message from "../plugins/message";
export interface ExpandAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  allowDuplicate?: boolean; // 是否允许重复请求
}

interface FormatResponse<T> {
  errorno: string
  errmsg: string
  data: T
}

export default class HttpRequest {
  private _instance: AxiosInstance;
  
  private _defaultConfig: ExpandAxiosRequestConfig = {
    baseURL: import.meta.env.VUE_APP_BASE_URL || "/api",
    timeout: 1000 * 6
  };
  private pendingRequests: Map<string, AbortController>;
  private isRefreshing: boolean;
  private refreshSubscribers: ((token: string) => void)[];

  constructor(config: ExpandAxiosRequestConfig) {
    this._instance = axios.create(Object.assign(this._defaultConfig, config));

    this.pendingRequests = new Map();
    this.isRefreshing = false;
    this.refreshSubscribers = [];
    this.setupInterceptors();
  }

  private getUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private getRequestKey(config: ExpandAxiosRequestConfig): string {
    const { method, url, params, data } = config;
    const uniqueId = this.getUniqueId();
    return [method, url, JSON.stringify(params), JSON.stringify(data), uniqueId].join("&");
  }

  private addPendingRequest(config: ExpandAxiosRequestConfig): void {

    const requestKey = this.getRequestKey(config);
    if (config.allowDuplicate) {
      this.removePendingRequest(requestKey);
    }
    
    const controller = new AbortController();
    config.signal = controller.signal;
    this.pendingRequests.set(requestKey, controller);
    
  }

  private removePendingRequest(requestKey: string): void {    
    if (this.pendingRequests.has(requestKey)) {
      const controller = this.pendingRequests.get(requestKey);
      controller?.abort();
      this.pendingRequests.delete(requestKey);      
    }
  }

  public cancelAllRequests(): void {
    this.pendingRequests.forEach((controller) => {
      controller.abort();
    });
    this.pendingRequests.clear();
  }

  private setupInterceptors() {
    this._instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.addPendingRequest(config);
        config = handleChangeRequestHeader(config);
        config = handleRequestHeaderAuth(config);
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this._instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const requestKey = this.getRequestKey(response.config);
        this.removePendingRequest(requestKey);
        
        if (response.status !== 200) {
          return Promise.reject(response.data);
        }

        handleAuthError(response.data.errno);
        handleGeneralError(response.data.errno, response.data.errmsg);
        return response;
      },
      async (error) => {
        if (error.config) {
          const requestKey = this.getRequestKey(error.config);
          this.removePendingRequest(requestKey);
        }
        
        if (axios.isCancel(error)) {
          return Promise.reject(new Error('请求已取消'));
        }
        
        if (error.response) {
          handleNetworkError(error.response.status);
          
          if (error.response.status === 401 && !error.response.config.url?.includes('/refresh')) {
            if (!this.isRefreshing) {
              this.isRefreshing = true;
              try {
                await handleTokenRefresh(error, this._instance);
                // 通知所有等待中的请求
                this.refreshSubscribers.forEach(cb => {
                  const newToken = localStorage.getItem('access_token')!;
                  cb(newToken);
                });
                this.refreshSubscribers = [];
              } finally {
                this.isRefreshing = false;
              }
            } else {
              // 正在刷新token，将请求加入队列
              new Promise((resolve) => {
                this.refreshSubscribers.push((newToken) => {
                  const config = error.config!;
                  config.headers.Authorization = `Bearer ${newToken}`;
                  resolve(this._instance(config));
                });
              });
            }
          }
        } else {
          message.error('网络异常，请稍后重试');
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(
    url: string,
    config?: ExpandAxiosRequestConfig
  ): Promise<AxiosResponse<FormatResponse<T>>> {
    return this._instance.get(url, {
      ...config,
    });
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: ExpandAxiosRequestConfig
  ): Promise<AxiosResponse<FormatResponse<T>>> {
    return this._instance.post(url, data, config);
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: ExpandAxiosRequestConfig
  ): Promise<AxiosResponse<FormatResponse<T>>> {
    return this._instance.put(url, data, config);
  }

  public async delete<T>(
    url: string,
    data?: any,
    config?: ExpandAxiosRequestConfig
  ): Promise<AxiosResponse<FormatResponse<T>>> {
    return this._instance.delete(url, {
      ...config,
      data,
    });
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: ExpandAxiosRequestConfig
  ): Promise<AxiosResponse<FormatResponse<T>>> {
    return this._instance.patch(url, data, config);
  }
}
