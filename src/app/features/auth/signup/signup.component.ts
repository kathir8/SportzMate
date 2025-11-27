import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicCheckboxComponent } from 'src/app/shared/components/ionic-checkbox/ionic-checkbox.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { UserService } from '../../other-details/services/user-service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [IonContent, FormsModule, IonicInputComponent, IonicButtonComponent, IonicCheckboxComponent, IonImg]
})
export class SignupComponent {
  private router = inject(Router);
  private toast = inject(IonicToastService);
  private auth = inject(AuthService);
  private userService = inject(UserService);

  password: string = 'sportzmate';
  email: string = 'ilayakathi@gmail.com';
  name: string = 'Kathiravan';
  confirmPassword: string = ''
  accepted = signal(false);
  isVerifying = signal(false);

  async ngOnInit() {
    try {
      const userDetail = await this.auth.userClickEmailVerify();

      if (userDetail == null) {
        this.toast.show("Session expired. Please sign up again.");
        return;
      }
      this.userService.saveUser(userDetail);
    } catch (error) {
      this.toast.show("Verification failed. Please try again.");
    }
  }


  async sendVerification() {

    if (!this.signUpValidation()) {
      return
    }

    const isUserExist = await firstValueFrom(this.userService.isuserExist(this.email));
    if (isUserExist) {
      this.toast.show("This email already has an account. Please login instead.");
      this.router.navigate(['/auth/login']);
    }

    try {
      const verificationMailSent = await this.auth.sendVerification(this.email, this.password, this.name);
      if (verificationMailSent) {
        this.toast.show("Verification link sent! Check your email.");
      }
    } catch (err) {
      this.toast.show("Failed to send verification email.");
    }

  }

  private signUpValidation(): boolean {
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

    if (this.password !== this.confirmPassword) {
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
