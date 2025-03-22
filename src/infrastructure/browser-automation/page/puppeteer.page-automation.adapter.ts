import { Page } from "puppeteer";
import type {
  GotoOptions,
  PageAutomation,
  WaitForNavigationOptions,
  WaitForSelectorOptions,
} from "./page-automation.interface";
import type { ElementHandleAutomation } from "../element-handle/element-handle-automation.interface";
import { PuppeteerElementHandleAutomationAdapter } from "../element-handle/puppeteer.element-handle-automation.adapter";

export class PuppeteerPageAutomationAdapter implements PageAutomation {
  constructor(private readonly _page: Page) {}

  public async goto(
    url: string,
    { waitUntil, timeout }: GotoOptions
  ): Promise<void> {
    await this._page.goto(url, {
      waitUntil: waitUntil === "networkidle" ? "networkidle0" : waitUntil,
      timeout,
    });
  }

  public async click(selector: string): Promise<void> {
    const element = await this._page.$(selector);
    if (element) {
      await element.click();
    } else {
      throw new Error(`Element not found for selector: ${selector}`);
    }
  }

  public async focus(selector: string): Promise<void> {
    const element = await this._page.$(selector);
    if (element) {
      await element.focus();
    } else {
      throw new Error(`Element not found for selector: ${selector}`);
    }
  }

  public async type(selector: string, text: string): Promise<void> {
    const element = await this._page.$(selector);
    if (element) {
      await element.type(text);
    } else {
      throw new Error(`Element not found for selector: ${selector}`);
    }
  }

  public async waitForSelector(
    selector: string,
    { timeout = 30000, state = "visible" }: WaitForSelectorOptions
  ): Promise<ElementHandleAutomation | null> {
    const element = await this._page.waitForSelector(selector, {
      timeout,
      visible: state === "visible",
      hidden: state === "hidden",
    });
    return element
      ? new PuppeteerElementHandleAutomationAdapter(element)
      : null;
  }

  public async waitForNavigation({
    waitUntil = "load",
    timeout = 30000,
  }: WaitForNavigationOptions): Promise<void> {
    await this._page.waitForNavigation({
      timeout,
      waitUntil: waitUntil === "networkidle" ? "networkidle0" : waitUntil,
    });
  }

  public async findElement(
    selector: string
  ): Promise<ElementHandleAutomation | null> {
    const element = await this._page.$(selector);
    return element
      ? new PuppeteerElementHandleAutomationAdapter(element)
      : null;
  }

  public async findElements(
    selector: string
  ): Promise<ElementHandleAutomation[]> {
    const elements = await this._page.$$(selector);
    return elements.map(
      (element) => new PuppeteerElementHandleAutomationAdapter(element)
    );
  }

  public async select(
    selector: string,
    values: string | string[]
  ): Promise<string[]> {
    const element = await this._page.$(selector);
    if (element) {
      const selectedValues = await this._page.select(
        selector,
        ...(Array.isArray(values) ? values : [values])
      );
      return selectedValues;
    } else {
      throw new Error(`Element not found for selector: ${selector}`);
    }
  }

  public async screenshot(options?: {
    path: string;
    fullPage: boolean;
  }): Promise<void> {
    await this._page.screenshot(options);
  }

  public async blockRequests(
    blockedDomains: string[],
    blockedResourceTypes: string[]
  ): Promise<void> {
    await this._page.setRequestInterception(true);
    this._page.on("request", (request) => {
      const url = request.url();
      const resourceType = request.resourceType();
      if (
        blockedDomains.some((domain) => url.includes(domain)) ||
        blockedResourceTypes.includes(resourceType)
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }
}
