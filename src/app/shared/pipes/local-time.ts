import { Pipe, PipeTransform } from '@angular/core';
import { DATE_FORMATS } from 'src/app/core/constants';
import { formatToLocalTime } from '../utils/date-utils';

@Pipe({
  name: 'localTime'
})
export class LocalTimePipe implements PipeTransform {

  private readonly cache = new Map<string, string>();

  transform(timestamp?: number, formatStr: string = DATE_FORMATS.FULL): string {
    if (!timestamp) return '';

    const cacheKey = `${timestamp}-${formatStr}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const formatted = formatToLocalTime(timestamp, formatStr);
    this.cache.set(cacheKey, formatted);

    return formatted;
  }

}
