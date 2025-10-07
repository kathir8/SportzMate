import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { IonRange, IonCol, IonGrid, IonRow, IonCard, IonImg, IonRadio, IonRadioGroup, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss'],
  imports:[IonContent, IonRange, IonCol, IonGrid, IonRow ,IonCard, IonCardContent,IonImg, IonRadioGroup , IonRadio]
})
export class OtherDetailsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
