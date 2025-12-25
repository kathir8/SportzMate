import { Component, effect, inject, viewChild } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './shared/services/theme.service';
import { IonicToastComponent } from 'src/app/shared/components/ionic-toast/ionic-toast.component';
import { IonicToastService } from './shared/components/ionic-toast/ionic-toast.service';
import { UserService } from './features/other-details/services/user-service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonicToastComponent],
})
export class AppComponent {

  private readonly globalToast = viewChild.required<IonicToastComponent>('globalToast');

  private readonly toastService = inject(IonicToastService);
  private readonly themeService = inject(ThemeService);
  private readonly userService = inject(UserService);

  constructor() {
    SplashScreen.show();
    this.userService.initializeUser();
    effect(() => {
      const toastInstance = this.globalToast();
      if (toastInstance) {
        this.toastService.register(toastInstance);
      }
    });
  }


  toggleTheme(event: any) {
    this.themeService.setDarkTheme(event.detail.checked);
  }

}
