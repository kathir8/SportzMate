import { Component, effect, inject, input, signal } from '@angular/core';
import { SignalService } from 'src/app/core/services/signal.service';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { IonicVirtualScrollComponent } from 'src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component';
import { AcceptOrReject, RequestedMember } from '../../../home/mate-stuff/models/mate.model';
import { NoMateFoundComponent } from "../../../home/mate-stuff/no-mate-found/no-mate-found.component";
import { ProcessRequestApiResp } from '../../../requests/models/requests.model';
import { InviteApiService } from '../../../requests/services/invite-api-service';
import { InvitesMateBasicComponent } from "./invites-mate-basic/invites-mate-basic.component";

@Component({
  selector: 'app-more-invites-list',
  templateUrl: './more-invites-list.component.html',
  styleUrls: ['./more-invites-list.component.scss'],
  imports: [NoMateFoundComponent, IonicVirtualScrollComponent, InvitesMateBasicComponent],
})
export class MoreInvitesListComponent {

  readonly responseList = input<RequestedMember[]>([]);
  readonly displayList = signal<RequestedMember[]>([]);

  private readonly selectedMate = signal<RequestedMember>({} as RequestedMember);
  private readonly inviteApiService = inject(InviteApiService);
  private readonly toast = inject(IonicToastService);
  private readonly signalService = inject(SignalService);


  constructor() {
    effect(() => {
      if (this.responseList().length) {
        this.displayList.set(this.responseList());
      }
    })
  }

  trackById(index: number, item: RequestedMember) {
    return item.id || index;
  }

  acceptOrReject(payload: AcceptOrReject) {
    this.inviteApiService.ProcessJoinRequests(payload.item!, payload.accepted).subscribe((res: ProcessRequestApiResp) => {
      this.toast.show(res.rspMsg);
      if (res.rspFlg) {
        this.signalService.removeItemByKey(this.displayList, 'id', res.eventId);
      }
    });
  }

  openMateDetail(item: RequestedMember) {
    this.selectedMate.set(item);
  }
}
