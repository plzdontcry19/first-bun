export type HttpRequestOptions = {
  headers?: { [key: string]: string };
  params?: { [key: string]: string | number | boolean };
  responseType?: "json" | "text" | "blob" | "arraybuffer";
  withCredentials?: boolean;
};

export interface HttpClient {
  get<ResponseT = any>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<ResponseT>;
  post<ResponseT = any, RequestT = any>(
    url: string,
    data?: RequestT,
    options?: HttpRequestOptions
  ): Promise<ResponseT>;
  put<ResponseT = any, RequestT = any>(
    url: string,
    data?: RequestT,
    options?: HttpRequestOptions
  ): Promise<ResponseT>;

  patch<ResponseT = any, RequestT = any>(
    url: string,
    data?: RequestT,
    options?: HttpRequestOptions
  ): Promise<ResponseT>;

  delete<ResponseT = any>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<ResponseT>;

  setBaseUrl(baseUrl: string): void;
  setDefaultHeaders(headers: { [key: string]: string }): void;
  setCookie(name: string, value: string): void;
  setCookiesFromJson(jsonString: string): void;

  get baseUrl(): string;
}
