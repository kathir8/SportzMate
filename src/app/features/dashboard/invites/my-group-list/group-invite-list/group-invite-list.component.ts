import { Component, effect, input } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { IonicVirtualScrollComponent } from 'src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component';
import { MateBasicComponent } from "../../../home/mate-stuff/mate-basic/mate-basic.component";
import { NoMateFoundComponent } from "../../../home/mate-stuff/no-mate-found/no-mate-found.component";
import { RequestedList } from '../../models/invite.model';

@Component({
  selector: 'app-group-invite-list',
  templateUrl: './group-invite-list.component.html',
  styleUrls: ['./group-invite-list.component.scss'],
  imports: [NoMateFoundComponent, MateBasicComponent, IonContent, IonicVirtualScrollComponent],
})
export class GroupInviteListComponent {

  responseList = input<RequestedList[]>([]);
  dynamicClass = input<string>('from-group-invite-list');

  constructor(){
    effect(() => {
      if (this.responseList()) {
        console.log(this.responseList());
      }
    });
  }
  trackById(index: number, item: RequestedList) {
    return item.id || index;
  }

  openMateDetail(item: RequestedList) {
    console.log(item);
  }
}
