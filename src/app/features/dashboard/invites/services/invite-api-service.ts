import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SportType } from 'src/app/shared/models/shared.model';
import { GroupDetail, GroupInvites, Invite, myEventsApi, myEventsApiResp, MyInvites } from '../models/invite.model';
import { UserStore } from 'src/app/core/stores/user-store';

@Injectable({
  providedIn: 'root'
})
export class InviteApiService {
  private readonly api = inject(ApiService);
  private readonly userStore = inject(UserStore);
  private readonly current = this.userStore.getCurrent();

  getMyInvites(page = 0, size = 0): Observable<myEventsApiResp> {
    const obj : myEventsApi = {  
  userId:this.current()!.userID,
  page,
  size
    }
    return this.api.post<myEventsApi, myEventsApiResp>(`event/myEvents`, obj);

    const myInvitesData: MyInvites[] = [
      {
        id: 1,
        profileImg: 'assets/avatars/avatar1.jfif',
        name: 'Kathir Office',
        location: 'Newyork',
        eventDateTime: 1761408000000,
        requiredMembers: 8,
        participants: [1, 2, 3, 4, 5, 6, 7, 8],
        sport: SportType.Badminton,
        chatCount: 2
      },
      {
        id: 2,
        profileImg: 'assets/avatars/avatar1.jfif',
        name: 'Emma',
        location: 'Chicago',
        eventDateTime: 1761408000000,
        requiredMembers: 8,
        participants: [1, 2],
        sport: SportType.Cycling,
        chatCount: 10
      }
    ];
    // return of(myInvitesData);
  }

  getGroupInvites(): Observable<GroupInvites[]> {
    // return this.api.get<MyInvites[]>(`approveInvites`);

    const myGroupData: GroupInvites[] = [
      {
        id: 1,
        profileImg: 'assets/avatars/avatar1.jfif',
        name: 'Kathir Office',
        location: 'Newyork',
        eventDateTime: 1761408000000,
        requiredMembers: 8,
        participants: [],
        sport: SportType.Badminton,
        chatCount: 2
      },
      {
        id: 2,
        profileImg: 'assets/avatars/avatar1.jfif',
        name: 'Emma',
        location: 'Chicago',
        eventDateTime: 1761408000000,
        requiredMembers: 8,
        participants: [1, 2],
        sport: SportType.Cycling,
        chatCount: 10
      }
    ];
    return of(myGroupData);
  }


  getGroupDetailById(id: number): Observable<GroupDetail> {


    // return this.api.get<MateDetail>(`mates/${id}`);
    const groupData = {
      id: id,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Meera Jasmine',
      location: 'Chicago',
      eventDateTime: 1761408000000,
      requiredMembers: 8,
      participants: [1, 2, 3, 4, 5, 6, 7, 8],
      distanceOrDuration: '600 M',
      sport: SportType.Cycling,
      coords: { "lat": 13.0901, "lng": 80.2650 },
      description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
      members: [1, 2, 3, 4, 5],
      requestedMembers: [
        {
          id: 1,
          profileImg: 'assets/avatars/avatar2.jfif',
          name: 'Kathir Office',
          location: 'Newyork',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 2,
          profileImg: 'assets/avatars/avatar3.jfif',
          name: 'Emma',
          location: 'Chicago',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 1,
          profileImg: 'assets/avatars/avatar2.jfif',
          name: 'Kathir Office',
          location: 'Newyork',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 2,
          profileImg: 'assets/avatars/avatar3.jfif',
          name: 'Emma',
          location: 'Chicago',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 1,
          profileImg: 'assets/avatars/avatar2.jfif',
          name: 'Kathir Office',
          location: 'Newyork',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 2,
          profileImg: 'assets/avatars/avatar3.jfif',
          name: 'Emma',
          location: 'Chicago',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 1,
          profileImg: 'assets/avatars/avatar2.jfif',
          name: 'Kathir Office',
          location: 'Newyork',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 2,
          profileImg: 'assets/avatars/avatar3.jfif',
          name: 'Emma',
          location: 'Chicago',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 1,
          profileImg: 'assets/avatars/avatar2.jfif',
          name: 'Kathir Office',
          location: 'Newyork',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
        {
          id: 2,
          profileImg: 'assets/avatars/avatar3.jfif',
          name: 'Emma',
          location: 'Chicago',
          eventDateTime: 1761408000000,
          requiredMembers: 8,
          participants: [1, 2, 3, 4, 5, 6, 7, 8],
          distanceOrDuration: '600 M',
          sport: SportType.Cycling,
          coords: { "lat": 13.0901, "lng": 80.2650 },
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
          members: [1, 2, 3, 4, 5],
        },
      ]
    };
    return of(groupData);

  }

  fetchNearby(lat: number, lng: number) { return this.api.get<Invite[]>(`/api/invites/near?lat=${lat}&lng=${lng}`); }
  fetchById(id: string) { return this.api.get<Invite>(`/api/invites/${id}`); }
  // createInvite(payload: Partial<Invite>) { return this.api.post<Invite>('/api/invites', payload); }
  joinInvite(id: string, uid: string) { return this.api.post(`/api/invites/${id}/join`, { uid }); }
  leaveInvite(id: string, uid: string) { return this.api.post(`/api/invites/${id}/leave`, { uid }); }

}
