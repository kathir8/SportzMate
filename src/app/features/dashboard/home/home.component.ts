import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonAvatar, IonContent, IonIcon, IonImg, IonLabel, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { navigateCircleOutline, navigateSharp } from 'ionicons/icons';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { MateListViewComponent } from "./mate-stuff/mate-list-view/mate-list-view.component";
import { MateMapViewComponent } from "./mate-stuff/mate-map-view/mate-map-view.component";
import { Coordinates, eventListApi, eventListApiResp, MateListItem } from './mate-stuff/models/mate.model';
import { RangeFabComponent } from './range-fab/range-fab.component';
import { HomeApiService } from './services/home-api-service';
import { HomeService } from './services/home-service';
import { GlobalLoadingService } from 'src/app/core/services/global-loading-service';
import { UserStore } from 'src/app/core/stores/user-store';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonContent, IonTitle, IonIcon, NgSelectModule, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, CommonModule, RangeFabComponent, MateListViewComponent, MateMapViewComponent, IonRefresher, IonRefresherContent, IonicInputComponent]

})
export class HomeComponent {

  public readonly homeService = inject(HomeService);
  private readonly homeApi = inject(HomeApiService);
  private readonly userStore = inject(UserStore);
  private readonly loader = inject(GlobalLoadingService);
  private readonly router = inject(Router);
  readonly commonService = inject(CommonService);

  readonly icons = { navigateCircleOutline, navigateSharp };

  readonly segmentView = signal<'list' | 'map'>('list');
  readonly coords = signal<Coordinates>({ lat: 13.0827, lng: 80.2707 }); // (fallback to Chennai if geolocation fails)
  private mates = signal<MateListItem[]>([]);
  private readonly visiblePlayersBase = signal<MateListItem[]>([]);
  readonly currentUser = this.userStore.getCurrent();


  readonly rawSearchTerm = signal<string>('');
  private debouncedSearchInvites = signal<string>('');
  private readonly previousRangeKm = signal<number>(this.homeService.rangeKm());

  readonly visiblePlayers = computed<MateListItem[]>(() => {
    let filtered = this.visiblePlayersBase();
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

    effect(() => {
      const currentRange = this.homeService.rangeKm();
      const previousRange = this.previousRangeKm();

      if (currentRange === previousRange) return;

      if (currentRange < previousRange) {
        // 🔽 Range reduced → local filtering only
        this.updateMatesWithDistance();
      } else {
        // 🔼 Range increased → API call
        this.getMatesList();
      }

      // update previous value
      this.previousRangeKm.set(currentRange);
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

  private async refreshData(event?: CustomEvent): Promise<void> {
    this.loader.start();

    try {
      // Update location
      const pos = await this.getCurrentPosition();
      this.coords.set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (err) {
      console.warn('Geolocation failed — using fallback.', err);
    }

    this.getMatesList(event);
  }

  private updateMatesWithDistance(): void {
    const range = this.homeService.rangeKm();
    const cur = this.coords();
    const mates = this.mates();

    if (!mates.length || !cur.lat || !cur.lng) {
      this.visiblePlayersBase.set([]);
      return;
    }

    const filtered = mates
      .map(p => ({
        ...p,
        distanceKm: this.distanceKm(
          cur.lat!,
          cur.lng!,
          p.coords.lat,
          p.coords.lng
        )
      }))
      .filter(p => p.distanceKm! <= range);

    this.visiblePlayersBase.set(filtered);
  }


  private getMatesList(event?: CustomEvent) {
    try {
      const obj: eventListApi = {
        latitude: this.coords().lat,
        longitude: this.coords().lng,
        radius: this.homeService.rangeKm(),
        userId: 0,
        page: 0,
        size: 25
      }

      this.homeApi.getMates(obj).subscribe((res: eventListApiResp) => {
        this.visiblePlayersBase.set(res.events);
      })
    } catch (err) {
      console.error('Failed to load mates', err);
      this.visiblePlayersBase.set([]);
    } finally {
      this.loader.stop();
      if (event) {
        event.detail.complete(); // hide spinner
      }
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

  doRefresh(event: CustomEvent) {
    this.refreshData(event);
  }

  profileView(){
    this.router.navigate(['profile']);
  }

}
