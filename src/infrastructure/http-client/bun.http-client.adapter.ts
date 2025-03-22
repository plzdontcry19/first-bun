import { randomUUIDv7 } from "bun";
import { type BodyInit } from "undici-types";

import type { HttpHandlerLogger } from "../logger/http-handler.logger.interface";
import { BaseHttpClient } from "./base.http-client";
import { HttpClientError } from "./http-client.exception";
import type { HttpRequestOptions } from "./http-client.interface";
import { DateUtils } from "../../common/utils/date.util";

export class BunHttpClient extends BaseHttpClient {
  constructor(
    logger: HttpHandlerLogger,
    { baseUrl }: { baseUrl?: string } = {}
  ) {
    super(baseUrl);
    this._logger = logger;
  }

  private readonly _logger: HttpHandlerLogger;

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

    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
      credentials: options?.withCredentials ? "include" : "same-origin",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this._logger.handleHttpResponse({
        referanceId,
        url: response.url,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        payload: errorBody,
        executeTime: DateUtils.now().getTime() - startTime.getTime(),
      });

      throw new HttpClientError(
        `Request failed with status ${response.status}`,
        response.status,
        errorBody
      );
    }

    const responseData = (await this._response(
      response,
      options?.responseType
    )) as ResponseT;

    this._logger.handleHttpResponse({
      referanceId,
      url: response.url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      payload: responseData,
      executeTime: DateUtils.now().getTime() - startTime.getTime(),
    });

    return responseData;
  }

  private async _response(
    response: Response,
    responseType?: "json" | "text" | "blob" | "arraybuffer"
  ): Promise<unknown> {
    if (!responseType) return await response.json();
    return responseType === "arraybuffer"
      ? await response.arrayBuffer()
      : await response[responseType]();
  }
}
