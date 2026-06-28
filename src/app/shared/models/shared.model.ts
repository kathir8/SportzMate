import { ProfileInfo } from "src/app/core/model/user.model";

export interface ApiResp {
  rspFlg: boolean,
  rspMsg: string,
}

export enum SportType {
  Badminton = 1,
  Cricket = 2,
  Cycling = 3,
  Tennis = 4,
  Football = 5,
  Running = 6,
  Swimming = 7,
  Yoga = 8,
  Basketball = 9,
}

export interface SportsList {
  sportID: SportType;
  sportsName: string;
  sportsIcon: string;
  sportsImg: string;
}


export interface ScrollList {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}



export interface EventBasic extends Coordinates {
  currentVacancy: number;
  totalVacancy: number;
  eventDateTime: number;
  eventDesc: string;
  eventId: number;
  eventName: string;
  location: string;
  eventStatus: string;
  profileImage: string;
  sportType: number;
  approvalId:number;
  groupChatId:string;
  sportId: SportType;
}

export interface Coordinates { latitude: number; longitude: number; }
export interface GeoLatLng { lat: number; lng: number; }

export type EventProfileHolder = {
  eventCreator?: ProfileInfo;
  interestedUser?: ProfileInfo;
  invitedUser?: ProfileInfo;
};

export type EventProfileKey = keyof EventProfileHolder;