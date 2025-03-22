import { type Page } from "playwright";
import type {
  GotoOptions,
  PageAutomation,
  WaitForNavigationOptions,
  WaitForSelectorOptions,
} from "./page-automation.interface";
import type { ElementHandleAutomation } from "../element-handle/element-handle-automation.interface";
import { PlaywrightElementHandleAutomationAdapter } from "../element-handle/playwright.element-handle-automation.adapter";

export class PlaywrightPageAutomationAdapter implements PageAutomation {
  constructor(private readonly _page: Page) {}

  public async goto(
    url: string,
    { waitUntil, timeout }: GotoOptions
  ): Promise<void> {
    await this._page.goto(url, { waitUntil, timeout });
  }

  public async click(selector: string): Promise<void> {
    await this._page.locator(selector).click();
  }

  public async focus(selector: string): Promise<void> {
    await this._page.locator(selector).focus();
  }

  public async type(selector: string, text: string): Promise<void> {
    await this._page.locator(selector).fill(text);
  }

  public async waitForSelector(
    selector: string,
    { timeout = 30000, state = "visible" }: WaitForSelectorOptions
  ): Promise<ElementHandleAutomation | null> {
    const element = await this._page.waitForSelector(selector, {
      timeout,
      state,
    });
    return element
      ? new PlaywrightElementHandleAutomationAdapter(element)
      : null;
  }

  public async waitForNavigation({
    waitUntil = "load",
    timeout = 30000,
  }: WaitForNavigationOptions): Promise<void> {
    await this._page.waitForNavigation({ timeout, waitUntil });
  }

  public async findElement(
    selector: string
  ): Promise<ElementHandleAutomation | null> {
    const element = await this._page.locator(selector).first().elementHandle();
    return element
      ? new PlaywrightElementHandleAutomationAdapter(element)
      : null;
  }

  public async findElements(
    selector: string
  ): Promise<ElementHandleAutomation[]> {
    const elements = await this._page.locator(selector).elementHandles();
    return elements.map(
      (element) => new PlaywrightElementHandleAutomationAdapter(element)
    );
  }

  public async select(
    selector: string,
    values: string | string[]
  ): Promise<string[]> {
    const locator = this._page.locator(selector);
    return locator.selectOption(Array.isArray(values) ? values : [values]);
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
    await this._page.route("**/*", (route, request) => {
      if (
        blockedDomains.some((domain) => request.url().includes(domain)) ||
        blockedResourceTypes.includes(request.resourceType())
      )
        route.abort();
      else route.continue();
    });
  }
}
