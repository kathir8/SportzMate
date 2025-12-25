import { inject, Injectable } from '@angular/core';
import { UserApiService } from '../../../core/services/user-api-service';
import { Router } from '@angular/router';
import { UserExist, UserExistApiResp, UserRegisterApi, UserRegisterApiResp } from '../../../core/model/user.model';
import { UserStore } from 'src/app/core/stores/user-store';
import { Observable, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/core/services/auth.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userApi = inject(UserApiService);
  private readonly userStore = inject(UserStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);


  initializeUser() {
    const cached = this.userStore.loadFromCache();
    this.initializeGoogle();

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


  isuserExist(emailId: string): Observable<UserExistApiResp> {
    return this.userApi.checkUserExist({ emailId });
  }

  registerUser(user: User): Observable<UserRegisterApiResp> {
    const request = {} as UserRegisterApi;
    request.name = user.displayName || '';
    request.email = user.email!
    request.fcmID = user.uid!
    request.profileImage = user.photoURL || '';
    return this.userApi.userRegistration(request);
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
    this.initializeGoogle();
    this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
    SplashScreen.hide();
  }

  private initializeGoogle() {
    this.auth.initializeSocialLogin();
  }
}
