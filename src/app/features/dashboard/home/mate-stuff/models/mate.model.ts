import { ApiResp, EventBasic, ScrollList, SportType } from 'src/app/shared/models/shared.model';
import { Requests } from '../../../requests/models/requests.model';

export interface MateListItem extends EventBasic {
    sport: SportType;
    profileImage: string;
    participants: number[];
    coords: Coordinates;
    distanceKm?: number;
    eventIdPk: number;
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
    size: number,
}


export interface eventListApiResp extends eventListApi, ScrollList {
    events: MateListItem[]
    message: string,
    pageSize: number,
}


export interface requestJoinApi {
    eventId: number,
    userId: number,
}

export interface requestJoinApiResp extends ApiResp {

}

export interface AcceptOrReject {

    readonly item: Requests;
    readonly accepted: boolean;
    readonly event: MouseEvent;

}