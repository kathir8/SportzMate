import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UserDetail, UserExist } from '../model/user.model';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly api = inject(ApiService);

  checkUserExist(email: string): Observable<boolean> {
    return this.api.get<boolean>(`/api/checkuserexistmailid/${email}`);
  }

  createUser(user: User): Observable<UserExist> {
    return this.api.post<UserExist>('/api/createUser', user);
  }

  updateUser(payload: Partial<UserDetail>) {
    return this.api.post<UserDetail>('/api/users', payload);
  }

  searchUsers(q: string) {
    return this.api.get<UserDetail[]>(`/api/users/search?q=${encodeURIComponent(q)}`);
  }

   getUserDetail(id: string): Observable<UserExist> {
    return this.api.get<UserExist>(`/api/users/${id}`);
  }

}
