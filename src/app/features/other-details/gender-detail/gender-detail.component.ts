import { Component, inject } from '@angular/core';
import { IonCol, IonFooter, IonGrid, IonIcon, IonImg, IonNavLink, IonRow } from '@ionic/angular/standalone';
import { checkmarkOutline } from 'ionicons/icons';
import { UserStore } from 'src/app/core/stores/user-store';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { AgeDetailComponent } from '../age-detail/age-detail.component';
import { SignalService } from 'src/app/core/services/signal.service';

@Component({
  selector: 'app-gender-detail',
  templateUrl: './gender-detail.component.html',
  styleUrls: ['./gender-detail.component.scss'],
  imports: [IonNavLink, IonCol, IonGrid, IonRow, IonImg, IonIcon, IonicButtonComponent, IonFooter]

})
export class GenderDetailComponent {
  private readonly userStore = inject(UserStore);
  private readonly signalService = inject(SignalService);
  static readonly navId = 'GenderDetail';
  readonly icons = { checkmarkOutline };
  readonly currentUser = this.userStore.getCurrent();
  
  constructor() {
    this.selectGender(this.currentUser()?.gender || 'male');
  }

  readonly ageComponent = AgeDetailComponent;

  selectGender(type: 'male' | 'female'): void {
    this.signalService.patchSignal(this.currentUser, {
      gender: type,
    });
  }
}
