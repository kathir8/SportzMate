import { Component, signal } from '@angular/core';
import { IonCol, IonFooter, IonGrid, IonIcon, IonImg, IonNavLink, IonRow } from '@ionic/angular/standalone';
import { checkmarkOutline } from 'ionicons/icons';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { AgeDetailComponent } from '../age-detail/age-detail.component';

@Component({
  selector: 'app-gender-detail',
  templateUrl: './gender-detail.component.html',
  styleUrls: ['./gender-detail.component.scss'],
  imports: [IonNavLink, IonCol, IonGrid, IonRow, IonImg, IonIcon, IonicButtonComponent, IonFooter]

})
export class GenderDetailComponent {
  static readonly navId = 'GenderDetail';
  readonly icons = { checkmarkOutline };

  readonly selectedGender = signal<string>('male');

  readonly ageComponent = AgeDetailComponent;


  selectGender(type: string) {
    this.selectedGender.set(type);
  }
}
