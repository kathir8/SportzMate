import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonIcon, IonTabs, IonTabBar, IonTabButton,IonFab,IonFabButton, IonActionSheet, ModalController, ActionSheetController } from '@ionic/angular/standalone';
import { chatbubblesSharp, homeSharp, mailOpenSharp, menuOutline, add } from 'ionicons/icons';
import { filter } from 'rxjs';
import { CreateInviteComponent } from './create-invite/create-invite.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [IonIcon, IonTabs, IonTabBar, IonTabButton, FormsModule,IonFab,IonFabButton, IonActionSheet]
})
export class DashboardComponent {
  icons = { homeSharp, chatbubblesSharp, menuOutline, mailOpenSharp, add };

  showTabs = true;

 constructor(private router: Router, private modalCtrl: ModalController) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide tabs on mate-detail route
        this.showTabs = !event.url.includes('mate-detail');
      });
  }


  async createNewInvite(){
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
