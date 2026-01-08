import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserStore } from 'src/app/core/stores/user-store';
import { ApiResp } from 'src/app/shared/models/shared.model';
import { UserDetail, UserExist, UserRegisterApi, UserRegisterApiResp } from '../model/user.model';
import { GlobalLoadingService } from './global-loading-service';
import { UserApiService } from './user-api-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userApi = inject(UserApiService);
  private readonly userStore = inject(UserStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loader = inject(GlobalLoadingService);


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
        this.loader.stop();
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
    this.loader.stop();

  }

  registerUser(user: User, fromGoogle: boolean = false): void {
    const request = new UserRegisterApi();
    request.name = user.displayName || '';
    request.email = user.email!
    request.fcmID = user.uid!
    request.profileImage = user.photoURL || '';
    request.userLoginFlag = fromGoogle;
    request.interestedSportsIds = '';
    this.userApi.userRegistration(request).subscribe((res: UserRegisterApiResp) => {
      if (res.resFlag) {
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("signupPassword");
        localStorage.removeItem("signupName");
        this.updateUserDetails(res.userDetailsDto);
      }
    });
  }

  updateUser(user: UserDetail) {
    this.userApi.updateUser(user).subscribe((res: UserDetail) => {
      this.updateUserDetails(res);
    });
  }

  uploadProfileImage(profileImg: File) {
    return this.userApi.uploadImage(profileImg, 'profile-images')
  }

  deleteUser(email: string) {
    this.userApi.deleteUser(email).subscribe((res: ApiResp) => {
      if (res.rspMsg) {
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

  redirectToLogin() {
    this.initializeGoogle();
    this.logOut();
  }

  logOut() {
    this.auth.logout();
     this.userStore.clear();
    this.router.navigateByUrl('/login', { replaceUrl: true });
    SplashScreen.hide();
  }

  private initializeGoogle() {
    this.auth.initializeSocialLogin();
  }
}
