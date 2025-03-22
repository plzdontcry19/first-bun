import { load } from "cheerio";

import type { HtmlElement } from "../html-element.interface";
import type { HtmlParser } from "../html-parser.interface";
import { CheerioHtmlElementAdapter } from "./cheerio.html-element.adapter";

export class CheerioHtmlParserAdapter implements HtmlParser<HtmlElement> {
  public querySelectorAll(html: string, query: string): HtmlElement[] {
    const $ = load(html);
    const element = $(query);

    return element.toArray().map((e) => new CheerioHtmlElementAdapter($, e));
  }

  public querySelector(html: string, query: string): HtmlElement | null {
    const $ = load(html);
    const node = $(query).first().get(0);
    if (!node) return null;
    return new CheerioHtmlElementAdapter($, node);
  }

  public getScriptAsText(html: string): string {
    const $ = load(html);
    return $("script").text();
  }
}
