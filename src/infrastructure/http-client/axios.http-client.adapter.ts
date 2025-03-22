import { randomUUIDv7 } from "bun";
import { type BodyInit } from "undici-types";
import axios, { type AxiosInstance } from "axios";

import type { HttpHandlerLogger } from "../logger/http-handler.logger.interface";
import { BaseHttpClient } from "./base.http-client";
import { HttpClientError } from "./http-client.exception";
import type { HttpRequestOptions } from "./http-client.interface";
import { DateUtils } from "../../common/utils/date.util";

export class AxiosHttpClient extends BaseHttpClient {
  constructor(
    logger: HttpHandlerLogger,
    { baseUrl }: { baseUrl?: string } = {}
  ) {
    super(baseUrl);
    this._logger = logger;

    this._axiosInstance = axios.create();
  }

  private readonly _logger: HttpHandlerLogger;
  private readonly _axiosInstance: AxiosInstance;

  protected async fetch<ResponseT = any, RequestT = any>({
    endpoint,
    method,
    data,
    options,
  }: {
    endpoint: string;
    method: string;
    data?: RequestT;
    options?: HttpRequestOptions;
  }): Promise<ResponseT> {
    const fullUrl = this.buildUrlWithParams(endpoint, options?.params);
    const headers = this.buildHeaders(options?.headers);
    let body: BodyInit | undefined;

    if (data instanceof FormData) body = data;
    else if (data) {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }

    const url = new URL(endpoint, this.baseUrl).toString();

    const referanceId = randomUUIDv7();

    const startTime = DateUtils.now();
    this._logger.handleHttpRequest({
      referanceId,
      method,
      url,
      headers,
      params: options?.params,
      payload: body,
    });

    try {
      const response = await this._axiosInstance.request({
        method,
        url: fullUrl,
        headers,
        data: body,
        responseType: options?.responseType,
      });

      this._logger.handleHttpResponse({
        referanceId,
        url: response.config.url ?? "-",
        status: response.status,
        headers: response.headers as Record<string, string>,
        payload: response.data,
        executeTime: DateUtils.now().getTime() - startTime.getTime(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this._logger.handleHttpResponse({
          referanceId,
          url: error.response.config.url ?? "-",
          status: error.response.status,
          headers: error.response.headers as Record<string, string>,
          payload: error.response.data,
          executeTime: DateUtils.now().getTime() - startTime.getTime(),
        });
        throw new HttpClientError(
          `Request failed with status ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw error;
    }
  }
}
