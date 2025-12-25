import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UserDeleteApiResp, UserDetail, UserExist, UserRegisterApi, UserRegisterApiResp } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly api = inject(ApiService);

  userRegistration(request: UserRegisterApi): Observable<UserRegisterApiResp> {
    return this.api.post<UserRegisterApi, UserRegisterApiResp>(`userregistration`, request);
  }

  createUser(user: User): Observable<UserExist> {
    return this.api.post<User, UserExist>('createUser', user);
  }

  updateUser(payload: Partial<UserDetail>): Observable<UserExist> {
    return this.api.post<UserDetail, UserExist>('users', payload);
  }

  searchUsers(q: string) {
    return this.api.get<UserDetail[]>(`users/search?q=${encodeURIComponent(q)}`);
  }

  getUserDetail(id: string): Observable<UserExist> {
    return this.api.get<UserExist>(`users/${id}`);
  }

  deleteUser(emailId: string): Observable<UserDeleteApiResp> {
    return this.api.post<User, UserDeleteApiResp>(`deleteuser`, { emailId });
  }

}
