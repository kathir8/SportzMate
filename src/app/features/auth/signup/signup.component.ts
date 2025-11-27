import { Component, inject } from '@angular/core';
import { fetchSignInMethodsForEmail, getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, updatePassword, updateProfile } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicCheckboxComponent } from 'src/app/shared/components/ionic-checkbox/ionic-checkbox.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { UserService } from '../../other-details/services/user-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [IonContent, FormsModule, IonicInputComponent, IonicButtonComponent, IonicCheckboxComponent, IonImg]
})
export class SignupComponent {
  private router = inject(Router);
  private toast = inject(IonicToastService);
  private userService = inject(UserService);

  password: string = 'sportzmate';
  email: string = 'ilayakathi@gmail.com';
  name: string = 'Kathiravan';
  confirmPassword: string = ''
  code: string = ''
  accepted: boolean = false;
  passwordPane: boolean = true;
  isVerifying = false;

  async ngOnInit() {
    const auth = getAuth();
    const url = window.location.href;

    // 🔥 If user clicks email verification link, we detect it here
    if (isSignInWithEmailLink(auth, url)) {
      this.isVerifying = true;

      const email = localStorage.getItem("signupEmail");
      const password = localStorage.getItem("signupPassword");
      const displayName = localStorage.getItem("signupName");

      if (!email || !password || !displayName) {
        this.toast.show("Session expired. Please sign up again.");
        return;
      }

      try {
        // Verify link + sign user in
        const result = await signInWithEmailLink(auth, email, url);

        const user = result.user;

        // Set the password manually, since email-link login has no password
        await updatePassword(user, password);

        await updateProfile(user, { displayName });
        console.log(user);

        // Step 3: Save to backend DB
        await this.saveUserToDB(user);

        // Step 4: Cleanup
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("signupPassword");
        localStorage.removeItem("signupName");

        // Step 5: Navigate to other-details
        this.router.navigate(['/other-details']);

      } catch (err) {
        console.error(err);
        this.toast.show("Verification failed." + err);
      } finally {
        this.isVerifying = false;
      }
    }
  }


  async sendVerification() {
    const auth = getAuth();

    const isUserExist = await firstValueFrom(this.userService.isuserExist(this.email));
    if (isUserExist) {
      this.toast.show("This email already has an account. Please login instead.");
      this.router.navigate(['/auth/login']);
    }

    const actionCodeSettings = {
      url: window.location.href,   // 🔥 Return to SAME PAGE
      handleCodeInApp: true
    };

    try {
      await sendSignInLinkToEmail(auth, this.email, actionCodeSettings);

      localStorage.setItem("signupEmail", this.email);
      localStorage.setItem("signupPassword", this.password);
      localStorage.setItem("signupName", this.name);
      this.toast.show("Verification link sent! Check your email.");
    } catch (err) {
      console.error(err);
      this.toast.show("Failed to send verification email.");
    }
  }

  async saveUserToDB(user: any) {
    // 🔥 Your backend call here
    return fetch('/api/users/create', {
      method: 'POST',
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName ?? null
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  verify() {


    console.log("Email: ", this.email);
    console.log("Password: ", this.password);
    console.log("Confirm Password: ", this.confirmPassword);
    // Later you can add API call here
    this.passwordPane = false;
  }


  register() {
    this.router.navigate(['/other-details'], { replaceUrl: true });
  }

}
