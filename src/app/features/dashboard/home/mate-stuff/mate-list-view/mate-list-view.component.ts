import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, InfiniteScrollCustomEvent, IonRefresher, IonRefresherContent, RefresherCustomEvent } from '@ionic/angular/standalone';
import { add, bicycleOutline, calendarClear, peopleOutline } from 'ionicons/icons';
import { MateListItem } from '../models/mate.model';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, IonRefresher, IonRefresherContent, IonicButtonComponent]
})
export class MateListViewComponent {
  icons = { peopleOutline, bicycleOutline, calendarClear, add };

  sportsMateList: MateListItem[] = [
    {
      id: 1,
      profileImg: '',
      name: 'Christian Bale',
      location: 'Chicago',
      time: '20 Oct, 4 PM',
      requiredMembers: 8,
      confirmedMembers: 8,
      distanceOrDuration: '600 M',
      sport: 'Cycling'
    },
    {
      id: 2,
      profileImg: '',
      name: 'Elizabeth Taylor',
      location: 'Naperville',
      time: '20 Oct, 4 PM',
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Badmiton'
    },
    {
      id: 3,
      profileImg: '',
      name: 'Judy',
      location: 'Bolingbrook',
      time: '20 Oct, 4 PM',
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 km',
      sport: 'Running'
    },
    {
      id: 4,
      profileImg: '',
      name: 'Christian Bale',
      location: 'Chicago',
      time: '20 Oct, 4 PM',
      requiredMembers: 8,
      confirmedMembers: 8,
      distanceOrDuration: '600 M',
      sport: 'Cycling'
    },
    {
      id: 5,
      profileImg: '',
      name: 'Elizabeth Taylor',
      location: 'Naperville',
      time: '20 Oct, 4 PM',
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Badmiton'
    },
    {
      id: 6,
      profileImg: '',
      name: 'Judy',
      location: 'Bolingbrook',
      time: '20 Oct, 4 PM',
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 km',
      sport: 'Running'
    },
    {
      id: 7,
      profileImg: '',
      name: 'Christian Bale',
      location: 'Chicago',
      time: '20 Oct, 4 PM',
      requiredMembers: 8,
      confirmedMembers: 8,
      distanceOrDuration: '600 M',
      sport: 'Cycling'
    },
    {
      id: 8,
      profileImg: '',
      name: 'Elizabeth Taylor',
      location: 'Naperville',
      time: '20 Oct, 4 PM',
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Badmiton'
    },
    {
      id: 9,
      profileImg: '',
      name: 'Judy',
      location: 'Bolingbrook',
      time: '20 Oct, 4 PM',
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 km',
      sport: 'Running'
    },
    {
      id: 10,
      profileImg: '',
      name: 'Christian Bale',
      location: 'Chicago',
      time: '20 Oct, 4 PM',
      requiredMembers: 8,
      confirmedMembers: 8,
      distanceOrDuration: '600 M',
      sport: 'Cycling'
    },
    {
      id: 11,
      profileImg: '',
      name: 'Elizabeth Taylor',
      location: 'Naperville',
      time: '20 Oct, 4 PM',
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Badmiton'
    },
    {
      id: 12,
      profileImg: '',
      name: 'Judy',
      location: 'Bolingbrook',
      time: '20 Oct, 4 PM',
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 km',
      sport: 'Running'
    },
  ];

  constructor(private router: Router) { }

  openMateDetail(id: number) {
    // Pass the ID or name in the route parameter
    this.router.navigate(['dashboard/mate-detail', id]);
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  private generateItems() {

  }

  createInvitation() {

  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      // You can call your API or regenerate items here
      this.generateItems(); // fetch new
      this.sportsMateList = [...this.sportsMateList]; // For now, just reassign
      event.target.complete(); // Stop refresher
    }, 1000);
  }

}
