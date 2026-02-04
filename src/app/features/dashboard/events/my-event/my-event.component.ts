import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonFooter, IonTitle } from "@ionic/angular/standalone";
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonicAccordionComponent, IonicAccordionItem } from 'src/app/shared/components/ionic-accordion/ionic-accordion.component';
import { IonicButtonComponent } from "src/app/shared/components/ionic-button/ionic-button.component";
import { BottomSheetService } from 'src/app/shared/services/bottom-sheet.serivce';
import { MateDetail } from '../../home/mate-stuff/models/mate.model';
import { RequestedList } from '../../requests/models/requests.model';
import { GroupInviteListComponent } from '../../requests/my-group-list/group-invite-list/group-invite-list.component';
import { CancelEventComponent } from './cancel-event/cancel-event.component';
import { MateDetailComponent } from '../../mate-detail/mate-detail.component';

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

  readonly mate = signal<MateDetail | null>(null);
  private readonly requestedMembers = signal<RequestedList[]>([]);
  readonly headingText = signal<string>('');
  private readonly eventId = signal<number>(0);

  readonly accordionItems = computed<IonicAccordionItem[]>(() => [
    {
      value: 'sportsDetail',
      title: 'Sports Detail',
      component: MateDetailComponent,
      inputs: {
        fromMyEvent: this.eventId()
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

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
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
