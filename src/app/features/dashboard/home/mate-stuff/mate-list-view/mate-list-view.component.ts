import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, InfiniteScrollCustomEvent, IonContent } from '@ionic/angular/standalone';
import { add, bicycleOutline, calendarClear, peopleOutline } from 'ionicons/icons';
import { MateListItem } from '../models/mate.model';
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { DATE_FORMATS } from 'src/app/core/constants';
@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, NoMateFoundComponent, LocalTimePipe, IonContent]
})
export class MateListViewComponent {
  private router = inject(Router);
  DATE_FORMATS = DATE_FORMATS;
  icons = { peopleOutline, bicycleOutline, calendarClear, add };

  visiblePlayers = input<MateListItem[]>([]);
  displayedPlayers = signal<MateListItem[]>([]);


  private batchSize = 9;
  private loadedCount = 0;


  constructor() {
    effect(() => {
      const allPlayers = this.visiblePlayers();
      this.loadedCount = 0;
      this.displayedPlayers.set([]);
      this.loadMorePlayersBatch(allPlayers); // load first batch
    });
  }

  openMateDetail(id: number) {
    // Pass the ID or name in the route parameter
    this.router.navigate(['dashboard/mate-detail', id]);
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.loadMorePlayersBatch(this.visiblePlayers(), event);
  }

  loadMorePlayersBatch(allPlayers: MateListItem[], event?: InfiniteScrollCustomEvent) {

    const nextBatch = allPlayers.slice(this.loadedCount, this.loadedCount + this.batchSize);
    if (nextBatch.length) {
      this.displayedPlayers.update(arr => {
        arr.push(...nextBatch);
        return arr;
      });
      this.loadedCount += nextBatch.length;
    }

    if (event) {
      if (this.loadedCount >= allPlayers.length) {
        (event.target as HTMLIonInfiniteScrollElement).disabled = true;
      }
      event.target.complete();
    }
  }

}
