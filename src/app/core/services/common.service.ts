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
    return profileImage && profileImage !== 'string' ? profileImage : 'assets/icon/signup/profile.png'
  }


  updateEventProfileImage<T extends {
    eventCreatorProfileImage?: string;
    interestedUserProfileImage?: string;
  }>(
    response: readonly T[] | null,
    fromMyRequestedEvents: boolean
  ): T[] {

    if (!response || response.length === 0) {
      return [];
    }

    return response.map(item => ({
      ...item,
      profileImage: fromMyRequestedEvents
        ? item.eventCreatorProfileImage
        : item.interestedUserProfileImage,
    }));
  }

}
