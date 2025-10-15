import { Component } from '@angular/core';
import { IonFab, IonFabButton, IonFabList, IonRange, IonIcon } from '@ionic/angular/standalone';
import { filterSharp } from 'ionicons/icons';
@Component({
  selector: 'app-range-fab',
  templateUrl: './range-fab.component.html',
  styleUrls: ['./range-fab.component.scss'],
  imports: [IonFab, IonFabButton, IonFabList, IonRange, IonIcon]
})
export class RangeFabComponent {
  icons = { filterSharp };

  formatKm(value: number) {
    return `${value} KM`;
  }

}
