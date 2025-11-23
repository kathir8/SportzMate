import { computed, Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, User } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';
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
        console.log(idToken);
        this.refresh_Access_token = idToken;
      } else {
        this.logout();
      }
    });
  }

  async initialize() {

    const platform = Capacitor.getPlatform();
    console.log('Initializing on platform:', platform);

    const config: any = {
      google: {
        webClientId: "853532937748-7fb6egmr2jhqt726pb641t995io06rda.apps.googleusercontent.com",
        mode: 'online'
      }
    };

    await SocialLogin.initialize(config);

    console.log('SocialLogin initialized successfully');
  } catch(error: any) {
    console.error('Failed to initialize SocialLogin:', error);
    throw error;
  }


  async loginViaGoogle() {
    try {
      console.log('Starting Google login...');

      const user: any = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
          forceRefreshToken: true
        }
      });

      console.log('Raw login response:', user);

      if (user?.result) {
        this.loginResponse = user.result;
        console.log('Login successful:', JSON.stringify(user.result, null, 2));

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
    } catch (error: any) {
      console.error('Google login error:', error);
      throw error;
    }


  }
}