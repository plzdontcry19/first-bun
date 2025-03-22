import { AppConfigEnum } from "../../common/constants/config/app.config.enum";
import { LogConfigEnum } from "../../common/constants/config/log.config.enum";
import type { AppConfigService } from "./app.config-service.interface";
import type { ConfigService } from "./config-service.interface";

export class AppConfigServiceImpl implements AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get logFile(): boolean {
    return this.configService.get<boolean>(LogConfigEnum.LOG_FILE, false);
  }

  get logLevel(): string {
    return this.configService.get<string>(LogConfigEnum.LOG_LEVEL, "info");
  }
  get environment(): string {
    return this.configService.get<string>(AppConfigEnum.NODE_ENV, "dev");
  }
}
