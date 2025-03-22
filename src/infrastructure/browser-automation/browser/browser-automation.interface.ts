import type { PageAutomation } from "../page/page-automation.interface";

export type LaunchOptions = Partial<{
  args: string[];
  headlessMode: boolean;
  executablePath: string;
  viewport: Viewport;
}>;

export type Viewport = {
  width: number;
  height: number;
};
export type Cookie = {
  name: string;
  value: string;
  domain: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  expires?: number;
  maxAge?: number;
};

export interface BrowserAutomation {
  launch(input: LaunchOptions): Promise<void>;
  openPage(): Promise<PageAutomation>;
  setCookie(cookies: Cookie[]): Promise<void>;
}
