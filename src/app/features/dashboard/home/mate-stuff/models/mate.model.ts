export interface MateListItem {
    id: number;
    name: string;
    location: string;
    sport: 'Badminton' | 'Cricket' | 'Cycling' | 'Tennis' | 'Football' | 'Running' | 'Swimming' | 'Yoga' | 'Basketball';
    eventDateTime: string;
    distanceOrDuration: string;
    profileImg?: string;
    requiredMembers: number;
    confirmedMembers: number;
    coords: { lat: number; lng: number; }
}

export interface MateDetail extends MateListItem {
    description: string;
    members: number[];
}
