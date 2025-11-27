import { inject, Injectable } from '@angular/core';
import { UserApiService } from '../../../core/services/user-api-service';
import { Router } from '@angular/router';
import { UserExist } from '../../../core/model/user.model';
import { UserStore } from 'src/app/core/stores/user-store';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApi = inject(UserApiService);
  private userStore = inject(UserStore);
  private router = inject(Router);

  fetchUserDetail(id: string) {
    this.userApi.getUserDetail(id).subscribe((response: UserExist) => {
      if (response.exist) {
        this.userStore.setCurrent(response);
        const routePath: string = this.userStore.isOnboarded() ? '/dashboard/home' : '/other-details';
        this.router.navigateByUrl(routePath, { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }

  isuserExist(email: string): Observable<boolean> {
    return of(false);
    return this.userApi.checkUserExist(email);
  }
}
