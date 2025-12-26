import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateInviteApiService } from './create-invite-api.service';


export interface InviteForm {
  name: string;
  location: string;
  players: number;
  datetime: number;
  description: string;
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
