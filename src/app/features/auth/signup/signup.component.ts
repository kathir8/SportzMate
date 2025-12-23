import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { Signup } from 'src/app/core/model/login.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { SignalService } from 'src/app/core/services/signal.service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicCheckboxComponent } from 'src/app/shared/components/ionic-checkbox/ionic-checkbox.component';
import { IonicSignalInputComponent } from "src/app/shared/components/ionic-signal-input/ionic-signal-input.component";
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { UserService } from '../../other-details/services/user-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [IonContent, FormsModule, IonicButtonComponent, IonicCheckboxComponent, IonImg, IonicSignalInputComponent]
})
export class SignupComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(IonicToastService);
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly signalService = inject(SignalService);

  readonly accepted = signal(false);
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


  getVal(path: string, fallback: any = '') {
    return this.signalService.getDeepValue(this.signup, path, fallback);
  }

  setVal(path: string, event: any) {
    this.signalService.updateDeepValue(this.signup, path, event);
  }


  async sendVerification() {

    if (!this.signUpValidation()) {
      return
    }

    const isUserExist = await firstValueFrom(this.userService.isuserExist(this.signup().email));
    if (isUserExist) {
      this.toast.show("This email already has an account. Please login instead.");
      this.router.navigate(['/auth/login']);
    }

    try {
      const verificationMailSent = await this.auth.sendVerification(this.signup().email, this.signup().password, this.signup().name);
      if (verificationMailSent) {
        this.toast.show("Verification link sent! Check your email.");
      }
    } catch (err) {
      this.toast.show("Failed to send verification email.");
    }

  }


  private signUpValidation(): boolean {
    if (!this.signup().name) {
      this.toast.show("Please enter your name.");
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

    if (this.signup().password !== this.signup().confirmPassword) {
      this.toast.show("Passwords do not match.");
      return false;
    }

    if (!this.accepted()) {
      this.toast.show("Please accept the terms and conditions.");
      return false;
    }
    return true;
  }

}
