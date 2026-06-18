import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { add } from 'ionicons/icons';
import { SignalService } from 'src/app/core/services/signal.service';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { IonicVirtualScrollComponent } from "src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component";
import { EventBasic } from 'src/app/shared/models/shared.model';
import { ProcessRequestApiResp, Requests } from '../../../requests/models/requests.model';
import { InviteApiService } from '../../../requests/services/invite-api-service';
import { MateBasicComponent } from "../mate-basic/mate-basic.component";
import { AcceptOrReject } from '../models/mate.model';
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";
import { CommonStore } from 'src/app/core/stores/common-store';
import { MateService } from '../mate.service';
import { ChatService } from '../../../chat-list/chat.service';

@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [NoMateFoundComponent, IonContent, MateBasicComponent, IonicVirtualScrollComponent]
})
export class MateListViewComponent<T extends Requests | EventBasic> {
  private readonly router = inject(Router);
  private readonly toast = inject(IonicToastService);
  private readonly chatService = inject(ChatService);
  private readonly inviteApiService = inject(InviteApiService);
  private readonly signalService = inject(SignalService);
  private readonly commonStore = inject(CommonStore);
  private readonly mateService = inject(MateService);

  readonly icons = { add };
  showInterestBtn = input<boolean>(true);

  dynamicClass = input<string>('from-mate-list');
  fromMyEvents = input<boolean>(false);
  readonly responseList = input<T[]>([]);
  readonly displayList = signal<T[]>([]);

  constructor() {
    effect(() => {
      if (this.responseList()?.length) {
        this.signalService.setList(this.displayList, this.responseList())
      }else{
        this.signalService.setList(this.displayList, [])
      }
    })

    effect(() => {
      const uniqueActionId = this.commonStore.uniqueActionId();
      if (!uniqueActionId) return;

      const [key, value] = Object.entries(uniqueActionId)[0] as [ keyof T, T[keyof T] ];

      if (this.displayList()?.length) {
        this.signalService.removeItemByKey(this.displayList, key, value);
      }

      this.commonStore.clearUniqueActionIdId();
    })

  }

  openMateDetail(item: T) {
    if (this.fromMyEvents()) {
      this.router.navigate(['dashboard/my-events', item.eventId]);
    } else {
      if ('status' in item) {
        this.mateService.currentMateStatusForEvent.set(item.status);
      }
      this.router.navigate(
        ['dashboard/mate-detail', item.eventId],
        {
          state: {
            fromPage: this.dynamicClass(),
            showInterestBtn: this.showInterestBtn(),
            approvalId: item.approvalId
          }
        }
      );
    }
  }

  trackById(index: number, item: T) {
    return item.eventId || index;
  }

  acceptOrReject(payload: AcceptOrReject) {
    payload.event.stopPropagation();
    this.inviteApiService.ProcessJoinRequests(payload.item!, payload.accepted).subscribe((res: ProcessRequestApiResp) => {
      if (res.rspFlg) {
        this.signalService.removeItemByKey(this.displayList, 'approvalId', payload.item!.approvalId);
      }
    });
  }

}
