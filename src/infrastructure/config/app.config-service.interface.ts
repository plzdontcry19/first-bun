export interface AppConfigService {
  get logLevel(): string;
  get logFile(): boolean;
  get environment(): string;
}
