import { computed, inject, Injectable, signal } from '@angular/core';
import { Auth, authState, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, User } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled promise rejection:', ev.reason);
});
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private _user = signal<User | null>(null);

  user = computed(() => this._user());
  isLoggedIn = computed(() => !!this._user() || this.token !== null);

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor() {
    // sync firebase user → our signal store
    authState(this.auth).subscribe((user) => {
      this._user.set(user);
    });

        // Handle Google OAuth redirect result
    this.handleGoogleRedirectLogin();

  }

  
  login(email: string, password: string) {
    this.token = 'dummy-token';

    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // GOOGLE LOGIN
  async googleLogin() {
      try {
    console.log('googleLogin: starting redirect...');
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(this.auth, provider);
    console.log('googleLogin: signInWithRedirect returned (this line typically never runs due to redirect).');
  } catch (err) {
    console.error('googleLogin error:', err);
    alert('googleLogin error: ' + (err as any)?.message);
  }
  }

   // Process the redirect result (runs after Google sends user back)
  private async handleGoogleRedirectLogin() {
    try {
          console.log('handleGoogleRedirectLogin: checking redirect result...');

      const result = await getRedirectResult(this.auth);
          console.log('getRedirectResult returned:', result);

      if (result?.user) {
              console.log('Got user from redirect:', result.user.uid, result.user.email);

        await this.saveUserProfile(result.user);
      }else{
              console.log('No redirect user present.');
      }
    } catch (err) {
      console.error("Google Login Redirect Error:", err);
          alert('Google redirect error: ' + (err as any)?.message);
    }
  }

  // SAVE USER PROFILE TO FIRESTORE
  private async saveUserProfile(user: User) {
    const ref = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      });
    } else {
      await setDoc(ref, {
        lastSeen: new Date().toISOString(),
      }, { merge: true });
    }
  }

  logout() {
    this.token = null;
    return signOut(this.auth);
  }

  // convenience
  async getUserOnce() {
    return await firstValueFrom(authState(this.auth));
  }
}
