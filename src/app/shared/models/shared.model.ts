export interface ApiResp {
  rspFlg: boolean,
  rspMsg: string,
}

export enum SportType {
  Badminton = 'Badminton',
  Cricket = 'Cricket',
  Cycling = 'Cycling',
  Tennis = 'Tennis',
  Football = 'Football',
  Running = 'Running',
  Swimming = 'Swimming',
  Yoga = 'Yoga',
  Basketball = 'Basketball',
}

export interface SportsList {
  sportID: number;
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


export interface EventBasic {
  currentVacancy: number;
    totalVacancy: number;
    eventDateTime: number;
    eventDescription: string;
    eventIdPk: number;
    // eventId: number;
    eventName: string;
    location: string;
        eventStatus: string;
    profileImage:string;
    sportType: number;

}