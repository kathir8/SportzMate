import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UserDetail, UserExist, UserExistApi, UserExistApiResp, UserRegisterApi, UserRegisterApiResp } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly api = inject(ApiService);

  checkUserExist(request: UserExistApi): Observable<UserExistApiResp> {
    return this.api.post<UserExistApi, UserExistApiResp>(`checkuserexistmailid`, request);
  }

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

}
