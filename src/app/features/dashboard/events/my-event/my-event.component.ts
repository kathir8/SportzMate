import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonFooter, IonTitle } from "@ionic/angular/standalone";
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonicAccordionComponent, IonicAccordionItem } from 'src/app/shared/components/ionic-accordion/ionic-accordion.component';
import { IonicButtonComponent } from "src/app/shared/components/ionic-button/ionic-button.component";
import { EventBasic } from 'src/app/shared/models/shared.model';
import { BottomSheetService } from 'src/app/shared/services/bottom-sheet.serivce';
import { EventDetailApiResp, RequestedMember } from '../../home/mate-stuff/models/mate.model';
import { HomeApiService } from '../../home/services/home-api-service';
import { MateDetailComponent } from '../../mate-detail/mate-detail.component';
import { MoreInvitesListComponent } from './more-invites-list/more-invites-list.component';
import { CancelEventComponent } from './cancel-event/cancel-event.component';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-my-event',
  templateUrl: './my-event.component.html',
  styleUrls: ['./my-event.component.scss'],
  imports: [IonicButtonComponent, IonicAccordionComponent, IonTitle, IonContent, IonFooter, HeaderComponent]

})
export class MyEventComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly bottomSheet = inject(BottomSheetService);
  private readonly homeApi = inject(HomeApiService);
  private readonly commonService = inject(CommonService);



  readonly mate = signal<EventBasic | null>(null);
  private readonly requestedMembers = signal<RequestedMember[]>([]);
  readonly headingText = signal<string>('');
  private readonly eventId = signal<number>(0);

  readonly accordionItems = computed<IonicAccordionItem[]>(() => [
    {
      value: 'sportsDetail',
      title: 'Sports Detail',
      component: MateDetailComponent,
      inputs: {
        mateInput: this.mate(),
        fromMyEvent: true
      }
    },
    {
      value: 'inviteDetail',
      title: 'More Invites',
      component: MoreInvitesListComponent,
      inputs: {
        responseList: this.requestedMembers()
      }
    }
  ]);


  constructor() {
    effect(() => {
      if (this.eventId()) {
        this.homeApi.getEventDetails(this.eventId()).subscribe((res: EventDetailApiResp) => {
          if (res.rspFlg) {
            // this.headingText.set(this.commonService.selectedSports(res.sportId)?.sportsName || '');
            this.mate.set(res.eventDetails);
            if (res.pendingRequests) {
              this.requestedMembers.set(res.joinRequests?.filter(x => x.approvalId === 1) || []);
            }
          } else {
            this.handleBack();
          }
        });
      }
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('eventId');
    if (idParam) {
      this.eventId.set(Number(idParam));
    } else {
      this.handleBack();
    }
  }

  handleBack() {
    this.router.navigate(['/dashboard/events']);
  }

  async cancelEvent() {
    await this.bottomSheet.open(CancelEventComponent, {
      componentProps: {
        eventId: this.eventId()
      }
    });
  }

}
