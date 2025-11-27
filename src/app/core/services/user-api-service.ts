import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UserDetail, UserExist } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private api = inject(ApiService);

  fetchUserDetail(id: string): Observable<UserExist> {
    return this.api.get<UserExist>(`users/${id}`);
  }

  createUser(payload: Partial<UserDetail>) {
    return this.api.post<UserDetail>('/api/users', payload);
  }

  searchUsers(q: string) {
    return this.api.get<UserDetail[]>(`/api/users/search?q=${encodeURIComponent(q)}`);
  }

  checkUserExist(email: string): Observable<boolean> {
    return this.api.get<boolean>(`checkUserExist/${email}`);
  }

}
