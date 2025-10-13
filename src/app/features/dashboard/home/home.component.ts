import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonIcon, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel,IonFab,IonFabButton,IonFabList, IonRange } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { navigateCircleOutline, filterSharp } from 'ionicons/icons';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonContent, IonTitle, IonIcon, NgSelectModule, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, CommonModule,IonFab,IonFabButton,IonFabList,IonRange]

})
export class HomeComponent {
  icons = { navigateCircleOutline, filterSharp };
  countries = [{ code: 'ad', name: 'Andorra' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'af', name: 'Afghanistan' },
  { code: 'ag', name: 'Antigua and Barbuda' }];

  segmentView: 'list' | 'map' = "list";
}
