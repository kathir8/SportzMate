import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonFab, IonFabButton, IonIcon, IonTabBar, IonTabButton, IonTabs, ModalController } from '@ionic/angular/standalone';
import { add, chatbubblesSharp, homeSharp, mailOpenSharp, menuOutline } from 'ionicons/icons';
import { filter } from 'rxjs';
import { CreateInviteComponent } from './create-invite/create-invite.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [IonIcon, IonTabs, IonTabBar, IonTabButton, FormsModule, IonFab, IonFabButton]
})
export class DashboardComponent {
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  icons = { homeSharp, chatbubblesSharp, menuOutline, mailOpenSharp, add };

  private navigationEndSignal = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)),
    { initialValue: null }
  );

  

  showTabs = computed(() => {
    const event = this.navigationEndSignal();
    if (!event) return true;

    const url = (event as NavigationEnd).url;

    // Hide tabs on these routes
    const hideRoutes = ['/dashboard/mate-detail', '/dashboard/chat/'];

    return !hideRoutes.some(r => url.startsWith(r));
  });


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
