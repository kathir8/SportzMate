import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonFooter, IonIcon, IonImg, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth.service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { UserService } from '../../other-details/services/user-service';
import { User } from '@angular/fire/auth';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, RouterLink, IonicInputComponent, IonicButtonComponent, IonImg]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private userService = inject(UserService);
  private toast = inject(IonicToastService);

  icons = { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram };


  email: string = '';
  password: string = '';


  ionViewDidEnter() {
    this.auth.initialize();
  }

  async loginViaGoogle() {
    try {
      // this.loading.set(true);
      const user: User = await this.auth.loginViaGoogle();
      this.fetchUser(user);

    } catch (err) {
      this.toast.show("Google login error");
    } finally {
      // this.loading.set(false);
    }
  }

  async next() {

    if (!this.loginValidation()) {
      return;
    }

    try {

      const user: User = await this.auth.login(this.email, this.password);
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
    const emailError = this.auth.validateEmail(this.email);
    if (emailError) {
      this.toast.show(emailError);
      return false;
    }

    const passwordError = this.auth.validatePassword(this.password);
    if (passwordError) {
      this.toast.show(passwordError);
      return false;
    }
    return true;
  }
}
