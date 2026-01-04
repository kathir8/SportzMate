import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { myEventsApi, myEventsApiResp } from '../requests/models/requests.model';
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
    const obj: myEventsApi = {
      userId: 6, // this.current()!.userID,
      page,
      size
    }

    return this.api.post<myEventsApi, myEventsApiResp>(`event/myEvents`, obj);

  }
}
