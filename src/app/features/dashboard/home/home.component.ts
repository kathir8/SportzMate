import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonIcon, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { navigateCircleOutline, navigateSharp } from 'ionicons/icons';
import { RangeFabComponent } from './range-fab/range-fab.component';
import { MateListViewComponent } from "./mate-stuff/mate-list-view/mate-list-view.component";
import { MateMapViewComponent } from "./mate-stuff/mate-map-view/mate-map-view.component";
import { HomeService } from './services/home-service';
import { HomeApiService } from './services/home-api-service';
import { MateListItem } from './mate-stuff/models/mate.model';
import { catchError, map, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonContent, IonTitle, IonIcon, NgSelectModule, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, CommonModule, RangeFabComponent, MateListViewComponent, MateMapViewComponent]

})
export class HomeComponent {

  public homeService = inject(HomeService);
  private homeApi = inject(HomeApiService);

  icons = { navigateCircleOutline, navigateSharp };
  countries = [{ code: 'ad', name: 'Andorra' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'af', name: 'Afghanistan' },
  { code: 'ag', name: 'Antigua and Barbuda' }];

  loading = signal(true);
  error = signal<string | null>(null);

  mates = toSignal(
    this.homeApi.getMates().pipe(
      map((res) => {
        this.loading.set(false);
        return res;
      }),
      catchError((err) => {
        console.error(err);
        this.error.set('Failed to load mates');
        this.loading.set(false);
        return of([] as MateListItem[]);
      }),
      startWith([] as MateListItem[])
    ),
    { initialValue: [] as MateListItem[] }
  );
  
  onSegmentChange(event: any) {
    this.homeService.updateSegmentView(event.detail.value);
  }


}
