import { Component, inject, signal } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { MateListViewComponent } from "../home/mate-stuff/mate-list-view/mate-list-view.component";
import { myEventsApiResp, MyRequests } from '../requests/models/requests.model';
import { EventsApiService } from './events-api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  imports: [IonContent, MateListViewComponent]
})
export class EventsComponent {
  readonly myEventsList = signal<MyRequests[]>([]);
  private readonly eventsApiService = inject(EventsApiService);

  constructor() {
    this.loadMyEvents();
  }

  private loadMyEvents() {
    this.eventsApiService.getMyEvents().subscribe((res: myEventsApiResp) => {
      this.myEventsList.set(res.events);
    });
  }

}
