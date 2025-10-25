import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, InfiniteScrollCustomEvent, IonRefresher, IonRefresherContent, RefresherCustomEvent } from '@ionic/angular/standalone';
import { add, bicycleOutline, calendarClear, peopleOutline } from 'ionicons/icons';
import { MateListItem } from '../models/mate.model';
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";
@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, IonRefresher, IonRefresherContent, NoMateFoundComponent]
})
export class MateListViewComponent {
  private router = inject(Router);

  icons = { peopleOutline, bicycleOutline, calendarClear, add };

  visiblePlayers = input<MateListItem[]>([]);
 

  openMateDetail(id: number) {
    // Pass the ID or name in the route parameter
    this.router.navigate(['dashboard/mate-detail', id]);
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      // You can call your API or regenerate items here
      event.target.complete(); // Stop refresher
    }, 1000);
  }

}
