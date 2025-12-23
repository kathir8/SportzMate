import { Component, inject, signal } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonFooter, IonIcon, IonImg, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram } from 'ionicons/icons';
import { Credential } from 'src/app/core/model/login.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { SignalService } from 'src/app/core/services/signal.service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { UserService } from '../../other-details/services/user-service';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, RouterLink, IonicButtonComponent, IonImg, IonicInputComponent]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly toast = inject(IonicToastService);
  private readonly signalService = inject(SignalService);

  readonly icons = { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram };

  readonly credentials = signal<Partial<Credential>>({});


  getVal(path: string, fallback: any = '') {
    return this.signalService.getDeepValue(this.credentials, path, fallback);
  }

  setVal(path: string, event: any) {
    this.signalService.updateDeepValue(this.credentials, path, event);
  }

  async loginViaGoogle() {
    try {
      // this.loading.set(true);
      const user: User = await this.auth.loginViaGoogle();
      this.fetchUser(user);

    } catch (err) {
      const msg = err === 'NoUser' ? 'No user data received from Google login' : 'Google login error';
      this.toast.show(msg);
    } finally {
      // this.loading.set(false);
    }
  }

  async next() {
    console.log(this.credentials());
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

  private fetchUser(user: User) {
    if (!user.emailVerified) {
      this.toast.show("Please verify your email before logging in.");
      return;
    }

    if (user.uid) {
      this.userService.fetchUserDetail(user.uid);
    } else {
      this.toast.show("User not found");
    }
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
