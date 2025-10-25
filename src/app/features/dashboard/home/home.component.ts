import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonIcon, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { navigateCircleOutline, navigateSharp } from 'ionicons/icons';
import { RangeFabComponent } from './range-fab/range-fab.component';
import { MateListViewComponent } from "./mate-stuff/mate-list-view/mate-list-view.component";
import { MateMapViewComponent } from "./mate-stuff/mate-map-view/mate-map-view.component";
import { HomeService } from './services/home-service';
import { HomeApiService } from './services/home-api-service';
import { Coordinates, MateListItem } from './mate-stuff/models/mate.model';
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
  
  segmentView = signal<'list' | 'map'>('list');
  current = signal<Coordinates>({ lat: 13.0827, lng: 80.2707 }); // (fallback to Chennai if geolocation fails)
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

  visiblePlayers = signal<MateListItem[]>([]);

  constructor() {
    effect(() => {
        const mates = this.mates();
      const cur = this.current();
      const range = this.homeService.rangeKm();
      if (mates.length) this.filterMatesByRadius(cur, mates, range);
    });
  }


  async ngAfterViewInit() {
    await this.updateCurrentLocation();
  }

  async updateCurrentLocation() {
    try {
      const pos = await this.getCurrentPosition();
       this.current.set({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    } catch (err) {
      console.warn('Geolocation failed or denied — using fallback coordinates.', err);
    }
  }


  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject('No geolocation');
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
    });
  }

  filterMatesByRadius(current: Coordinates,mates: MateListItem[],rangeKm: number): void {
      // filter by radius
     const filtered = mates
      .map((p) => ({
        ...p,
        distanceKm: this.distanceKm(current.lat, current.lng, p.coords.lat, p.coords.lng)
      }))
      .filter((p) => p.distanceKm <= rangeKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
       this.visiblePlayers.set(filtered);
  }

  // compute distance between two lat/lon in km (Haversine)
  distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  deg2rad(deg: number) { return deg * (Math.PI / 180); }

}
