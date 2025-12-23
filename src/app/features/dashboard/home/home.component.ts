import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonAvatar, IonContent, IonIcon, IonImg, IonLabel, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { navigateCircleOutline, navigateSharp } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { MateListViewComponent } from "./mate-stuff/mate-list-view/mate-list-view.component";
import { MateMapViewComponent } from "./mate-stuff/mate-map-view/mate-map-view.component";
import { Coordinates, MateListItem } from './mate-stuff/models/mate.model';
import { RangeFabComponent } from './range-fab/range-fab.component';
import { HomeApiService } from './services/home-api-service';
import { HomeService } from './services/home-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonContent, IonTitle, IonIcon, NgSelectModule, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, CommonModule, RangeFabComponent, MateListViewComponent, MateMapViewComponent, IonRefresher, IonRefresherContent, IonicInputComponent ]

})
export class HomeComponent {

  public readonly homeService = inject(HomeService);
  private readonly homeApi = inject(HomeApiService);


  readonly icons = { navigateCircleOutline, navigateSharp };

  readonly segmentView = signal<'list' | 'map'>('list');
  readonly current = signal<Coordinates>({ lat: 13.0827, lng: 80.2707 }); // (fallback to Chennai if geolocation fails)
  private loading = signal(true);
  private mates = signal<MateListItem[]>([]);
  readonly rawSearchTerm = signal<string>('');
  private debouncedSearchInvites = signal<string>('');


  private rangeFilteredMates = computed<MateListItem[]>(() => {
    const mates = this.mates();
    const cur = this.current();
    const range = this.homeService.rangeKm();

    if (!mates.length || !cur.lat || !cur.lng) return [];

    // Calculate distance and filter by radius
    const filtered = mates
      .map((p) => ({
        ...p,
        distanceKm: this.distanceKm(cur.lat!, cur.lng!, p.coords.lat, p.coords.lng)
      }))
      .filter((p) => p.distanceKm! <= range);

    return filtered;
  });

  readonly visiblePlayers = computed<MateListItem[]>(() => {
    let filtered = this.rangeFilteredMates();
    const searchTerm = this.debouncedSearchInvites().toLowerCase().trim();

    // Filter by Search Term 
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm) || p.location.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by Distance
    const sorted = [...filtered].sort((a, b) => a.distanceKm! - b.distanceKm!);
    return sorted;
  });

  constructor() {
    effect((onCleanup) => {
      const currentSearchTerm = this.rawSearchTerm();

      const timeout = setTimeout(() => {
        this.debouncedSearchInvites.set(currentSearchTerm);
      }, 500);

      onCleanup(() => clearTimeout(timeout));
    });
  }

  async ngAfterViewInit() {
    await this.refreshData();
  }


  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject('No geolocation');
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
    });
  }

  private async refreshData(): Promise<void> {
    this.loading.set(true);

    try {
      // Update location
      const pos = await this.getCurrentPosition();
      this.current.set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (err) {
      console.warn('Geolocation failed — using fallback.', err);
    }

    try {
      // Fetch mates from API
      const newMates = await firstValueFrom(this.homeApi.getMates());
      this.mates.set(newMates);
    } catch (err) {
      console.error('Failed to load mates', err);
      this.mates.set([]); // fallback empty
    } finally {
      this.loading.set(false);
    }
  }

  // compute distance between two lat/lon in km (Haversine)
  private distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number) { return deg * (Math.PI / 180); }

  async doRefresh(event: CustomEvent) {
    await this.refreshData();
    setTimeout(() => {
      event.detail.complete(); // hide spinner
    }, 2500);
  }

  updateSearchTerm(value: string): void {
    this.rawSearchTerm.set(value);
  }

}
