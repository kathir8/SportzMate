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

  wrapWithSymbol(value: string | number, delimiter: string = ','): string {
    return value ? `${delimiter}${value}${delimiter}` : ``;
  }


  showProfileImage(profileImage?: string) {
    return profileImage || 'assets/icon/signup/profile.png'
  }

}
