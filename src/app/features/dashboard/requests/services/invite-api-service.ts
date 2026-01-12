import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserStore } from 'src/app/core/stores/user-store';
import { AcceptReject, EventsApi, Invite, JoinRequestsApiResp, myRequestsApiResp, ProcessRequestApi, ProcessRequestApiResp, Requests } from '../models/requests.model';

@Injectable({
  providedIn: 'root'
})
export class InviteApiService {
  private readonly api = inject(ApiService);
  private readonly userStore = inject(UserStore);
  private readonly commonService = inject(CommonService);
  private readonly current = this.userStore.getCurrent();

  getMyRequests(page = 0, size = 5): Observable<myRequestsApiResp> {
    const obj: EventsApi = {
      userId: this.current()!.userID,
      page,
      size,
    }
    return this.api.post<EventsApi, myRequestsApiResp>(`eventApproval/myRequestedEvents`, obj)
      .pipe(
        map((response: myRequestsApiResp) =>
        ({
          ...response,
          requestedEvents: this.commonService.updateEventProfileImage(
            response.requestedEvents,
            true
          ),
        }))
      );
  }

  getJoinRequests(page = 0, size = 5): Observable<JoinRequestsApiResp> {
    const obj = {
      eventCreatorUserId: 6, //this.current()!.userID,
      page,
      size,
    }
    return this.api.post<any, JoinRequestsApiResp>(`eventApproval/myEventsRequestsReceived`, obj)
      .pipe(
        map((response: JoinRequestsApiResp) => ({
          ...response,
          receivedRequests: this.commonService.updateEventProfileImage(
            response.receivedRequests,
            false
          ),
        }))
      );
  }

  ProcessJoinRequests(detail:Requests, isAccepted:boolean):Observable<ProcessRequestApiResp>{
    const obj: ProcessRequestApi = {
      approvalId: detail.approvalId,
      eventCreatorId: detail.eventIdPk,
      action: isAccepted ? AcceptReject.Accept : AcceptReject.Reject
    }
    return this.api.post<any, ProcessRequestApiResp>(`eventApproval/processRequest`, obj)
  }


  // getGroupDetailById(id: number): Observable<GroupDetail> {


  //   // return this.api.get<MateDetail>(`mates/${id}`);
  //   const groupData:GroupDetail = {
  //     id: id,
  //     profileImg: 'assets/avatars/avatar1.jfif',
  //     name: 'Meera Jasmine',
  //     location: 'Chicago',
  //     eventDateTime: 1761408000000,
  //     totalVacancy: 8,
  //     currentVacancy : 8,
  //     distanceOrDuration: '600 M',
  //     sport: SportType.Cycling,
  //     coords: { "lat": 13.0901, "lng": 80.2650 },
  //     description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //     members: [1, 2, 3, 4, 5],
  //     requestedMembers: [
  //       {
  //         id: 1,
  //         profileImg: 'assets/avatars/avatar2.jfif',
  //         eventName: 'Kathir Office',
  //         location: 'Newyork',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy : 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 2,
  //         profileImg: 'assets/avatars/avatar3.jfif',
  //         eventName: 'Emma',
  //         location: 'Chicago',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy : 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 1,
  //         profileImg: 'assets/avatars/avatar2.jfif',
  //         eventName: 'Kathir Office',
  //         location: 'Newyork',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy : 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 2,
  //         profileImg: 'assets/avatars/avatar3.jfif',
  //         eventName: 'Emma',
  //         location: 'Chicago',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy : 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 1,
  //         profileImg: 'assets/avatars/avatar2.jfif',
  //         eventName: 'Kathir Office',
  //         location: 'Newyork',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy : 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 2,
  //         profileImg: 'assets/avatars/avatar3.jfif',
  //         eventName: 'Emma',
  //         location: 'Chicago',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy : 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 1,
  //         profileImg: 'assets/avatars/avatar2.jfif',
  //         eventName: 'Kathir Office',
  //         location: 'Newyork',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy : 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 2,
  //         profileImg: 'assets/avatars/avatar3.jfif',
  //         eventName: 'Emma',
  //         location: 'Chicago',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy : 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 1,
  //         profileImg: 'assets/avatars/avatar2.jfif',
  //         eventName: 'Kathir Office',
  //         location: 'Newyork',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy: 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //       {
  //         id: 2,
  //         profileImg: 'assets/avatars/avatar3.jfif',
  //         eventName: 'Emma',
  //         location: 'Chicago',
  //         eventDateTime: 1761408000000,
  //         totalVacancy: 8,
  //         currentVacancy: 8,
  //         distanceOrDuration: '600 M',
  //         sport: SportType.Cycling,
  //         coords: { "lat": 13.0901, "lng": 80.2650 },
  //         description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
  //       },
  //     ]
  //   };
  //   return of(groupData);

  // }

  fetchNearby(lat: number, lng: number) { return this.api.get<Invite[]>(`/api/requests/near?lat=${lat}&lng=${lng}`); }
  fetchById(id: string) { return this.api.get<Invite>(`/api/requests/${id}`); }
  // createInvite(payload: Partial<Invite>) { return this.api.post<Invite>('/api/invites', payload); }
  joinInvite(id: string, uid: string) { return this.api.post(`/api/requests/${id}/join`, { uid }); }
  leaveInvite(id: string, uid: string) { return this.api.post(`/api/requests/${id}/leave`, { uid }); }

}
