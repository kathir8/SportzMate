import { inject, Injectable } from '@angular/core';
import { UserApiService } from '../../../core/services/user-api-service';
import { Router } from '@angular/router';
import { UserExist } from '../../../core/model/user.model';
import { UserStore } from 'src/app/core/stores/user-store';
import { Observable, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/core/services/auth.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApi = inject(UserApiService);
  private userStore = inject(UserStore);
  private auth = inject(AuthService);
  private router = inject(Router);


  initializeUser() {
    const cached = this.userStore.loadFromCache();

    if (!cached) {
      this.redirectToLogin();
      return;
    }
    this.navigateAfterUserLoad();
  }


  fetchUserDetail(uid: string) {
    this.userApi.getUserDetail(uid).subscribe((user: UserExist) => {
      if (!user.exist) {
        this.redirectToLogin();

        return;
      }

      this.userStore.setCurrent(user);
      this.navigateAfterUserLoad();

    });
  }

  private navigateAfterUserLoad() {
    const routePath = this.userStore.isOnboarded()
      ? '/dashboard/home'
      : '/other-details';

    this.router.navigateByUrl(routePath, { replaceUrl: true });
    SplashScreen.hide();
  }


  isuserExist(email: string): Observable<boolean> {
    return of(false);
    return this.userApi.checkUserExist(email);
  }

  saveUser(user: User) {
    if (user) {
      this.userApi.createUser(user).subscribe((response: UserExist) => {
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("signupPassword");
        localStorage.removeItem("signupName");
        this.router.navigate(['/other-details'], { replaceUrl: true });
      });
    }
  }

  private redirectToLogin() {
    this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
    SplashScreen.hide();
  }
}
