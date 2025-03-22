import puppeteer, { type Browser, type BrowserContext } from "puppeteer";
import type { PageAutomation } from "../page/page-automation.interface";
import type {
  BrowserAutomation,
  Cookie,
  LaunchOptions,
} from "./browser-automation.interface";
import { PuppeteerPageAutomationAdapter } from "../page/puppeteer.page-automation.adapter";

export class PuppeteerBrowserAutomationAdapter implements BrowserAutomation {
  private _browser?: Browser;
  private _browserContext?: BrowserContext;

  public async launch({
    args,
    headlessMode: headless,
    executablePath,
    viewport = { width: 800, height: 600 },
  }: LaunchOptions = {}): Promise<void> {
    if (this._browser) throw new Error("Browser is already launched");

    this._browser = await puppeteer.launch({
      args,
      headless,
      executablePath,
      defaultViewport: viewport,
    });

    if (!this._browser) throw new Error("Browser is not launched");
    this._browserContext = await this._browser.createBrowserContext();
  }

  public async openPage(): Promise<PageAutomation> {
    if (!this._browserContext) throw new Error("Browser is not launched");
    const page = await this._browserContext.newPage();
    return new PuppeteerPageAutomationAdapter(page);
  }

  public async setCookie(cookies: Cookie[]): Promise<void> {
    if (!this._browserContext)
      throw new Error("Browser context is not initialized");

    await this._browserContext.setCookie(...cookies);
  }

  public async close(): Promise<void> {
    await this._browser?.close();
  }
}
