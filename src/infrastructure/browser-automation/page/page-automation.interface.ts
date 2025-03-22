import type { ElementHandleAutomation } from "../element-handle/element-handle-automation.interface";

export type WaitUntil = "load" | "domcontentloaded" | "networkidle";
export type State = "visible" | "hidden";
export type GotoOptions = Partial<{ waitUntil: WaitUntil; timeout: number }>;
export type WaitForSelectorOptions = Partial<{ timeout: number; state: State }>;
export type WaitForNavigationOptions = Partial<{
  waitUntil: WaitUntil;
  timeout: number;
}>;
export type AbortRequestOptions = Partial<{
  waitUntil: WaitUntil;
  timeout: number;
}>;

export interface PageAutomation {
  goto(url: string, options?: GotoOptions): Promise<void>;
  click(selector: string): Promise<void>;
  focus(selector: string): Promise<void>;
  type(selector: string, text: string): Promise<void>;
  waitForNavigation(options?: WaitForNavigationOptions): Promise<void>;
  waitForSelector(
    selector: string,
    options: WaitForSelectorOptions
  ): Promise<ElementHandleAutomation | null>;

  findElement(selector: string): Promise<ElementHandleAutomation | null>;
  findElements(selector: string): Promise<ElementHandleAutomation[]>;
  select(selector: string, values: string | string[]): Promise<string[]>;
  screenshot(options?: { path: string; fullPage: boolean }): Promise<void>;
  blockRequests(
    blockedDomains: string[],
    blockedResourceTypes: string[]
  ): Promise<void>;
}
