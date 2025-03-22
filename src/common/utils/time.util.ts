export class TimeUtil {
  public static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
