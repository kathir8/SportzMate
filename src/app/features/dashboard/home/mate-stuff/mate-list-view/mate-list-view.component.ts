import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { add } from 'ionicons/icons';
import { IonicVirtualScrollComponent } from "src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component";
import { EventBasic } from 'src/app/shared/models/shared.model';
import { JoinRequests, ProcessRequestApiResp, RequestedList, Requests } from '../../../requests/models/requests.model';
import { MateBasicComponent } from "../mate-basic/mate-basic.component";
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";
import { AcceptOrReject } from '../models/mate.model';
import { InviteApiService } from '../../../requests/services/invite-api-service';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { SignalService } from 'src/app/core/services/signal.service';

@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [NoMateFoundComponent, IonContent, MateBasicComponent, IonicVirtualScrollComponent]
})
export class MateListViewComponent<T extends Requests | EventBasic> {
  private readonly router = inject(Router);
  private readonly toast = inject(IonicToastService);
  private readonly inviteApiService = inject(InviteApiService);
  private readonly signalService = inject(SignalService);
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
      }
    })
  }

  openMateDetail(item: T) {
    if (this.fromMyEvents()) {
      this.router.navigate(['dashboard/events', item.eventIdPk]);
    } else {
      this.router.navigate(['dashboard/match', item.eventIdPk, this.showInterestBtn()]);
    }
  }

  trackById(index: number, item: T) {
    return item.eventIdPk || index;
  }

  acceptOrReject(payload: AcceptOrReject) {
    payload.event.stopPropagation();
    this.inviteApiService.ProcessJoinRequests(payload.item, payload.accepted).subscribe((res: ProcessRequestApiResp) => {
      this.toast.show(res.rspMsg);
      if (res.rspFlg) {
        this.signalService.removeItemByKey(this.displayList, 'eventIdPk', res.eventId);
      }
    });
  }

}
