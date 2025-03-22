import { ElementHandle } from "puppeteer";
import type { ElementHandleAutomation } from "./element-handle-automation.interface";

export class PuppeteerElementHandleAutomationAdapter
  implements ElementHandleAutomation
{
  constructor(private readonly _elementHandle: ElementHandle) {}

  public async click(): Promise<void> {
    await this._elementHandle.click();
  }
}
