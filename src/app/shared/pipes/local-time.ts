import { Pipe, PipeTransform } from '@angular/core';
import { formatToLocalTime } from '../utils/date-utils';
import { DATE_FORMATS } from 'src/app/core/constants';

@Pipe({
  name: 'localTime'
})
export class LocalTimePipe implements PipeTransform {

  private cache = new Map<string, string>();

  transform(timestamp: number, formatStr: string = DATE_FORMATS.FULL): unknown {
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
