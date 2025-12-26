import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonApp, IonRouterOutlet, IonSpinner } from '@ionic/angular/standalone';
import { IonicToastComponent } from 'src/app/shared/components/ionic-toast/ionic-toast.component';
import { GlobalLoadingService } from './core/services/global-loading-service';
import { UserService } from './core/services/user-service';
import { IonicToastService } from './shared/components/ionic-toast/ionic-toast.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonicToastComponent, IonSpinner],
})
export class AppComponent {

  private readonly globalToast = viewChild.required<IonicToastComponent>('globalToast');

  private readonly toastService = inject(IonicToastService);
  private readonly loader = inject(GlobalLoadingService);
  private readonly themeService = inject(ThemeService);
  private readonly userService = inject(UserService);

  readonly isLoading = computed(() => this.loader.isLoading());


  constructor() {
    SplashScreen.show();
    // this.userService.initializeUser();
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
