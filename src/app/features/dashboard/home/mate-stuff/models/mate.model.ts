import { SportType } from "src/app/shared/models/shared.model";

export interface MateListItem {
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
    distanceKm?: number
}

export interface MateDetail extends MateListItem {
    description: string;
    members: number[];
}

export interface Coordinates { lat: number; lng: number; }