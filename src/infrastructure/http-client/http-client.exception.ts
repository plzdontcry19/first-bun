export class HttpClientError extends Error {
  public status?: number;
  public data?: unknown;
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, HttpClientError.prototype);
  }
}
