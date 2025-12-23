import { Component, computed, inject, input } from '@angular/core';
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
  private readonly modalCtrl = inject(ModalController);
  readonly dynamicClass = input<string>('');
  readonly icons = { add };

  readonly text = computed(() => {
    const c = this.dynamicClass();
    if (!c) return 'No Mates Found';

    return 'No Invite Created';
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
