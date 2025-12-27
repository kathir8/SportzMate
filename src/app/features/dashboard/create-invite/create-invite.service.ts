import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateInviteApiService } from './create-invite-api.service';


export interface InviteForm {
  eventName: string;
  location: string;
  players: number;
  datetime: number;
  eventDesc: string;
  latitude:number;
  longitude:number;
  sportIdFk:number;
  totalVacancy:number;
  userID:number;
  eventDateTime:number;
};

export interface InviteFormApiResp extends InviteForm {
  resFlag: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class CreateInviteService {
  private readonly createInviteApiService = inject(CreateInviteApiService);

  createEvent(form: InviteForm): Observable<InviteFormApiResp> {
    return this.createInviteApiService.createEvent(form);
  }
}
