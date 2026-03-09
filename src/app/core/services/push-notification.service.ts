import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private http = inject(HttpClient);

  readonly fcmToken = signal<string | null>(null);

  private readonly LOCAL_STORAGE_KEY = 'sportzmate_fcm_token';


  async initializePush(): Promise<void> {

    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications not supported on web');
      return;
    }


    const permission = await PushNotifications.requestPermissions();

    if (permission.receive !== 'granted') {
      console.warn('Push notification permission not granted');
      return;
    }
    await PushNotifications.register();

    this.addListeners();

  }

  private addListeners(): void {

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('FCM TOKEN:', token.value);
      this.fcmToken.set(token.value);

      this.storeTokenLocally(token.value);
    });

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Notification received', notification);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('Notification clicked', action);
      }
    );
  }


  private storeTokenLocally(token: string): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, token);
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.LOCAL_STORAGE_KEY);
  }

  registerUserDevice(userUid: string): void {
// this.pushNotificationService.registerUserDevice(user.uid);
    const token = this.getStoredToken();

    if (!token) {
      console.warn('FCM token not available');
      return;
    }

    const payload = {
      userUid,
      fcmToken: token,
      deviceType: Capacitor.getPlatform()
    };

    this.http.post('/api/user-devices', payload).subscribe();
  }
}