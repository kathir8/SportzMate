import { Component } from '@angular/core';
import { IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, InfiniteScrollCustomEvent, IonRefresher, IonRefresherContent, RefresherCustomEvent } from '@ionic/angular/standalone';
import { bicycleOutline, calendarClear, peopleOutline } from 'ionicons/icons';
@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, IonRefresher, IonRefresherContent]
})
export class MateListViewComponent {
  icons = { peopleOutline, bicycleOutline, calendarClear };

  sportsMateList = [
    {
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
    },
    {
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
    },
  ];

  loadMore(event: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  private generateItems() {

  }


  handleRefresh(event: RefresherCustomEvent) {
    // Example: refresh or reload your list
    setTimeout(() => {
      // You can call your API or regenerate items here
      this.sportsMateList = [...this.sportsMateList]; // For now, just reassign
      this.generateItems(); // fetch new
      event.target.complete(); // Stop refresher
    }, 1000);
  }

}
