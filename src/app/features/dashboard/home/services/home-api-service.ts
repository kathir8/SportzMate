import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { eventListApi, eventListApiResp, MateDetail, MateListItem, requestJoinApi, requestJoinApiResp } from '../mate-stuff/models/mate.model';
import { SportType } from 'src/app/shared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {
  private api = inject(ApiService);

  private sampleMateData: MateListItem[] = [
    {
      eventIdPk: 1,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Meera Jasmine',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      totalVacancy: 8,
      currentVacancy:6,
      participants: [1, 2, 3, 4, 5, 6, 7, 8],
      distanceOrDuration: '600 M',
      sport: SportType.Cycling,
      coords: { "lat": 13.0901, "lng": 80.2650 }
    },
    {
      eventIdPk: 2,
      profileImg: 'assets/avatars/avatar2.jfif',
      name: 'Amelia',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      totalVacancy: 3,
      currentVacancy:2,
      participants: [1, 2, 3, 4],
      distanceOrDuration: '2 Hr',
      sport: SportType.Badminton,
      coords: { "lat": 13.0752, "lng": 80.2905 }
    },
    {
      eventIdPk: 3,
      profileImg: 'assets/avatars/avatar3.jfif',
      name: 'Karthikeyan Rajasekar buhari',
      location: 'Anna Nagar West Extension',
      eventDateTime: 1761408000000,
      totalVacancy: 4,
      currentVacancy:4,
      participants: [1, 2, 3, 4],
      distanceOrDuration: '3 Km',
      sport: SportType.Running,
      coords: { "lat": 13.0705, "lng": 80.2555 }
    },
    {
      eventIdPk: 4,
      profileImg: 'assets/avatars/avatar4.jpg',
      name: 'Karthik',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      totalVacancy: 8,
      currentVacancy:4,
      participants: [1, 2, 3, 4, 5, 6],
      distanceOrDuration: '2 Hr',
      sport: SportType.Football,
      coords: { "lat": 13.0450, "lng": 80.2489 }
    },
    {
      eventIdPk: 5,
      profileImg: 'assets/avatars/avatar2.jfif',
      name: 'Elizabeth Taylor',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      totalVacancy: 3,
      currentVacancy:2,
      participants: [1, 2, 3, 4],
      distanceOrDuration: '2 Hr',
      sport: SportType.Badminton,
      coords: { "lat": 13.0600, "lng": 80.2950 }
    },
    {
      eventIdPk: 6,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Judy',
      location: 'Bolingbrook',
      eventDateTime: 1761408000000,
      totalVacancy: 4,
      currentVacancy:4,
      participants: [1, 2, 3, 4],
      distanceOrDuration: '3 Km',
      sport: SportType.Swimming,
      coords: { "lat": 13.1005, "lng": 80.3055 }
    },
    {
      eventIdPk: 7,
      profileImg: 'assets/avatars/avatar3.jfif',
      name: 'Christian Bale',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      totalVacancy: 8,
      currentVacancy:4,
      participants: [1, 2, 3, 4, 5, 6, 7, 8],
      distanceOrDuration: '5 Km',
      sport: SportType.Cycling,
      coords: { "lat": 13.1420, "lng": 80.2005 }
    },
    {
      eventIdPk: 8,
      profileImg: 'assets/avatars/avatar4.jpg',
      name: 'Arjun',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      totalVacancy: 3,
      currentVacancy:2,
      participants: [1, 2, 3, 4],
      distanceOrDuration: '2 Hr',
      sport: SportType.Swimming,
      coords: { "lat": 13.0255, "lng": 80.3205 }
    },
    {
      eventIdPk: 9,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Nisha',
      location: 'Bolingbrook',
      eventDateTime: 1761408000000,
      totalVacancy: 4,
      currentVacancy:4,
      participants: [1, 2, 3, 4],
      distanceOrDuration: '3 km',
      sport: SportType.Running,
      coords: { "lat": 13.1550, "lng": 80.2455 }
    }
  ];

  getMates(eventList:eventListApi): Observable<eventListApiResp> {
    // return this.api.post<eventListApi, eventListApiResp>('event/eventList', eventList);
    const resp = {} as eventListApiResp;
    resp.events = this.sampleMateData;
    return of(resp);
  }


  getMateById(id: number): Observable<MateDetail> {
    // return this.api.get<MateDetail>(`mates/${id}`);
    const selectedMate = (this.sampleMateData.find(x => x.eventIdPk === id) as MateDetail);
    selectedMate.description = `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`;
    selectedMate.members = [1, 2, 3, 4, 5];
    return of(selectedMate);
  }

   requestJoin(reqObj:requestJoinApi): Observable<requestJoinApiResp> {
    return this.api.post<requestJoinApi, requestJoinApiResp>('eventApproval/requestJoin', reqObj);
  }
}
