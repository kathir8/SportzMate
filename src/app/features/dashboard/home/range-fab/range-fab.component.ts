import { Component, inject } from '@angular/core';
import { IonFab, IonFabButton, IonFabList, IonRange, IonIcon, RangeCustomEvent } from '@ionic/angular/standalone';
import { filterSharp } from 'ionicons/icons';
import { HomeService } from '../services/home-service';
@Component({
  selector: 'app-range-fab',
  templateUrl: './range-fab.component.html',
  styleUrls: ['./range-fab.component.scss'],
  imports: [IonFab, IonFabButton, IonFabList, IonRange, IonIcon]
})
export class RangeFabComponent {
  private homeService = inject(HomeService);
  icons = { filterSharp };

  selectedRange = this.homeService.range();

  formatKm(value: number) {
    return `${value} KM`;
  }

  onIonChange(event: RangeCustomEvent) {
    const newValue = (event.detail.value) as number;
    this.selectedRange = newValue;
    this.homeService.updateRange(newValue);
  }

}
