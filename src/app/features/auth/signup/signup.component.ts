import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { SignalPathDirective } from 'src/app/core/directives/signal-path.directive';
import { Signup } from 'src/app/core/model/login.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { GlobalLoadingService } from 'src/app/core/services/global-loading-service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicCheckboxComponent } from 'src/app/shared/components/ionic-checkbox/ionic-checkbox.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [IonContent, FormsModule, IonicButtonComponent, IonicCheckboxComponent, IonImg, IonicInputComponent, SignalPathDirective]
})
export class SignupComponent {
  private readonly toast = inject(IonicToastService);
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly loader = inject(GlobalLoadingService);


  readonly accepted = signal(false);
  readonly cPassword = signal<string>('');
  readonly signup = signal<Signup>({} as Signup)

  async ngOnInit() {
    try {
      const userDetail = await this.auth.userClickEmailVerify();

      if (userDetail === null) {
        this.toast.show("Session expired. Please sign up again.");
        return;
      }
      this.userService.saveUser(userDetail!);
    } catch (error) {
      this.toast.show("Verification failed. Please try again.");
    }
  }


  async sendVerification() {

    if (!this.signUpValidation()) {
      return
    }
    this.loader.start();
    try {
      const verificationMailSent = await this.auth.sendVerification(this.signup().email, this.signup().password, this.signup().name);
      if (verificationMailSent) {
        this.toast.show("Verification link sent! Check your email.");
      }
    } catch (err) {
      this.toast.show("Failed to send verification email.");
    } finally {
      this.loader.stop();
    }

  }


  private signUpValidation(): boolean {
    if (!this.signup().name) {
      this.toast.show("Enter your name.");
      return false;
    }

    const emailError = this.auth.validateEmail(this.signup().email);
    if (emailError) {
      this.toast.show(emailError);
      return false;
    }

    const passwordError = this.auth.validatePassword(this.signup().password);
    if (passwordError) {
      this.toast.show(passwordError);
      return false;
    }

    if (this.signup().password !== this.cPassword()) {
      this.toast.show("Passwords do not match.");
      return false;
    }

    if (!this.accepted()) {
      this.toast.show("Accept the terms and conditions.");
      return false;
    }
    return true;
  }

}
