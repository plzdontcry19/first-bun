import { PinoJsonLogger } from "./infrastructure/logger/pino-json.logger";
import { ConfigServiceAdapter } from "./infrastructure/config/config-service.adapter";
import { AppConfigServiceImpl } from "./infrastructure/config/app.cofig-service";

const configService = new ConfigServiceAdapter();
const appConfigService = new AppConfigServiceImpl(configService);
const logger = new PinoJsonLogger(appConfigService);

const main = async () => {
  const startTime = performance.now();
  const endTime = performance.now();
  logger.info(`Task completed in ${endTime - startTime} milliseconds.`);
};

main().catch((e) => {
  logger.handleError(e);
});
