import type { ConfigService, ReturnConfig } from "./config-service.interface";

export class ConfigServiceAdapter<
  K = Record<string | symbol, unknown>,
  DefaultT = string | number | boolean
> implements ConfigService<DefaultT>
{
  private _cache: Partial<K> = {};

  public get<T extends DefaultT = never>(
    name: string,
    defaultValue?: unknown
  ): ReturnConfig<T> | undefined {
    const cachedValue = this._getFromCache(name as keyof K);
    if (cachedValue !== undefined) return cachedValue as ReturnConfig<T>;

    const envValue = this._getFromEnv(name as keyof K);
    if (envValue !== undefined) {
      this._setInCacheIfDefined(name, envValue);
      return this._castValue(envValue, defaultValue) as ReturnConfig<T>;
    }
    return this._castValue(defaultValue, defaultValue) as ReturnConfig<T>;
  }

  public getOrThrow<T extends DefaultT = never>(
    name: string,
    defaultValue?: unknown
  ): ReturnConfig<T> {
    const value = this.get(name, defaultValue);
    if (value === undefined)
      throw new Error(`Configuration key "${name}" is missing`);

    return value as ReturnConfig<T>;
  }

  private _getFromCache<T = any>(propertyPath: keyof K): T | undefined {
    return this._cache[propertyPath] as T;
  }

  private _getFromEnv<T = any>(propertyPath: keyof K): T | undefined {
    const envValue = Bun.env[propertyPath as unknown as string];
    return envValue !== undefined ? (envValue as T) : undefined;
  }

  private _set<T>(name: string, value: T): void {
    this._cache[name as keyof K] = value as any;
  }

  private _setInCacheIfDefined(name: string, value: any): void {
    if (value !== undefined) {
      const castedValue = this._castValue(value);
      this._set(name, castedValue);
    }
  }

  private _castValue<T>(value: any, defaultValue?: T): T | undefined {
    if (value === undefined) return undefined;
    if (typeof value === "string" && typeof defaultValue === "number") {
      const numValue = Number(value);
      return isNaN(numValue) ? undefined : (numValue as T);
    }
    if (typeof value === "string" && (value === "true" || value === "false"))
      return (value === "true") as T;

    return value as T;
  }
}
