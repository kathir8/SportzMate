import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView } from '@ionic/angular/standalone';
import { MateListViewComponent } from "../home/mate-stuff/mate-list-view/mate-list-view.component";
import { JoinRequests, JoinRequestsApiResp, MyRequests, myRequestsApiResp } from './models/requests.model';
import { InviteApiService } from './services/invite-api-service';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  imports: [IonContent, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, MateListViewComponent]
})
export class RequestsComponent {
  private readonly invitesApiService = inject(InviteApiService);

  readonly segmentView = signal<'myRequests' | 'joinRequests'>('myRequests');
  readonly myRequestsList = signal<MyRequests[]>([]);
  readonly joinRequest = signal<JoinRequests[]>([]);



  constructor() {
    effect(() => {
      if (this.segmentView() === 'myRequests') {
        this.loadMyRequests();
      } else {
        this.loadJoinRequests();
      }
    })
  }

  private loadMyRequests() {
    this.invitesApiService.getMyRequests().subscribe((res:myRequestsApiResp) => {
      this.myRequestsList.set(res.requestedEvents);
    });
  }

  private loadJoinRequests() {
    this.invitesApiService.getJoinRequests().subscribe((res:JoinRequestsApiResp) => {
      this.joinRequest.set(res.receivedRequests);
    });
  }

}
