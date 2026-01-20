import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateInviteApiService } from './create-invite-api.service';
import { ApiResp } from 'src/app/shared/models/shared.model';
import { UserStore } from 'src/app/core/stores/user-store';


export interface InviteForm {
  eventName: string;
  location: string;
  eventDesc: string;
  latitude:number | null;
  longitude:number | null;
  totalVacancy:number;
  userID:number;
  eventDateTime:number;
};

export interface InviteFormApiResp extends ApiResp {
}
@Injectable({
  providedIn: 'root',
})
export class CreateInviteService {
  private readonly createInviteApiService = inject(CreateInviteApiService);
  private readonly userStore = inject(UserStore);
  private readonly currentUser = this.userStore.getCurrent();

  createEvent(form: InviteForm): Observable<InviteFormApiResp> {
    form.userID = this.currentUser()!.userID;
    return this.createInviteApiService.createEvent(form);
  }
}
