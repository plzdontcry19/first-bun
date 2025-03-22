export type ReturnConfig<T> = T extends string | number ? T : never;

export interface ConfigService<DefaultT = string | number | boolean> {
  get<T extends DefaultT = never>(name: string): ReturnConfig<T> | undefined;
  get<T extends DefaultT = never>(name: string, defaultValue: T): T;
  getOrThrow<T extends DefaultT = never>(name: string): ReturnConfig<T>;
  getOrThrow<T extends DefaultT = never>(
    name: string,
    defaultValue: T
  ): ReturnConfig<T>;
}
