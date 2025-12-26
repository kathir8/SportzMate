import { Component, inject, signal } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonFooter, IonIcon, IonImg, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram } from 'ionicons/icons';
import { SignalPathDirective } from 'src/app/core/directives/signal-path.directive';
import { Credential } from 'src/app/core/model/login.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { UserService } from '../../../core/services/user-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, RouterLink, IonicButtonComponent, IonImg, IonicInputComponent, SignalPathDirective]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly toast = inject(IonicToastService);

  readonly icons = { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram };

  readonly name = signal<string>('');
  readonly credentials = signal<Credential>({} as Credential);

  async loginViaGoogle() {
    try {
      // this.loading.set(true);
      const user: User = await this.auth.loginViaGoogle();
      this.userExist(user);

    } catch (err) {
      const msg = err === 'NoUser' ? 'No user data received from Google login' : 'Google login error';
      this.toast.show(msg);
    } finally {
      // this.loading.set(false);
    }
  }

 
  async next() {
    if (!this.loginValidation()) {
      return;
    }
    try {

      const user: User = await this.auth.login(this.credentials().email!, this.credentials().password!);
      this.fetchUser(user);

    } catch (error: any) {
      const msg = error.code === 'auth/invalid-credential' ? 'Incorrect mail / password' : 'Login failed';
      this.toast.show(msg);
    }
  }

  private fetchUser(user: User): void {
    if (!this.emailVerifyCheck(user.emailVerified)) {
      return;
    }

    if (user.uid) {
      this.userService.fetchUserDetail(user.uid);
    } else {
      this.toast.show("User not found");
    }
  }

  private userExist(user: User): void {
    if (!this.emailVerifyCheck(user.emailVerified)) {
      return;
    }
    if (user.uid && user.email) {
      this.userService.registerUser(user, true);
    } else {
      this.toast.show("email id not exist.");
    }
  }

  private emailVerifyCheck(isVerfied: boolean) {
    if (!isVerfied) {
      this.toast.show("Please verify your email before logging in.");
    }
    return isVerfied;
  }

  private loginValidation(): boolean {
    const emailError = this.auth.validateEmail(this.credentials().email);
    if (emailError) {
      this.toast.show(emailError);
      return false;
    }

    const passwordError = this.auth.validatePassword(this.credentials().password);
    if (passwordError) {
      this.toast.show(passwordError);
      return false;
    }
    return true;
  }
}
