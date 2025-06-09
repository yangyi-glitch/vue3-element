export interface AxiosResponse<T = any, D = any> {
  data: T;
  total: number;
  msg: string;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}