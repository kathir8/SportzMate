import { SportType } from "src/app/shared/models/shared.model";
import { Coordinates } from "../../home/mate-stuff/models/mate.model";

export interface MyRequests {
    name: string;
    location: string;
    sport: SportType;
    eventDateTime: number;
    profileImg: string;
    requiredMembers: number;
    participants: number[];
    chatCount: number;
    eventIdPk:number;
}

export interface myEventsApi {
    userId: number;
    page: number;
    size: number;
}

export interface myEventsApiResp {
    userId: number;
    pageSize: number;
    currentPage: number;
    totalElements: number;
    totalPages: number;
    hasNext: number;
    hasPrevious: number;
    message: string;
    events: MyRequests[];
}
export interface JoinRequests {
    name: string;
    location: string;
    sport: SportType;
    eventDateTime: number;
    profileImg: string;
    requiredMembers: number;
    participants: number[];
    chatCount: number;
    eventIdPk:number;
}

export interface GroupDetail {
    id: number;
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
    description: string;
    members: number[];
    requestedMembers: RequestedList[]
}

export interface RequestedList {
    id: number;
    name: string;
    profileImg: string;
    location: string;
    sport: SportType;
    eventDateTime: number;
    distanceOrDuration: string;
    requiredMembers: number;
    participants: number[];
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
    requiredMembers?: number;
    createdAt?: string;
    updatedAt?: string;
}