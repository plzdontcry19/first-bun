import { chromium, type Browser, type BrowserContext } from "playwright";
import type { PageAutomation } from "../page/page-automation.interface";
import { PlaywrightPageAutomationAdapter } from "../page/playwright.page-automation.adapter";
import type {
  BrowserAutomation,
  Cookie,
  LaunchOptions,
} from "./browser-automation.interface";

export class PlaywrightBrowserAutomationAdapter implements BrowserAutomation {
  private _browser?: Browser;
  private _browserContext?: BrowserContext;

  public async launch({
    args,
    headlessMode: headless,
    executablePath,
    viewport,
  }: LaunchOptions = {}): Promise<void> {
    if (this._browser) throw new Error("Browser is already launched");
    this._browser = await chromium.launch({
      args,
      headless,
      executablePath,
    });
    if (!this._browser) throw new Error("Browser is not launched");
    this._browserContext = await this._browser.newContext({ viewport });
  }

  public async openPage(): Promise<PageAutomation> {
    if (!this._browserContext) throw new Error("Browser is not launched");
    const page = await this._browserContext.newPage();
    return new PlaywrightPageAutomationAdapter(page);
  }

  public async setCookie(cookies: Cookie[]): Promise<void> {
    if (!this._browserContext)
      throw new Error("Browser context is not initialized");
    await this._browserContext.addCookies(cookies);
  }

  public async close(): Promise<void> {
    await this._browserContext?.close();
    await this._browser?.close();
  }
}
