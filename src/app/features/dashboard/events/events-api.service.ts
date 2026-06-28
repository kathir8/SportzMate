import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserStore } from 'src/app/core/stores/user-store';
import { EventsApi, myEventsApiResp } from '../requests/models/requests.model';

@Injectable({
  providedIn: 'root',
})
export class EventsApiService {

  private readonly api = inject(ApiService);
  private readonly userStore = inject(UserStore);
  private readonly commonService = inject(CommonService);
  private readonly current = this.userStore.getCurrent();

  getMyEvents(page = 0, size = 0): Observable<myEventsApiResp> {
    const obj: EventsApi = {
      userId: this.current()!.userID,
      page,
      size
    }

    return this.api.post<EventsApi, myEventsApiResp>(`event/myEvents`, obj).pipe(
      map((response: myEventsApiResp) => ({
        ...response,
        events: this.commonService.updateEventProfileImage(response.events, 'invitedUser'),
      }))
    );;

  }
}
