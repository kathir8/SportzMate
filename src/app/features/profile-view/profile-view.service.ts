import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDetail } from 'src/app/core/model/user.model';
import { ApiService } from 'src/app/core/services/api.service';


@Injectable({
  providedIn: 'root',
})
export class ProfileViewService {
  private readonly api = inject(ApiService);

  fetchUserDetails(userID: number): Observable<UserDetail> {
    return this.api.post<{ userID: number }, UserDetail>(`getuserdetails`, { userID })
  }
}
