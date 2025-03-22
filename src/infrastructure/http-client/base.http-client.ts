import type { HttpClient, HttpRequestOptions } from "./http-client.interface";

export abstract class BaseHttpClient implements HttpClient {
  public baseUrl: string = "";
  protected defaultHeaders: { [key: string]: string } = {};
  protected cookBodyInities: { [key: string]: string } = {};

  constructor(baseUrl?: string) {
    if (baseUrl) this.baseUrl = baseUrl;
  }

  public async get<ResponseT = any>(
    endpoint: string,
    options?: HttpRequestOptions
  ): Promise<ResponseT> {
    return this.fetch({ endpoint, method: "GET", options });
  }

  public async post<ResponseT = any, RequestT = any>(
    endpoint: string,
    data?: RequestT,
    options?: HttpRequestOptions
  ): Promise<ResponseT> {
    return this.fetch({ endpoint, method: "POST", data, options });
  }

  public async put<ResponseT = any, RequestT = any>(
    endpoint: string,
    data?: RequestT,
    options?: HttpRequestOptions
  ): Promise<ResponseT> {
    return this.fetch({ endpoint, method: "PUT", data, options });
  }

  public patch<ResponseT = any, RequestT = any>(
    endpoint: string,
    data?: RequestT,
    options?: HttpRequestOptions
  ): Promise<ResponseT> {
    return this.fetch({ endpoint, method: "PATCH", data, options });
  }

  public async delete<ResponseT = any>(
    endpoint: string,
    options?: HttpRequestOptions
  ): Promise<ResponseT> {
    return this.fetch({ endpoint, method: "DELETE", options });
  }

  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  public setDefaultHeaders(headers: { [key: string]: string }): void {
    this.defaultHeaders = headers;
  }

  public setCookie(name: string, value: string): void {
    this.cookBodyInities[name] = value;
  }

  public setCookiesFromJson(jsonString: string): void {
    const cookies: Array<{
      name: string;
      value: string;
      domain?: string;
      path?: string;
      expirationDate?: number;
      secure?: boolean;
      httpOnly?: boolean;
    }> = JSON.parse(jsonString);

    cookies.forEach((cookie) => {
      this.cookBodyInities[cookie.name] = cookie.value;
    });
  }

  protected abstract fetch<ResponseT = any, RequestT = any>({
    endpoint,
    method,
    data,
    options,
  }: {
    endpoint: string;
    method: string;
    data?: RequestT;
    options?: HttpRequestOptions;
  }): Promise<ResponseT>;

  protected buildUrlWithParams(
    endpoint: string,
    params?: { [key: string]: string | number | boolean }
  ): string {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, String(value))
      );
    }
    return url.toString();
  }

  protected buildHeaders(headers?: {
    [key: string]: string;
  }): Record<string, string> {
    const combinedHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    const cookieString = Object.entries(this.cookBodyInities)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");

    if (cookieString) combinedHeaders["Cookie"] = cookieString;

    return combinedHeaders;
  }
}
