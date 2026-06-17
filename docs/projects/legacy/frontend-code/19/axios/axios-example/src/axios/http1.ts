import { mergeConfig } from 'vite';
// 封装axios

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type CancelTokenSource,
  AxiosError,
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

  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token:string)=>void> = [];

  constructor(config: ExpandAxiosRequestConfig) {
    this._instance = axios.create(Object.assign(this._defaultConfig, config));

    this.pendingRequests = new Map();
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
        // 处理请求头
        config = handleChangeRequestHeader(config);
        // 为请求头添加验证信息
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

          // token无感刷新
          if (error.response.status === 401) {
            if (!this.isRefreshing) {
              this.isRefreshing = true
              try {
              const result = await handleTokenRefresh(error ,this._instance)

              this.refreshSubscribers.forEach(cb => {
                const newToken = result.config.headers.Authorization as string;
                cb(newToken)
              })
              this.refreshSubscribers = []
            } finally {
              this.isRefreshing = false
            }
            } else {
              // 正在刷新token, 将请求假如队列
              new Promise(resolve => {
                this.refreshSubscribers.push((newToken) => {
                  const config = error.mergeConfig
                  config.headers.Authorization = newToken
                  resolve(this._instance(config))
                })
              })
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
