import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonIcon, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel } from '@ionic/angular/standalone';
import { MateListViewComponent } from "../home/mate-stuff/mate-list-view/mate-list-view.component";
import { GroupInvites, MyInvites } from './models/invite.model';
import { InviteApiService } from './services/invite-api-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MyGroupListComponent } from "./my-group-list/my-group-list.component";
@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss'],
  imports: [IonContent, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, MateListViewComponent, MyGroupListComponent]
})
export class InvitesComponent {
  private router = inject(Router);
  private invitesApiService = inject(InviteApiService);

  segmentView = signal<'myInvites' | 'acceptInvites'>('myInvites');
  myInvitesList = signal<MyInvites[]>([]);
  myGroupList = signal<GroupInvites[]>([]);

  
  
  constructor() {
    effect(()=>{
      if(this.segmentView() === 'myInvites'){
        this.loadMyInvites();
      }else{
        this.loadGroupInvites();
      }
    })
  }

  loadMyInvites() {
    this.invitesApiService.getMyInvites().subscribe(res => {
      this.myInvitesList.set(res);
    });
  }

  loadGroupInvites() {
    this.invitesApiService.getGroupInvites().subscribe(res => {
      this.myGroupList.set(res);
    });
  }

  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }
}
