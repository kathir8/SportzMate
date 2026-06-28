import { inject, Injectable } from '@angular/core';
import { Coordinates, EventProfileHolder, EventProfileKey, GeoLatLng, SportType } from 'src/app/shared/models/shared.model';
import { CommonStore } from '../stores/common-store';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  private commonStore = inject(CommonStore);
  constructor(){
    this.commonStore.loadSports();
  }

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

  convertToLatLng(coords: Coordinates):GeoLatLng {
    return { lat: coords.latitude, lng: coords.longitude }
  }

  selectedSports(id: SportType){
    return this.commonStore.sports().find(x=>x.sportID === id);
  }


  updateEventProfileImage<T extends EventProfileHolder>(
    response: readonly T[] | null,
    property: EventProfileKey  = 'eventCreator',
  ): T[] {

    if (!response || response.length === 0) {
      return [];
    }

    return response.map(item => ({
      ...item,
      profileImage: item[property]?.profileImage
    }));
  }

}
