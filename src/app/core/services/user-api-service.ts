import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UserDetail, UserExist, UserRegisterApi, UserRegisterApiResp } from '../model/user.model';
import { ApiResp } from 'src/app/shared/models/shared.model';

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

  updateUser(payload: UserDetail): Observable<UserDetail> {
    return this.api.post<UserDetail, UserDetail>('updateuser', payload);
  }

  uploadImage(file: File, imagetype: string): Observable<UserRegisterApiResp> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<FormData, UserRegisterApiResp>('uploadimage', formData, { imagetype });
  }

  searchUsers(q: string) {
    return this.api.get<UserDetail[]>(`users/search?q=${encodeURIComponent(q)}`);
  }

  getUserDetail(id: string): Observable<UserExist> {
    return this.api.get<UserExist>(`users/${id}`);
  }

  deleteUser(emailId: string): Observable<ApiResp> {
    return this.api.post<{ emailId: string }, ApiResp>(`deleteuser`, { emailId });
  }

}
