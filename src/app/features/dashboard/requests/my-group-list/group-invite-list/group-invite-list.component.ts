import { Component, input, signal } from '@angular/core';
import { IonicVirtualScrollComponent } from 'src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component';
import { NoMateFoundComponent } from "../../../home/mate-stuff/no-mate-found/no-mate-found.component";
import { RequestedList } from '../../models/requests.model';

@Component({
  selector: 'app-group-invite-list',
  templateUrl: './group-invite-list.component.html',
  styleUrls: ['./group-invite-list.component.scss'],
  imports: [NoMateFoundComponent, IonicVirtualScrollComponent],
})
export class GroupInviteListComponent {

  readonly responseList = input<RequestedList[]>([]);
  private readonly selectedMate = signal<RequestedList>({} as RequestedList);

  trackById(index: number, item: RequestedList) {
    return item.id || index;
  }

  acceptOrReject(accept: boolean) {
    setTimeout(() => {
      if (accept && this.selectedMate()) {
        console.log(this.selectedMate().name);
      }
    });
  }

  openMateDetail(item: RequestedList) {
    this.selectedMate.set(item);
  }
}
