import { computed, inject, Injectable, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithCredential, signInWithEmailAndPassword, signInWithEmailLink, updatePassword, updateProfile, User } from '@angular/fire/auth';
import { SocialLogin } from "@capgo/capacitor-social-login";
import { environment } from 'src/environments/environment';

window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled promise rejection:', ev.reason);
});
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  private readonly uid = signal<string | null>(null);
  private readonly token = signal<string | null>(null);

  isLoggedIn = computed(() => this.uid() !== null);


  constructor() {
    this.listenToAuthState();
  }

  private listenToAuthState() {

    onAuthStateChanged(this.auth, async (currentUser: User | null) => {
      try {
        if (currentUser) {

          // refresh and store token
          const idToken = await currentUser.getIdToken(true);
          this.updateUidAndToken(currentUser.uid, idToken);
        } else {
          // signed out
          this.updateUidAndToken();
        }
      } catch (err) {
        console.error('Error in auth state handler', err);
        // On unexpected error, clear signals to force "signed out" state
        this.updateUidAndToken();
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

      const credential = GoogleAuthProvider.credential(
        user.result.idToken,
        user.result.accessToken
      );

      const firebaseUser = await signInWithCredential(this.auth, credential);
      const idToken = await firebaseUser.user.getIdToken();

      this.updateUidAndToken(firebaseUser.user.uid, idToken);

      return firebaseUser.user;
    } catch (error) {
      console.error('Google login error', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      // signals will be updated by onAuthStateChanged, but set them eagerly as well
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const idToken = await result.user.getIdToken();

      this.updateUidAndToken(result.user.uid, idToken);
      return result.user;

    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  }

  async sendVerification(email: string, password: string, name: string): Promise<boolean> {

    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
      };
      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);

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
    const url = window.location.href;

    if (isSignInWithEmailLink(this.auth, url)) {
      const email = localStorage.getItem('signupEmail');
      const password = localStorage.getItem('signupPassword');
      const displayName = localStorage.getItem('signupName');

      if (!email || !password || !displayName) {
        return null;
      }

      try {
        const result = await signInWithEmailLink(this.auth, email, url);
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
      await this.auth.signOut();

      // clear internal state
      this.updateUidAndToken();

      // try to sign out from Google plugin (best-effort)
      await SocialLogin.logout({ provider: 'google' }).catch((e: any) => {
        console.warn('SocialLogin logout failed (non-fatal)', e);
      });

      return true;
    } catch (err) {
      console.error('Logout failed', err);
      this.updateUidAndToken();
      return false;
    }
  }


  updateUid(uid: string | null = null) {
    this.uid.set(uid);
  }

  private updateUidAndToken(uid: string | null = null, token: string | null = null) {
    this.updateUid(uid);
    this.token.set(token);
  }
  validateEmail(email?: string): string {
    if (!email) return 'Enter your email';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim()) ? '' : 'Enter a valid email';
  }

  validatePassword(password?: string): string {
    if (!password) return 'Enter your password';
    return password.length >= 8 ? '' : 'Password must be at least 8 characters';
  }
}