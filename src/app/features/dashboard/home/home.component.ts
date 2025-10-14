import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonIcon, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, IonFab, IonFabButton, IonFabList, IonRange, IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { navigateCircleOutline, filterSharp, calendarClear, peopleOutline, bicycleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonContent, IonTitle, IonIcon, NgSelectModule, IonImg, IonAvatar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, CommonModule, IonFab, IonFabButton, IonFabList, IonRange, IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge]

})
export class HomeComponent {
  icons = { navigateCircleOutline, filterSharp, calendarClear, peopleOutline, bicycleOutline };
  countries = [{ code: 'ad', name: 'Andorra' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'af', name: 'Afghanistan' },
  { code: 'ag', name: 'Antigua and Barbuda' }];

  segmentView: 'list' | 'map' = "list";
  sportsMateList = [{
    icon: '',
    name: 'Christian Bale',
    place: 'Chicago',
    time: '20 Oct, 4 PM',
    need: 8,
    coming: 8,
    distanceOrDuration: '600 M',
    type: 'Cycling'
  },
  {
    icon: '',
    name: 'Elizabeth Taylor',
    place: 'Naperville',
    time: '20 Oct, 4 PM',
    need: 3,
    coming: 4,
    distanceOrDuration: '2 Hr',
    type: 'Badmiton'
  },
  {
    icon: '',
    name: 'Judy',
    place: 'Bolingbrook',
    time: '20 Oct, 4 PM',
    need: 4,
    coming: 4,
    distanceOrDuration: '3 km',
    type: 'Running'
  }]

  formatKm(value: number) {
    return `${value} KM`;
  }

  private generateItems() {

  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
