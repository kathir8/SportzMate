import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView } from '@ionic/angular/standalone';
import { MateListViewComponent } from "../home/mate-stuff/mate-list-view/mate-list-view.component";
import { GroupInvites, MyInvites } from './models/invite.model';
import { MyGroupListComponent } from "./my-group-list/my-group-list.component";
import { InviteApiService } from './services/invite-api-service';
@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss'],
  imports: [IonContent, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, MateListViewComponent, MyGroupListComponent]
})
export class InvitesComponent {
  private readonly invitesApiService = inject(InviteApiService);

  readonly segmentView = signal<'myInvites' | 'acceptInvites'>('myInvites');
  readonly myInvitesList = signal<MyInvites[]>([]);
  readonly myGroupList = signal<GroupInvites[]>([]);



  constructor() {
    effect(() => {
      if (this.segmentView() === 'myInvites') {
        this.loadMyInvites();
      } else {
        this.loadGroupInvites();
      }
    })
  }

  private loadMyInvites() {
    this.invitesApiService.getMyInvites().subscribe(res => {
      this.myInvitesList.set(res);
    });
  }

  private loadGroupInvites() {
    this.invitesApiService.getGroupInvites().subscribe(res => {
      this.myGroupList.set(res);
    });
  }

}
