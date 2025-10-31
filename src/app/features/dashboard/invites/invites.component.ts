import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonIcon, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel } from '@ionic/angular/standalone';
import { MateListViewComponent } from "../home/mate-stuff/mate-list-view/mate-list-view.component";
import { MyInvites } from './models/invite.model';
import { InvitesApiService } from './services/invites-api-service';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss'],
  imports: [IonContent, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonLabel, FormsModule, MateListViewComponent]
})
export class InvitesComponent {
  private router = inject(Router);
  private invitesApiService = inject(InvitesApiService);

  segmentView = signal<'myInvites' | 'approveInvites'>('myInvites');
  myInvitesList = signal<MyInvites[]>([]);



  constructor() {
    this.loadMyInvites();
  }

  loadMyInvites() {
    this.invitesApiService.getMyInvites().subscribe(res => {
      this.myInvitesList.set(res);
    });
  }

  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }
}
