import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonFab, IonFabButton, IonIcon, IonTabBar, IonTabButton, IonTabs, ModalController } from '@ionic/angular/standalone';
import { add, chatbubblesSharp, homeSharp, mailOpenSharp, menuOutline } from 'ionicons/icons';
import { filter } from 'rxjs';
import { CreateInviteComponent } from './create-invite/create-invite.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [IonIcon, IonTabs, IonTabBar, IonTabButton, FormsModule, IonFab, IonFabButton ]
})
export class DashboardComponent {
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  icons = { homeSharp, chatbubblesSharp, menuOutline, mailOpenSharp, add };

  showTabs = signal(true);

  constructor() {

    effect(() => {
      const navigationEnd = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      );

      const subscription = navigationEnd.subscribe((event: NavigationEnd) => {
        this.showTabs.set(!event.url.includes('mate-detail'));  // Hide tabs on mate-detail route
      });

      return () => subscription.unsubscribe(); // Cleanup
    });
  }


  async createNewInvite() {
    const modal = await this.modalCtrl.create({
      component: CreateInviteComponent,
      breakpoints: [0, 0.4, 0.7],
      initialBreakpoint: 0.5,
      handleBehavior: 'cycle',
      cssClass: 'bottom-sheet-modal'
    });
    await modal.present();

  }
}
