import { SportType } from "src/app/shared/models/shared.model";
import { Coordinates } from "../../home/mate-stuff/models/mate.model";

export interface MyInvites {
    id: number;
    name: string;
    location: string;
    sport: SportType;
    eventDateTime: number;
    profileImg: string;
    requiredMembers: number;
    participants: number[];
    chatCount:number
}
export interface GroupInvites {
    id: number;
    name: string;
    location: string;
    sport: SportType;
    eventDateTime: number;
    profileImg: string;
    requiredMembers: number;
    participants: number[];
    chatCount:number
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
}

export interface Invite {
  id: string;
  title: string;
  sport: string;
  creatorUid: string;
  startAt: string;       // ISO date
  location: { lat:number, lng:number, placeName?:string };
  participants: string[]; // array of UIDs
  requiredMembers?: number;
  createdAt?: string;
  updatedAt?: string;
}