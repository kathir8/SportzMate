import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventsApi, myEventsApiResp } from '../requests/models/requests.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UserStore } from 'src/app/core/stores/user-store';

@Injectable({
  providedIn: 'root',
})
export class EventsApiService {

  private readonly api = inject(ApiService);
  private readonly userStore = inject(UserStore);
  private readonly current = this.userStore.getCurrent();

  getMyEvents(page = 0, size = 0): Observable<myEventsApiResp> {
    const obj: EventsApi = {
      userId: this.current()!.userID,
      page,
      size
    }

    return this.api.post<EventsApi, myEventsApiResp>(`event/myEvents`, obj);

  }
}
