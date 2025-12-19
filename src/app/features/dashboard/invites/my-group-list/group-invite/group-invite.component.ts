import { Component, effect, inject, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/angular/standalone';
import { MateDetailComponent } from "../../../home/mate-stuff/mate-detail/mate-detail.component";
import { GroupDetail } from '../../models/invite.model';
import { InviteApiService } from '../../services/invite-api-service';
import { IonicButtonComponent } from "src/app/shared/components/ionic-button/ionic-button.component";

@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss'],
  imports: [IonLabel, IonAccordion, IonAccordionGroup, IonItem, MateDetailComponent, IonicButtonComponent]

})
export class GroupInviteComponent {

  private inviteApi = inject(InviteApiService);

  footerTemplate = viewChild<TemplateRef<unknown>>('footer');
  footerReady = output<TemplateRef<unknown>>();

  group = signal<GroupDetail>({} as GroupDetail);
  groupId = input<number>(0);
  headingName = output<string>();

  constructor() {
    effect(() => {
      if (this.groupId()) {

        this.inviteApi.getGroupDetailById(this.groupId()).subscribe((res) => {
          if (res) {
            this.group.set(res);
            this.headingName.emit(res.sport);
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    this.footerReady.emit(this.footerTemplate()!);
  }

}
