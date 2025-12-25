import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserStore } from 'src/app/core/stores/user-store';
import { UserDeleteApiResp, UserDetail, UserExist, UserRegisterApi, UserRegisterApiResp } from '../../../core/model/user.model';
import { UserApiService } from '../../../core/services/user-api-service';

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
    this.auth.updateUid(cached.fcmID);
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

  registerUser(user: User, fromGoogle?: boolean): void {
    const request = new UserRegisterApi();
    request.name = user.displayName || '';
    request.email = user.email!
    request.fcmID = user.uid!
    request.profileImage = user.photoURL || '';
    request.userLoginFlag = fromGoogle ? 'Y' : 'N';
    this.userApi.userRegistration(request).subscribe((res: UserRegisterApiResp) => {
      if (res.resFlag === 'Y') {
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("signupPassword");
        localStorage.removeItem("signupName");
        this.updateUserDetails(res.userDetailsDto);
      }
    });
  }

  deleteUser(email: string) {
    this.userApi.deleteUser(email).subscribe((res: UserDeleteApiResp) => {
      if (res.rspMsg) {
        this.userStore.clear();
        this.redirectToLogin();
      }
    });
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

  private updateUserDetails(user: UserDetail) {
    this.userStore.setCurrent(user);
    this.auth.updateUid(user.fcmID);
    this.navigateAfterUserLoad();
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
