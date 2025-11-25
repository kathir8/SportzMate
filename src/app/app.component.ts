import { Component, effect, inject, viewChild } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './shared/services/theme.service';
import { AuthService } from './core/services/auth.service';
import { IonicToastComponent } from 'src/app/shared/components/ionic-toast/ionic-toast.component';
import { IonicToastService } from './shared/components/ionic-toast/ionic-toast.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonicToastComponent],
})
export class AppComponent {

  globalToast = viewChild.required<IonicToastComponent>('globalToast');

  private themeService = inject(ThemeService);
  private toastService = inject(IonicToastService);
  private auth = inject(AuthService);

  constructor() {
    this.auth.refreshToken();
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
