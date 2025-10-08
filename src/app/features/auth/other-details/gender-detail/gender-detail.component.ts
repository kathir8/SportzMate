import { Component, OnInit } from '@angular/core';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonNavLink, IonCol, IonGrid, IonRow, IonImg, IonIcon, IonButtons, IonBackButton, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { checkmarkOutline } from 'ionicons/icons';
import { AgeDetailComponent } from '../age-detail/age-detail.component';
// import { IonNav } from '@ionic/angular';

@Component({
  selector: 'app-gender-detail',
  templateUrl: './gender-detail.component.html',
  styleUrls: ['./gender-detail.component.scss'],
  imports: [IonNavLink, IonCol, IonGrid, IonRow, IonImg, IonIcon, IonicButtonComponent, IonHeader, IonButtons, IonBackButton, IonToolbar]

})
export class GenderDetailComponent implements OnInit {
  icons = { checkmarkOutline };

  selectedGender: string = 'male';

  ageComponent = AgeDetailComponent;


  constructor() { }

  ngOnInit() { }

  selectGender(type: string) {
    this.selectedGender = type;
  }

  
  // goNext() {
  //   this.nav.push(AgeDetailComponent);
  // }
}
