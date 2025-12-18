import { Component, inject, input, signal } from '@angular/core';
import { GroupInvites } from '../models/invite.model';
import { IonContent } from '@ionic/angular/standalone';
import { IonicVirtualScrollComponent } from "src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component";
import { Router } from '@angular/router';
import { MateBasicComponent } from "../../home/mate-stuff/mate-basic/mate-basic.component";
import { NoMateFoundComponent } from "../../home/mate-stuff/no-mate-found/no-mate-found.component";
import { MateDetailContainerComponent } from "../../home/mate-stuff/mate-detail-container/mate-detail-container.component";

@Component({
  selector: 'app-my-group-list',
  templateUrl: './my-group-list.component.html',
  styleUrls: ['./my-group-list.component.scss'],
  imports: [IonContent, IonicVirtualScrollComponent, MateBasicComponent, NoMateFoundComponent, MateDetailContainerComponent]
})
export class MyGroupListComponent {
  private router = inject(Router);


  responseList = input<GroupInvites[]>([]);
  showGroupInfo  = signal<boolean>(false);
  groupId = signal<number | null>(null);

  constructor() { }

  openGroup(item:GroupInvites) {
    this.groupId.set(item.id);
    this.showGroupInfo.set(true);
    // this.router.navigate(['dashboard/invites/group', item.id]);

    console.log("grp");
  }

}
