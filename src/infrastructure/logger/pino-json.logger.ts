import pino from "pino";

import { DateFormatEnum } from "../../common/constants/date-format.enum";
import { DateUtils } from "../../common/utils/date.util";
import type { ErrorHandlerLogger } from "./error-handler.logger.interface";
import type {
  HandleHttpInput,
  HandleHttpRequestInput,
  HandleHttpResponseInput,
  HttpHandlerLogger,
} from "./http-handler.logger.interface";
import type { Logger } from "./logger.interface";
import type { AppConfigService } from "../config/app.config-service.interface";

export class PinoJsonLogger
  implements Logger, ErrorHandlerLogger, HttpHandlerLogger
{
  constructor(appConfigService: AppConfigService) {
    const level = appConfigService.logLevel;
    const logFile = appConfigService.logFile;
    this._instance = pino(
      {
        level: "debug",
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          bindings: ({ pid }) => ({ pid }),
          level: (label) => ({ level: label.toUpperCase() }),
        },
      },
      pino.multistream([
        ...(logFile
          ? [
              {
                level: "debug",
                stream: pino.destination({
                  dest: `log/${DateUtils.getDateFormat({
                    format: DateFormatEnum.DD_MM_YYYY,
                  })}.log`,
                  append: true,
                  sync: false,
                  mkdir: true,
                }),
              },
            ]
          : []),
        { level, stream: pino.destination(1) },
      ])
    );
  }

  private readonly _instance;

  public debug(message: string, meta?: Record<string, any>): void {
    this._instance.debug({ message, meta });
  }
  public info(message: string, meta?: Record<string, any>): void {
    this._instance.info({ message, meta });
  }
  public warn(message: string, meta?: Record<string, any>): void {
    this._instance.warn({ message, meta });
  }

  public error(message: string, meta?: Record<string, any>): void {
    this._instance.error({ message, meta });
  }

  public handleError(error: unknown): void {
    if (!(error instanceof Error))
      throw new Error("First parameter must instance of Error");
    this._instance.error({
      type: "APP_ERROR",
      message: error.message,
      meta: { stack: error.stack },
    });
  }

  public handleHttpRequest({
    method,
    referanceId,
    url,
    params,
    headers,
    payload,
  }: HandleHttpRequestInput): void {
    this._handleHttpInput({
      type: "HTTP_REQUEST",
      referanceId,
      method,
      url,
      params,
      headers,
      payload,
    });
  }

  public handleHttpResponse({
    referanceId,
    url,
    status,
    headers,
    payload,
    executeTime,
  }: HandleHttpResponseInput): void {
    this._handleHttpInput({
      type: "HTTP_RESPONSE",
      referanceId,
      url,
      headers,
      payload,
      status,
      executeTime,
    });
  }

  private _handleHttpInput({
    type,
    referanceId,
    method,
    url,
    status,
    headers,
    params,
    payload,
    executeTime,
  }: HandleHttpInput) {
    this._instance.info({
      type,
      meta: {
        referanceId,
        method,
        url,
        status,
        params,
        contentType: headers?.["content-type"],
        contentEncoding: headers?.["content-encoding"],
        executeTime,
      },
    });

    this._instance.debug({
      type,
      meta: {
        referanceId,
        headers,
        payload,
      },
    });
  }
}
