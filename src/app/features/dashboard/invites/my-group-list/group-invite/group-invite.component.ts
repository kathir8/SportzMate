import { Component, inject, input, OnInit } from '@angular/core';
import { IonCol, IonIcon, IonImg, IonLabel, IonRow, IonThumbnail } from '@ionic/angular/standalone';
import { GroupInvites } from '../../models/invite.model';
import { ActivatedRoute } from '@angular/router';
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { IonicBadgeComponent } from 'src/app/shared/components/ionic-badge/ionic-badge.component';

/**
 * Component for displaying and managing group invitations.
 * 
 * Handles the presentation of group invite details including group information,
 * invitation metadata, and user actions for accepting or rejecting invites.
 * 
 * @selector app-group-invite
 * @imports IonThumbnail, IonRow, IonCol, IonLabel, IonIcon, LocalTimePipe, IonicBadgeComponent, IonImg
 */
@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss'],
    imports: [IonThumbnail, IonRow, IonCol, IonLabel, IonIcon, LocalTimePipe, IonicBadgeComponent, IonImg]
  
})
export class GroupInviteComponent {

  private route = inject(ActivatedRoute);

  group = input<GroupInvites[]>([]);

  constructor() { }


  ngOnInit() {
    console.log("group-invite");
    
    const idParam = this.route.snapshot.paramMap.get('id');
  

  }

  acceptReject(){

  }

}
