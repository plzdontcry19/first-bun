export type HandleHttpRequestInput = {
  method: string;
  referanceId?: string;
  url: string;
  headers: Record<string, string>;
  params?: { [key: string]: string | number | boolean };
  payload?: unknown;
};

export type HandleHttpResponseInput = {
  referanceId?: string;
  url: string;
  status: number;
  headers: Record<string, string>;
  payload?: unknown;
  executeTime: number;
};

export type HandleHttpInput = Partial<{
  referanceId: string;
  method: string;
  url: string;
  status: number;
  headers: Record<string, string>;
  params: { [key: string]: string | number | boolean };
  payload: unknown;
  executeTime: number;
}> & { type: string };

export interface HttpHandlerLogger {
  handleHttpRequest(input: HandleHttpRequestInput): void;
  handleHttpResponse(input: HandleHttpResponseInput): void;
}
