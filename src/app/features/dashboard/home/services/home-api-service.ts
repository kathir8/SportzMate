import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { MateDetail, MateListItem } from '../mate-stuff/models/mate.model';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {
  private api = inject(ApiService);

  private sampleMateData: MateListItem[] = [
    {
      id: 1,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Meera Jasmine',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      requiredMembers: 8,
      confirmedMembers: 8,
      distanceOrDuration: '600 M',
      sport: 'Cycling',
      coords: { "lat": 13.0901, "lng": 80.2650 }
    },
    {
      id: 2,
      profileImg: 'assets/avatars/avatar2.jfif',
      name: 'Amelia',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Badminton',
      coords: { "lat": 13.0752, "lng": 80.2905 }
    },
    {
      id: 3,
      profileImg: 'assets/avatars/avatar3.jfif',
      name: 'Karthikeyan Rajasekar buhari',
      location: 'Anna Nagar West Extension',
      eventDateTime: 1761408000000,
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 Km',
      sport: 'Running',
      coords: { "lat": 13.0705, "lng": 80.2555 }
    },
    {
      id: 4,
      profileImg: 'assets/avatars/avatar4.jpg',
      name: 'Karthik',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      requiredMembers: 8,
      confirmedMembers: 6,
      distanceOrDuration: '2 Hr',
      sport: 'Football',
      coords: { "lat": 13.0450, "lng": 80.2489 }
    },
    {
      id: 5,
      profileImg: 'assets/avatars/avatar2.jfif',
      name: 'Elizabeth Taylor',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Badminton',
      coords: { "lat": 13.0600, "lng": 80.2950 }
    },
    {
      id: 6,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Judy',
      location: 'Bolingbrook',
      eventDateTime: 1761408000000,
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 Km',
      sport: 'Swimming',
      coords: { "lat": 13.1005, "lng": 80.3055 }
    },
    {
      id: 7,
      profileImg: 'assets/avatars/avatar3.jfif',
      name: 'Christian Bale',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      requiredMembers: 8,
      confirmedMembers: 8,
      distanceOrDuration: '5 Km',
      sport: 'Cycling',
      coords: { "lat": 13.1420, "lng": 80.2005 }
    },
    {
      id: 8,
      profileImg: 'assets/avatars/avatar4.jpg',
      name: 'Arjun',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Swimming',
      coords: { "lat": 13.0255, "lng": 80.3205 }
    },
    {
      id: 9,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Nisha',
      location: 'Bolingbrook',
      eventDateTime: 1761408000000,
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 km',
      sport: 'Running',
      coords: { "lat": 13.1550, "lng": 80.2455 }
    }
  ];

  getMates(): Observable<MateListItem[]> {
    // return this.api.get<MateListItem[]>('mates');
    return of(this.sampleMateData);
  }

  getMateById(id: string): Observable<MateDetail> {
    // return this.api.get<MateDetail>(`mates/${id}`);
    const selectedMate = (this.sampleMateData.find(x => x.id === Number(id)) as MateDetail);
    selectedMate.description = `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`;
    selectedMate.members = [1, 2, 3, 4, 5];
    return of(selectedMate);
  }
}
