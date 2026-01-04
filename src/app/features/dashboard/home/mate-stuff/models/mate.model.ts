import { SportType } from 'src/app/shared/models/shared.model';

export interface MateListItem {
    name: string;
    location: string;
    sport: SportType;
    eventDateTime: number;
    distanceOrDuration: string;
    profileImg: string;
    requiredMembers: number;
    participants: number[];
    coords: Coordinates;
    distanceKm?: number;
    eventIdPk:number;
}

export interface MateDetail extends MateListItem {
    description: string;
    members: number[];
}

export interface Coordinates { lat: number; lng: number; }



export interface eventListApi {
    latitude: number,
    longitude: number,
    radius: number,
    userId: number,
    page: number,
    size: number
}


export interface eventListApiResp extends eventListApi {
    events: MateListItem[]
    message: string,
    pageSize: number,
}