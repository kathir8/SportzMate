import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonIcon, IonTabs, IonTabBar, IonTabButton,IonFab,IonFabButton } from '@ionic/angular/standalone';
import { chatbubblesSharp, homeSharp, mailOpenSharp, menuOutline, add } from 'ionicons/icons';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonIcon, IonTabs, IonTabBar, IonTabButton, FormsModule,IonFab,IonFabButton]
})
export class DashboardComponent {
  icons = { homeSharp, chatbubblesSharp, menuOutline, mailOpenSharp, add };

  showTabs = true;

 constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide tabs on mate-detail route
        this.showTabs = !event.url.includes('mate-detail');
      });
  }
}
