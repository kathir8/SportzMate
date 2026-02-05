import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonFab, IonFabButton, IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { add, chatbubblesSharp, homeSharp, mailOpenSharp, menuOutline } from 'ionicons/icons';
import { filter } from 'rxjs';
import { BottomSheetService } from 'src/app/shared/services/bottom-sheet.serivce';
import { CreateInviteComponent } from './create-invite/create-invite.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonIcon, IonTabs, IonTabBar, IonTabButton, FormsModule, IonFab, IonFabButton]
})
export class DashboardComponent {
  private readonly router = inject(Router);
  private readonly bottomSheet = inject(BottomSheetService);

  readonly icons = { homeSharp, chatbubblesSharp, menuOutline, mailOpenSharp, add };

  private navigationEndSignal = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)),
    { initialValue: null }
  );

  readonly showTabs = computed(() => {
    const event = this.navigationEndSignal();
    if (!event) return true;

    const url = (event as NavigationEnd).url;
    // Hide tabs on these routes
    const hideRoutes = ['/dashboard/mate-detail', '/dashboard/chat/'];

    return !hideRoutes.some(r => url.startsWith(r));
  });

  async createNewInvite() {
    await this.bottomSheet.open(CreateInviteComponent);
  }
}
