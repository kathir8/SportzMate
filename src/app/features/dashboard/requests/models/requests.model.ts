import { ProfileInfo } from "src/app/core/model/user.model";
import { ApiResp, Coordinates, EventBasic, ScrollList, SportType } from "src/app/shared/models/shared.model";

export interface Requests extends EventBasic {
    approvalId: number;
    remarks: string;
    requestDateTime: number;
    responseDateTime: number;
    status: string;
}
export interface MyRequests extends Requests {
    eventCreator:ProfileInfo;
}

export interface EventsApi {
    userId: number;
    page: number;
    size: number;
}

export interface myRequestsApi extends EventsApi {
    statusFilter: string;
    eventStatusFilter: string;
}

export interface myRequestsApiResp extends ScrollList {
    userId: number;
    requestedEvents: MyRequests[];
}

export interface JoinRequestsApiResp extends ScrollList {
    userId: number;
    message: string;
    receivedRequests: JoinRequests[];
}

export interface myEventsApiResp extends ScrollList {
    userId: number;
    message: string;
    events: MyRequests[];
}
export interface JoinRequests extends Requests {
    activeStatus: string;
    interestedUser:ProfileInfo;
}

export enum AcceptReject {
    'Accepted' = 'ACCEPTED',
    'Rejected' = 'REJECTED',
    'Pending' = 'PENDING',
}

export interface ProcessRequestApi {
    approvalId: number;
    eventCreatorId: number;
    action: AcceptReject;
}

export interface ProcessRequestApiResp extends ApiResp {
    approvalId: number;
    eventId: number;
    interestedUserId: number,
    status: string,
    responseDateTime: number
}

// export interface GroupDetail {
//     id: number;
//     name: string;
//     eventName: string;
//     location: string;
//     sport: SportType;
//     eventDateTime: number;
//     distanceOrDuration: string;
//     profileImg: string;
//     totalVacancy: number;
//     currentVacancy: number;
//     coords: Coordinates;
//     distanceKm?: number;
//     description: string;
//     members: number[];
//     requestedMembers: RequestedList[]
// }

export interface RequestedList {
    id: number;
    eventName: string;
    profileImage: string;
    location: string;
    sport: SportType;
    eventDateTime: number;
    distanceOrDuration: string;
    totalVacancy: number;
    currentVacancy: number;
    participants?: number[];
    coords: Coordinates;
    distanceKm?: number;
    description: string;
}

export interface Invite {
    id: string;
    title: string;
    sport: string;
    creatorUid: string;
    startAt: string;       // ISO date
    location: { lat: number, lng: number, placeName?: string };
    participants: string[]; // array of UIDs
    totalVacancy?: number;
    createdAt?: string;
    updatedAt?: string;
}