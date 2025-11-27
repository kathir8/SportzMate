import { computed, Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { getAuth, GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithCredential, signInWithEmailAndPassword, signInWithEmailLink, updatePassword, updateProfile, User } from '@angular/fire/auth';
import { SocialLogin } from "@capgo/capacitor-social-login";
import { environment } from 'src/environments/environment';

window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled promise rejection:', ev.reason);
});
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  isLoggedIn = computed(() => this.token !== null);
  firebase: any;
  loginResponse: any;
  refresh_Access_token: any;


  constructor() {
    this.firebase = initializeApp(environment.firebaseConfig);
  }

  public async logout() {
    await getAuth(this.firebase).signOut();
    this.refresh_Access_token = undefined;
    this.loginResponse = undefined;
    await SocialLogin.logout({ provider: 'google' }).then(() => console.log('Signed Out')).catch((e: any) => { console.log('Signed Out'); });
  }

  public async refreshToken() {
    const auth = getAuth(this.firebase);
    onAuthStateChanged(auth, async (currenUser: User | null) => {
      if (currenUser) {
        const idToken = await currenUser.getIdToken(true);
        this.refresh_Access_token = idToken;
      } else {
        //this.logout();
      }
    });
  }

  async initialize() {

    const config: any = {
      google: {
        webClientId: "853532937748-7fb6egmr2jhqt726pb641t995io06rda.apps.googleusercontent.com",
        mode: 'online'
      }
    };

    await SocialLogin.initialize(config);

  } catch(error: any) {
    console.error('Failed to initialize SocialLogin:', error);
    throw error;
  }


  async loginViaGoogle() {
    try {
      const user: any = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
          forceRefreshToken: true
        }
      });

      if (user?.result) {
        this.loginResponse = user.result;

        // Sign in to Firebase with the credential
        const credential = GoogleAuthProvider.credential(
          user.result.idToken,
          user.result.accessToken
        );

        const auth = getAuth(this.firebase);
        const firebaseUser = await signInWithCredential(auth, credential);

        console.log('Firebase user:', firebaseUser.user.email);
        this.token = await firebaseUser.user.getIdToken();
        this.refresh_Access_token = this.token;

        return firebaseUser.user;
      } else {
        throw new Error('No user data received from Google login');
      }
    } catch (error) {
      console.error('Google login error', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;

    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  }

  async sendVerification(email: string, password: string, name: string) {
    const auth = getAuth();

    try {
      const actionCodeSettings = {
        url: window.location.href,   // 🔥 Return to SAME PAGE
        handleCodeInApp: true
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      localStorage.setItem("signupEmail", email);
      localStorage.setItem("signupPassword", password);
      localStorage.setItem("signupName", name);
      return true;
    } catch (err) {
      console.error('Send verification error', err);
      throw err;
    }

  }

  async userClickEmailVerify() {
    const auth = getAuth();
    const url = window.location.href;

    if (isSignInWithEmailLink(auth, url)) {
      const email = localStorage.getItem("signupEmail");
      const password = localStorage.getItem("signupPassword");
      const displayName = localStorage.getItem("signupName");

      if (!email || !password || !displayName) {
        return null;
      }

      try {
        // Verify link + sign user in
        const result = await signInWithEmailLink(auth, email, url);

        const user = result.user;

        // Set the password manually, since email-link login has no password
        await updatePassword(user, password);

        await updateProfile(user, { displayName });
        return user;

      } catch (error) {
        console.error('Verification failed.', error);
        throw error;
      }
    }
    return undefined;
  }

  validateEmail(email: string): string {
    if (!email) return 'Please enter your email';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim()) ? '' : 'Please enter a valid email';
  }

  validatePassword(password: string): string {
    if (!password) return 'Please enter your password';
    return password.length >= 8 ? '' : 'Please must be at least 8 characters';
  }
}