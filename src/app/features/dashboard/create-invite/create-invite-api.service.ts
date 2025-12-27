import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { InviteForm, InviteFormApiResp } from './create-invite.service';

@Injectable({
  providedIn: 'root',
})
export class CreateInviteApiService {
  private readonly api = inject(ApiService);

  createEvent(request: InviteForm): Observable<InviteFormApiResp> {
    return this.api.post<InviteForm, InviteFormApiResp>(`event/create`, request);
  }
}
