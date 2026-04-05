import { Component, effect, inject, input, signal } from '@angular/core';
import { SignalService } from 'src/app/core/services/signal.service';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { IonicVirtualScrollComponent } from 'src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component';
import { StatusFilterComponent } from "src/app/shared/components/status-filter/status-filter.component";
import { AcceptOrReject, RequestedMember } from '../../../home/mate-stuff/models/mate.model';
import { NoMateFoundComponent } from "../../../home/mate-stuff/no-mate-found/no-mate-found.component";
import { AcceptReject, ProcessRequestApiResp } from '../../../requests/models/requests.model';
import { InviteApiService } from '../../../requests/services/invite-api-service';
import { InvitesMateBasicComponent } from "./invites-mate-basic/invites-mate-basic.component";
import { ChatService } from '../../../chat-list/chat/chat.service';

@Component({
  selector: 'app-more-invites-list',
  templateUrl: './more-invites-list.component.html',
  styleUrls: ['./more-invites-list.component.scss'],
  imports: [NoMateFoundComponent, IonicVirtualScrollComponent, InvitesMateBasicComponent, StatusFilterComponent],
})
export class MoreInvitesListComponent {
  readonly AcceptReject = AcceptReject; // expose enum to template

  private readonly inviteApiService = inject(InviteApiService);
  private readonly toast = inject(IonicToastService);
  private readonly signalService = inject(SignalService);
  private readonly chatService = inject(ChatService);

  /** incoming data from parent */
  readonly responseList = input<RequestedMember[]>([]);
  readonly displayList = signal<RequestedMember[]>([]);

  private readonly selectedMate = signal<RequestedMember>({} as RequestedMember);

  constructor() {
    effect(() => {
      this.onFilterChange();
    });
  }


  acceptOrReject(payload: AcceptOrReject) {
    this.inviteApiService.ProcessJoinRequests(payload.item!, payload.accepted).subscribe((res: ProcessRequestApiResp) => {
      this.toast.show(res.rspMsg);
      if (res.rspFlg) {
        this.selectedMate().status = payload.accepted ? AcceptReject.Accepted : AcceptReject.Rejected;
        if(payload.accepted){
          // this.chatService.handleGroupCreationAfterAccept(res);
        }
      }
    });
  }

  openMateDetail(item: RequestedMember) {
    this.selectedMate.set(item);
  }

  onFilterChange(filter: AcceptReject = AcceptReject.Pending) {
    const resp = this.responseList();
    if (resp.length) {
      this.displayList.set(resp.filter(r => r.status === filter));
    } else {
      this.displayList.set([]);
    }
  }

}
