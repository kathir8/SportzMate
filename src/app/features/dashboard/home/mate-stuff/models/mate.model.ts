import { ProfileInfo, UserDetail } from 'src/app/core/model/user.model';
import { ApiResp, Coordinates, EventBasic, ScrollList } from 'src/app/shared/models/shared.model';
import { AcceptReject, RequestBasic, Requests } from '../../../requests/models/requests.model';

export interface MateListItem extends EventBasic {
    // sport: SportType;
    // profileImage: string;
    // participants: number[];
    // coords: Coordinates;
    distanceKm?: number;
    sportId:number;
    eventId: number;
    invitedUser:ProfileInfo;
}

export interface MateDetail extends MateListItem {
    description: string;
    members: number[];
}

export interface eventListApi extends Coordinates {
    radius: number,
    userId: string,
    page: number,
    size: number,
}


export interface eventListApiResp extends eventListApi, ScrollList {
    events: MateListItem[]
    message: string,
}

export interface EventDetailApiResp extends ApiResp{
 eventDetails: EventBasic;
 acceptedRequests:number;
 totalRequests:number;
 pendingRequests:number;
 joinRequests:RequestedMember[];
}

export interface RequestedMember extends RequestBasic{
    approvalId:number
    status: AcceptReject;
    interestedUser:UserDetail;
}

export interface requestJoinApi {
    eventId: number,
    userId: string,
}

export interface requestJoinApiResp extends ApiResp {
  status : AcceptReject.Pending;
}

export interface AcceptOrReject {

    readonly item?: Requests;
    readonly accepted: boolean;
    readonly event: MouseEvent;

}