import { computed, inject, Injectable, signal } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { getAuth, GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithCredential, signInWithEmailAndPassword, signInWithEmailLink, updatePassword, updateProfile, User } from '@angular/fire/auth';
import { SocialLogin } from "@capgo/capacitor-social-login";
import { environment } from 'src/environments/environment';

window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled promise rejection:', ev.reason);
});
@Injectable({ providedIn: 'root' })
export class AuthService {
  private firebase = initializeApp(environment.firebaseConfig);

  private uid = signal<string | null>(null);
  private token = signal<string | null>(null);

  isLoggedIn = computed(() => this.uid() !== null);

  loginResponse: any;
  refresh_Access_token: any;


  constructor() {
    this.listenToAuthState();
  }

  private listenToAuthState() {
    const auth = getAuth(this.firebase);

    onAuthStateChanged(auth, async (currentUser: User | null) => {
      try {
        if (currentUser) {
          // update uid signal
          this.uid.set(currentUser.uid);

          // refresh and store token
          const idToken = await currentUser.getIdToken(true);
          this.token.set(idToken);
          this.refresh_Access_token = idToken; // keep for backward compatibility
        } else {
          // signed out
          this.uid.set(null);
          this.token.set(null);
          this.refresh_Access_token = undefined;
        }
      } catch (err) {
        console.error('Error in auth state handler', err);
        // On unexpected error, clear signals to force "signed out" state
        this.uid.set(null);
        this.token.set(null);
        this.refresh_Access_token = undefined;
      }
    });
  }


  async initializeSocialLogin(): Promise<void> {

    const config: any = {
      google: {
        webClientId: environment.googleWebClientId,
        mode: 'online'
      }
    };
    try {
      await SocialLogin.initialize(config);
    } catch (error: any) {
      console.error('Failed to initialize SocialLogin:', error);
      throw error;
    }
  }


  async loginViaGoogle(): Promise<User> {
    try {
      const user: any = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
          forceRefreshToken: true
        }
      });

      if (!user?.result) {
        throw new Error('NoUser');
      }

      this.loginResponse = user.result;

      const credential = GoogleAuthProvider.credential(
        user.result.idToken,
        user.result.accessToken
      );

      const auth = getAuth(this.firebase);
      const firebaseUser = await signInWithCredential(auth, credential);

      const uid = firebaseUser.user.uid;
      this.uid.set(uid);

      const idToken = await firebaseUser.user.getIdToken();
      this.token.set(idToken);
      this.refresh_Access_token = idToken;

      return firebaseUser.user;
    } catch (error) {
      console.error('Google login error', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const auth = getAuth(this.firebase);
      const result = await signInWithEmailAndPassword(auth, email, password);

      // signals will be updated by onAuthStateChanged, but set them eagerly as well
      this.uid.set(result.user.uid);
      const idToken = await result.user.getIdToken();
      this.token.set(idToken);
      this.refresh_Access_token = idToken;

      return result.user;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  }

  async sendVerification(email: string, password: string, name: string): Promise<boolean> {
    const auth = getAuth(this.firebase);

    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      localStorage.setItem('signupEmail', email);
      localStorage.setItem('signupPassword', password);
      localStorage.setItem('signupName', name);
      return true;
    } catch (err) {
      console.error('Send verification error', err);
      throw err;
    }
  }

  async userClickEmailVerify(): Promise<User | null | undefined> {
    const auth = getAuth(this.firebase);
    const url = window.location.href;

    if (isSignInWithEmailLink(auth, url)) {
      const email = localStorage.getItem('signupEmail');
      const password = localStorage.getItem('signupPassword');
      const displayName = localStorage.getItem('signupName');

      if (!email || !password || !displayName) {
        return null;
      }

      try {
        const result = await signInWithEmailLink(auth, email, url);
        const user = result.user;

        // set password and profile
        await updatePassword(user, password);
        await updateProfile(user, { displayName });

        // signals will be updated by onAuthStateChanged; return user for immediate handling
        return user;
      } catch (error) {
        console.error('Verification failed.', error);
        throw error;
      }
    }

    return undefined;
  }


  async logout(): Promise<boolean> {
    try {
      const auth = getAuth(this.firebase);
      await auth.signOut();

      // clear internal state
      this.uid.set(null);
      this.token.set(null);
      this.refresh_Access_token = undefined;
      this.loginResponse = undefined;

      // try to sign out from Google plugin (best-effort)
      await SocialLogin.logout({ provider: 'google' }).catch((e: any) => {
        console.warn('SocialLogin logout failed (non-fatal)', e);
      });

      return true;
    } catch (err) {
      console.error('Logout failed', err);
      this.uid.set(null);
      this.token.set(null);
      return false;
    }
  }


  validateEmail(email?: string): string {
    if (!email) return 'Please enter your email';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim()) ? '' : 'Please enter a valid email';
  }

  validatePassword(password?: string): string {
    if (!password) return 'Please enter your password';
    return password.length >= 8 ? '' : 'Please must be at least 8 characters';
  }
}