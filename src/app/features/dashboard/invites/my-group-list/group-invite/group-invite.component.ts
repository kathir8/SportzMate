import { Component, computed, effect, inject, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { IonicAccordionComponent, IonicAccordionItem } from 'src/app/shared/components/ionic-accordion/ionic-accordion.component';
import { IonicButtonComponent } from "src/app/shared/components/ionic-button/ionic-button.component";
import { MateDetailComponent } from "../../../home/mate-stuff/mate-detail/mate-detail.component";
import { GroupDetail, RequestedList } from '../../models/invite.model';
import { InviteApiService } from '../../services/invite-api-service';
import { GroupInviteListComponent } from '../group-invite-list/group-invite-list.component';

@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss'],
  imports: [IonicButtonComponent, IonicAccordionComponent]

})
export class GroupInviteComponent {

  private readonly inviteApi = inject(InviteApiService);

  private readonly footerTemplate = viewChild<TemplateRef<unknown>>('footer');
  footerReady = output<TemplateRef<unknown>>();

  group = signal<GroupDetail>({} as GroupDetail);
  requestedMembers = signal<RequestedList[]>([]);
  groupId = input<number>(0);
  headingName = output<string>();


  accordionItems = computed<IonicAccordionItem[]>(() => [
    {
      value: 'sportsDetail',
      title: 'Sports Detail',
      component: MateDetailComponent,
      inputs: {
        mate: this.group()
      }
    },
    {
      value: 'inviteDetail',
      title: 'More Invites',
      component: GroupInviteListComponent,
      inputs: {
        responseList: this.requestedMembers()
      }
    }
  ]);

  constructor() {
    effect(() => {
      if (this.groupId()) {

        this.inviteApi.getGroupDetailById(this.groupId()).subscribe((res) => {
          if (res) {
            this.group.set(res);
            this.requestedMembers.set(res.requestedMembers);
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
