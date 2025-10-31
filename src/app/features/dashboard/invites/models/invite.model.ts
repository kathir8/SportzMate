import { SportType } from "src/app/shared/models/shared.model";

export interface MyInvites {
    id: number;
    name: string;
    location: string;
    sport: SportType;
    eventDateTime: number;
    profileImg: string;
    requiredMembers: number;
    confirmedMembers: number;
    chatCount:number
}