import { Component, effect, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, InfiniteScrollCustomEvent, IonRefresher, IonRefresherContent, RefresherCustomEvent } from '@ionic/angular/standalone';
import { add, bicycleOutline, calendarClear, peopleOutline } from 'ionicons/icons';
import { MateListItem } from '../models/mate.model';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { HomeService } from '../../services/home-service';
@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, IonRefresher, IonRefresherContent, IonicButtonComponent]
})
export class MateListViewComponent {
  private router = inject(Router);
  private homeService = inject(HomeService);

  icons = { peopleOutline, bicycleOutline, calendarClear, add };
  @Input() activeTab!: 'list' | 'map';

  sportsMateList: MateListItem[] = [
    {
      id: 1,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Meera',
      location: 'Chicago',
      eventDateTime: '2025-10-20T16:00:00.000Z',
      requiredMembers: 8,
      confirmedMembers: 8,
      distanceOrDuration: '600 M',
      sport: 'Cycling',
      coords: { "lat": 13.0901, "lng": 80.2650 }
    },
    {
      id: 2,
      profileImg: 'assets/avatars/avatar2.jfif',
      name: 'Amelia',
      location: 'Naperville',
      eventDateTime: '20 Oct, 4 PM',
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Badminton',
      coords: { "lat": 13.0752, "lng": 80.2905 }
    },
    {
      id: 3,
      profileImg: 'assets/avatars/avatar3.jfif',
      name: 'Rahul',
      location: 'Bolingbrook',
      eventDateTime: '20 Oct, 4 PM',
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 Km',
      sport: 'Running',
      coords: { "lat": 13.0705, "lng": 80.2555 }
    },
    {
      id: 4,
      profileImg: 'assets/avatars/avatar4.jfif',
      name: 'Karthik',
      location: 'Chicago',
      eventDateTime: '20 Oct, 4 PM',
      requiredMembers: 8,
      confirmedMembers: 6,
      distanceOrDuration: '2 Hr',
      sport: 'Football',
      coords: { "lat": 13.0450, "lng": 80.2489 }
    },
    {
      id: 5,
      profileImg: 'assets/avatars/avatar2.jfif',
      name: 'Elizabeth Taylor',
      location: 'Naperville',
      eventDateTime: '20 Oct, 4 PM',
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Badminton',
      coords: { "lat": 13.0600, "lng": 80.2950 }
    },
    {
      id: 6,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Judy',
      location: 'Bolingbrook',
      eventDateTime: '20 Oct, 4 PM',
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 Km',
      sport: 'Running',
      coords: { "lat": 13.1005, "lng": 80.3055 }
    },
    {
      id: 7,
      profileImg: 'assets/avatars/avatar3.jfif',
      name: 'Christian Bale',
      location: 'Chicago',
      eventDateTime: '20 Oct, 4 PM',
      requiredMembers: 8,
      confirmedMembers: 8,
      distanceOrDuration: '5 Km',
      sport: 'Cycling',
      coords: { "lat": 13.1420, "lng": 80.2005 }
    },
    {
      id: 8,
      profileImg: 'assets/avatars/avatar4.jfif',
      name: 'Arjun',
      location: 'Naperville',
      eventDateTime: '20 Oct, 4 PM',
      requiredMembers: 3,
      confirmedMembers: 4,
      distanceOrDuration: '2 Hr',
      sport: 'Tennis',
      coords: { "lat": 13.0255, "lng": 80.3205 }
    },
    {
      id: 9,
      profileImg: 'assets/avatars/avatar1.jfif',
      name: 'Nisha',
      location: 'Bolingbrook',
      eventDateTime: '20 Oct, 4 PM',
      requiredMembers: 4,
      confirmedMembers: 4,
      distanceOrDuration: '3 km',
      sport: 'Running',
      coords: { "lat": 13.1550, "lng": 80.2455 }
    }
  ];

  constructor() {
    // Effect runs whenever range or activeTab changes
    effect(() => {
      if (this.homeService.segmentView() === 'list') {
        this.calculateList(this.homeService.range());
      }
    });
  }


  calculateList(range: number) {
    console.log('List view calculation with range:', range);
    // your logic here...
  }

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
