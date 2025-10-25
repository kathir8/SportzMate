export interface MateListItem {
    id: number;
    name: string;
    location: string;
    sport: 'Badminton' | 'Cricket' | 'Cycling' | 'Tennis' | 'Football' | 'Running' | 'Swimming' | 'Yoga' | 'Basketball';
    eventDateTime: number;
    distanceOrDuration: string;
    profileImg: string;
    requiredMembers: number;
    confirmedMembers: number;
    coords: Coordinates;
    distanceKm?: number
}

export interface MateDetail extends MateListItem {
    description: string;
    members: number[];
}

export interface Coordinates { lat: number; lng: number; }