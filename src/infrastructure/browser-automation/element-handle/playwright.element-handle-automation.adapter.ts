import type { ElementHandle } from "playwright-core";
import type { ElementHandleAutomation } from "./element-handle-automation.interface";

export class PlaywrightElementHandleAutomationAdapter
  implements ElementHandleAutomation
{
  constructor(elementHandle: ElementHandle) {
    this._elementHandle = elementHandle;
  }

  private readonly _elementHandle;

  public click(): Promise<void> {
    return this._elementHandle.click();
  }
}
