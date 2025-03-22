import type { Encoding } from "../types/encoding.type";

export class HashUtil {
  public static toSHA256Hash(text: string, encoding?: Encoding): string {
    return Bun.SHA256.hash(text, encoding ?? "hex");
  }

  public static toSHA1Hash(text: string, encoding?: Encoding): string {
    return Bun.SHA1.hash(text, encoding ?? "hex");
  }
}
