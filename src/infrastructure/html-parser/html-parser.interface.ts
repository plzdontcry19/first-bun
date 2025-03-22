import type { HtmlElement } from "./html-element.interface";

export interface HtmlParser<T = HtmlElement> {
  querySelectorAll(html: string, query: string): T[];
  querySelector(html: string, query: string): T | null;
  getScriptAsText(html: string): string;
}
