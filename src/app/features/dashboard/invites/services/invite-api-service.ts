import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Invite, MyInvites } from '../models/invite.model';
import { SportType } from 'src/app/shared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class InviteApiService {
  private api = inject(ApiService);

  private myInvitesData: MyInvites[] = [
    {
      id: 1,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Emma',
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
  ]

  getMyInvites(): Observable<MyInvites[]> {
    return this.api.get<MyInvites[]>(`myInvites`);
    // return of(this.myInvitesData);
  }

  fetchNearby(lat: number, lng: number) { return this.api.get<Invite[]>(`/api/invites/near?lat=${lat}&lng=${lng}`); }
  fetchById(id: string) { return this.api.get<Invite>(`/api/invites/${id}`); }
  createInvite(payload: Partial<Invite>) { return this.api.post<Invite>('/api/invites', payload); }
  joinInvite(id: string, uid: string) { return this.api.post(`/api/invites/${id}/join`, { uid }); }
  leaveInvite(id: string, uid: string) { return this.api.post(`/api/invites/${id}/leave`, { uid }); }

}
