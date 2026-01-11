import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { deleteApi, deleteApiResp } from './cancel-event.component';

@Injectable({
  providedIn: 'root',
})
export class CancelEventApiService {
  private readonly api = inject(ApiService);

  cancelEvent(form: deleteApi): Observable<deleteApiResp> {
      return this.api.delete<deleteApi,deleteApiResp>(`event/delete`,form);
    }
}
