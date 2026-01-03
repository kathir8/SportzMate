import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  csvToArray(value?: string): string[] {
    return value
      ?.split(',')
      .map(v => v.trim())
      .filter(Boolean) ?? [];
  }

}
