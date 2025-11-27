import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UserDetail, UserExist } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private api = inject(ApiService);

  getUserDetail(id: string): Observable<UserExist> {
    const userDetail:UserExist = {
      name : 'Kathiravan',
      email : 'ilayakathi@gmail.com',
      profile : '',
      customProfile : '',
      id : id,
      age: 25,
      gender: 'male',
      interest: [],
      exist:true
    }
    return of(userDetail);
    return this.api.get<UserExist>(`/api/users/${id}`);
  }

  createUser(payload: Partial<UserDetail>) {
    return this.api.post<UserDetail>('/api/users', payload);
  }

  searchUsers(q: string) {
    return this.api.get<UserDetail[]>(`/api/users/search?q=${encodeURIComponent(q)}`);
  }

  checkUserExist(email: string): Observable<boolean> {
    return this.api.get<boolean>(`/api/checkUserExist/${email}`);
  }

}
