import { Component, inject } from '@angular/core';
import { IonIcon, IonImg, ModalController } from '@ionic/angular/standalone';
import { add } from 'ionicons/icons';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { CreateInviteComponent } from '../../../create-invite/create-invite.component';

@Component({
  selector: 'app-no-mate-found',
  templateUrl: './no-mate-found.component.html',
  styleUrls: ['./no-mate-found.component.scss'],
  imports: [IonicButtonComponent, IonIcon, IonImg]
})
export class NoMateFoundComponent {
  private modalCtrl = inject(ModalController);

  icons = { add };

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
