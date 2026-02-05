import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SportType } from 'src/app/shared/models/shared.model';
import { EventDetailApiResp, eventListApi, eventListApiResp, requestJoinApi, requestJoinApiResp } from '../mate-stuff/models/mate.model';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {
  private api = inject(ApiService);

  private sampleMateData: any[] = [
    {
      eventId: 1,
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      profileImage: 'assets/avatars/avatar1.jfif',
      eventName: 'Meera Jasmine',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      totalVacancy: 8,
      currentVacancy: 6,
      sport: SportType.Cycling,
      coords: { "lat": 13.0901, "lng": 80.2650 }
    },
    {
      eventId: 2,
      profileImage: 'assets/avatars/avatar2.jfif',
      eventName: 'Amelia',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      totalVacancy: 3,
      currentVacancy: 2,
      participants: [1, 2, 3, 4],
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      sport: SportType.Badminton,
      coords: { "lat": 13.0752, "lng": 80.2905 }
    },
    {
      eventId: 3,
      profileImage: 'assets/avatars/avatar3.jfif',
      eventName: 'Karthikeyan Rajasekar buhari',
      location: 'Anna Nagar West Extension',
      eventDateTime: 1761408000000,
      totalVacancy: 4,
      currentVacancy: 4,
      participants: [1, 2, 3, 4],
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      sport: SportType.Running,
      coords: { "lat": 13.0705, "lng": 80.2555 }
    },
    {
      eventId: 4,
      profileImage: 'assets/avatars/avatar4.jpg',
      eventName: 'Karthik',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      totalVacancy: 8,
      currentVacancy: 4,
      participants: [1, 2, 3, 4, 5, 6],
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      sport: SportType.Football,
      coords: { "lat": 13.0450, "lng": 80.2489 }
    },
    {
      eventId: 5,
      profileImage: 'assets/avatars/avatar2.jfif',
      eventName: 'Elizabeth Taylor',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      totalVacancy: 3,
      currentVacancy: 2,
      participants: [1, 2, 3, 4],
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      sport: SportType.Badminton,
      coords: { "lat": 13.0600, "lng": 80.2950 }
    },
    {
      eventId: 6,
      profileImage: 'assets/avatars/avatar1.jfif',
      eventName: 'Judy',
      location: 'Bolingbrook',
      eventDateTime: 1761408000000,
      totalVacancy: 4,
      currentVacancy: 4,
      participants: [1, 2, 3, 4],
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      sport: SportType.Swimming,
      coords: { "lat": 13.1005, "lng": 80.3055 }
    },
    {
      eventId: 7,
      profileImage: 'assets/avatars/avatar3.jfif',
      eventName: 'Christian Bale',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      totalVacancy: 8,
      currentVacancy: 4,
      participants: [1, 2, 3, 4, 5, 6, 7, 8],
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      sport: SportType.Cycling,
      coords: { "lat": 13.1420, "lng": 80.2005 }
    },
    {
      eventId: 8,
      profileImage: 'assets/avatars/avatar4.jpg',
      eventName: 'Arjun',
      location: 'Naperville',
      eventDateTime: 1761408000000,
      totalVacancy: 3,
      currentVacancy: 2,
      participants: [1, 2, 3, 4],
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      sport: SportType.Swimming,
      coords: { "lat": 13.0255, "lng": 80.3205 }
    },
    {
      eventId: 9,
      profileImage: 'assets/avatars/avatar1.jfif',
      eventName: 'Nisha',
      location: 'Bolingbrook',
      eventDateTime: 1761408000000,
      totalVacancy: 4,
      currentVacancy: 4,
      participants: [1, 2, 3, 4],
      eventDescription: '',
      eventStatus: 'Ready',
      sportType: 3,
      sport: SportType.Running,
      coords: { "lat": 13.1550, "lng": 80.2455 }
    }
  ];

  getMates(eventList: eventListApi): Observable<eventListApiResp> {
    // return this.api.post<eventListApi, eventListApiResp>('event/eventList', eventList);
    const resp = {} as eventListApiResp;
    resp.events = this.sampleMateData;
    return of(resp);
  }


  getEventDetails(eventId: number): Observable<EventDetailApiResp> {
    return this.api.post<{ eventId: number }, EventDetailApiResp>(`eventApproval/getEventDetails`, { eventId })
      .pipe(
        map(response => {
          if (!response.rspFlg || !response.joinRequests || !response.joinRequests.length) {
            return response;
          }

          return {
            ...response,
            joinRequests: response.joinRequests.map((jr, index) => ({
              ...jr,
              id: index + 1
            }))
          };
        })
      );;
  }

  requestJoin(reqObj: requestJoinApi): Observable<requestJoinApiResp> {
    return this.api.post<requestJoinApi, requestJoinApiResp>('eventApproval/requestJoin', reqObj);
  }
}
