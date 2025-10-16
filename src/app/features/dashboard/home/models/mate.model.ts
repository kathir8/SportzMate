export interface MateListItem {
    id: number;
    name: string;
    location: string;
    sport: string;
    time: string;
    distanceOrDuration: string;
    profileImg?: string;
    requiredMembers: number;
    confirmedMembers: number;
}

export interface MateDetail extends MateListItem {
    description: string;
    members: number[];
}
