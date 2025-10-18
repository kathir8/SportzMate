import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonIcon, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { navigateCircleOutline, navigateSharp } from 'ionicons/icons';
import { RangeFabComponent } from './range-fab/range-fab.component';
import { MateListViewComponent } from "./mate-stuff/mate-list-view/mate-list-view.component";
import { MateMapViewComponent } from "./mate-stuff/mate-map-view/mate-map-view.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonContent, IonTitle, IonIcon, NgSelectModule, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, CommonModule, RangeFabComponent, MateListViewComponent, MateMapViewComponent]

})
export class HomeComponent {
  icons = { navigateCircleOutline, navigateSharp };
  countries = [{ code: 'ad', name: 'Andorra' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'af', name: 'Afghanistan' },
  { code: 'ag', name: 'Antigua and Barbuda' }];

  segmentView: 'list' | 'map' = "list";

}
