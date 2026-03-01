import { Injectable, signal } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private http = inject(HttpClient);

  readonly fcmToken = signal<string | null>(null);

  async initializePush(): Promise<void> {
    await PushNotifications.requestPermissions();
    await PushNotifications.register();

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('FCM TOKEN:', token.value);
      this.fcmToken.set(token.value);

      this.saveTokenToBackend(token.value);
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

  private saveTokenToBackend(token: string): void {
    this.http.post('/api/save-fcm-token', { token }).subscribe();
  }
}