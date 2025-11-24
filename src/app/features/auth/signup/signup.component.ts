import { Component, inject } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicCheckboxComponent } from 'src/app/shared/components/ionic-checkbox/ionic-checkbox.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [IonContent, FormsModule, IonicInputComponent, IonicButtonComponent, IonicCheckboxComponent, IonImg]
})
export class SignupComponent {
  private router = inject(Router);
  password: string = '';
  email: string = '';
  confirmPassword: string = ''
  code: string = ''
  accepted: boolean = false;
  passwordPane: boolean = true;
 isVerifying = false;

  async ngOnInit(){
      const auth = getAuth();
    const url = window.location.href;

    // 🔥 If user clicks email verification link, we detect it here
    if (isSignInWithEmailLink(auth, url)) {
      this.isVerifying = true;

      const email = localStorage.getItem("signupEmail");
      const password = localStorage.getItem("signupPassword");

      if (!email || !password) {
        alert("Session expired. Please sign up again.");
        return;
      }

      try {
        // Step 1: Mark email verified
        await signInWithEmailLink(auth, email, url);

        // Step 2: Create Firebase user
        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        // Step 3: Save to backend DB
        await this.saveUserToDB(userCred.user);

        // Step 4: Cleanup
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("signupPassword");

        // Step 5: Navigate to other-details
        this.router.navigate(['/other-details']);

      } catch (err) {
        console.error(err);
        alert("Verification failed.");
      } finally {
        this.isVerifying = false;
      }
    }
  }


  async sendVerification() {
    const auth = getAuth();

    const actionCodeSettings = {
      url: window.location.href,   // 🔥 Return to SAME PAGE
      handleCodeInApp: true
    };

    try {
      await sendSignInLinkToEmail(auth, this.email, actionCodeSettings);

      localStorage.setItem("signupEmail", this.email);
      localStorage.setItem("signupPassword", this.password);

      alert("Verification link sent! Check your email.");

    } catch (err) {
      console.error(err);
      alert("Failed to send verification email.");
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


  register(){
    this.router.navigate(['/other-details'], { replaceUrl: true });
  }

}
