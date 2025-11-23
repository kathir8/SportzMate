import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './shared/services/theme.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private themeService = inject(ThemeService);
  private auth = inject(AuthService);

  constructor() {
    this.auth.refreshToken();
  }

  toggleTheme(event: any) {
    this.themeService.setDarkTheme(event.detail.checked);
  }

}
