export interface HtmlElement {
  get attribute(): Record<string, string>;
  get content(): string;
  get text(): string;
}
