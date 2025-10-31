import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { MyInvites } from '../models/invite.model';
import { SportType } from 'src/app/shared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class InvitesApiService {
  private api = inject(ApiService);

  private myInvitesData: MyInvites[] = [
    {
      id: 1,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Emma',
      location: 'Newyork',
      eventDateTime: 1761408000000,
      requiredMembers: 8,
      confirmedMembers: 8,
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
      confirmedMembers: 2,
      sport: SportType.Cycling,
      chatCount: 10
    }
  ]

  getMyInvites(): Observable<MyInvites[]> {
    // return this.api.get<MyInvites[]>(`myInvites`);
    return of(this.myInvitesData);
  }

}
