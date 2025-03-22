import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import type { HtmlElement } from "../html-element.interface";

export class CheerioHtmlElementAdapter implements HtmlElement {
  constructor(cheerioAPI: CheerioAPI, node: AnyNode) {
    this._content = cheerioAPI(node).text();
    this._text = cheerioAPI(node).text();
    const attr = cheerioAPI(node).attr();
    if (attr) this._attributes = attr;
  }

  private readonly _content: string;
  private readonly _attributes: Record<string, string> = {};
  private readonly _text: string;

  public get attribute(): Record<string, string> {
    return this._attributes;
  }

  public get content(): string {
    return this._content;
  }

  get text(): string {
    return this._text;
  }
}
