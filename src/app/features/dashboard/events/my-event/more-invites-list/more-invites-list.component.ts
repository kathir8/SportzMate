import { Component, effect, inject, input, signal } from '@angular/core';
import { SignalService } from 'src/app/core/services/signal.service';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { IonicVirtualScrollComponent } from 'src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component';
import { AcceptOrReject, RequestedMember } from '../../../home/mate-stuff/models/mate.model';
import { AcceptReject } from '../../../requests/models/requests.model';
import { NoMateFoundComponent } from "../../../home/mate-stuff/no-mate-found/no-mate-found.component";
import { ProcessRequestApiResp } from '../../../requests/models/requests.model';
import { InviteApiService } from '../../../requests/services/invite-api-service';
import { InvitesMateBasicComponent } from "./invites-mate-basic/invites-mate-basic.component";
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";

@Component({
  selector: 'app-more-invites-list',
  templateUrl: './more-invites-list.component.html',
  styleUrls: ['./more-invites-list.component.scss'],
  imports: [NoMateFoundComponent, IonicVirtualScrollComponent, InvitesMateBasicComponent, IonicChipComponent],
})
export class MoreInvitesListComponent {
  readonly AcceptReject = AcceptReject; // expose enum to template

  private readonly inviteApiService = inject(InviteApiService);
  private readonly toast = inject(IonicToastService);
  private readonly signalService = inject(SignalService);

  /** incoming data from parent */
  readonly responseList = input<RequestedMember[]>([]);
  readonly displayList = signal<RequestedMember[]>([]);

  /** status filters used by the chips */
  readonly filters = signal<{label: string, status: AcceptReject}[]>([
    { label: 'Pending', status: AcceptReject.Pending },
    { label: 'Active', status: AcceptReject.Accepted },
    { label: 'Rejected', status: AcceptReject.Rejected }
  ] as const);

  /** currently selected status */
  readonly selectedFilter = signal<AcceptReject>(AcceptReject.Pending);

  private readonly selectedMate = signal<RequestedMember>({} as RequestedMember);

  constructor() {
    effect(() => {
      const resp = this.responseList();
      const filter = this.selectedFilter();
      if (resp.length) {
        this.displayList.set(resp.filter(r => r.status === filter));
      } else {
        this.displayList.set([]);
      }
    });
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

  setFilter(status: AcceptReject): void {
    this.selectedFilter.set(status);
  }
}
