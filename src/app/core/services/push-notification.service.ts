import { inject, Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { FcmDetail } from '../model/user.model';
import { ApiService } from './api.service';

interface updateFCMApi {
  userId: string;
  fcmTokenDetails: FcmDetail;
}
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private api = inject(ApiService);


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

  async registerUserDevice(): Promise<FcmDetail | null> {
    const fcmToken = this.getStoredToken();

    if (!fcmToken) {
      console.warn('FCM token not available');
      return null;
    }

    const deviceName = await Device.getInfo();
    const deviceIdObj = await Device.getId();
    const deviceType = Capacitor.getPlatform();

    const fcmDetail: FcmDetail = {
      fcmToken,
      deviceType,
      deviceName: deviceName.model,
      deviceId: deviceIdObj.identifier,
      isActive: true
    };

    return fcmDetail;
  }

  async updateFCMToken(userId: string) {
    const fcmTokenDetails = await this.registerUserDevice();
    if (fcmTokenDetails) {
      this.api.post<updateFCMApi, {}>('notification/register-token', { userId, fcmTokenDetails });
    }
  }
}