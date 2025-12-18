import { Component, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/angular/standalone';
import { MateDetailComponent } from "../../../home/mate-stuff/mate-detail/mate-detail.component";
import { GroupDetail } from '../../models/invite.model';
import { InviteApiService } from '../../services/invite-api-service';

@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss'],
  imports: [IonLabel, IonAccordion, IonAccordionGroup, IonItem, MateDetailComponent]

})
export class GroupInviteComponent {

  private route = inject(ActivatedRoute);
  private inviteApi = inject(InviteApiService);

  group = signal<GroupDetail>({} as GroupDetail);
  groupId = input<number | null>(null);

  constructor() {
    effect(() => {
      if (this.groupId()) {

        this.inviteApi.getGroupDetailById(this.groupId()).subscribe((res) => {
          if (res) {
            this.group.set(res);
          }
        });
      }
    });
  }

}
