import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonList, IonItem, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, InfiniteScrollCustomEvent, IonContent } from '@ionic/angular/standalone';
import { add, bicycleOutline, calendarClear, peopleOutline } from 'ionicons/icons';
import { MateListItem } from '../models/mate.model';
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { DATE_FORMATS } from 'src/app/core/constants';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [IonList, IonItem, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, NoMateFoundComponent, LocalTimePipe, IonContent, CdkVirtualScrollViewport, ScrollingModule]
})
export class MateListViewComponent {
  private router = inject(Router);
  DATE_FORMATS = DATE_FORMATS;
  icons = { peopleOutline, bicycleOutline, calendarClear, add };

  visiblePlayers = input<MateListItem[]>([]);

  openMateDetail(id: number) {
    // Pass the ID or name in the route parameter
    this.router.navigate(['dashboard/mate-detail', id]);
  }

    trackById(index: number, item: MateListItem) {
    return item.id;
  }

}
