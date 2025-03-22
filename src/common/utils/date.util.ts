import dayjs, { Dayjs } from "dayjs";
import type { DateFormatEnum } from "../constants/date-format.enum";

export class DateUtils {
  public static now(): Date {
    return dayjs().toDate();
  }

  public static fromIsoString(str: string): Date {
    return dayjs(str).toDate();
  }

  public static startOfDay(date: Date | Dayjs | string): Date {
    return dayjs(date).startOf("day").toDate();
  }

  public static endOfDay(date: Date | Dayjs | string): Date {
    return dayjs(date).endOf("day").toDate();
  }
  public static getDateFormat({
    date,
    format,
  }: {
    date?: Date | Dayjs | string;
    format: DateFormatEnum;
  }): string {
    return dayjs(date).format(format.toString());
  }
}
