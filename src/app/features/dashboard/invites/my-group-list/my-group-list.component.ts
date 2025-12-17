import { Component, inject, input } from '@angular/core';
import { GroupInvites } from '../models/invite.model';
import { IonContent } from '@ionic/angular/standalone';
import { IonicVirtualScrollComponent } from "src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component";
import { Router } from '@angular/router';
import { MateBasicComponent } from "../../home/mate-stuff/mate-basic/mate-basic.component";
import { NoMateFoundComponent } from "../../home/mate-stuff/no-mate-found/no-mate-found.component";

@Component({
  selector: 'app-my-group-list',
  templateUrl: './my-group-list.component.html',
  styleUrls: ['./my-group-list.component.scss'],
  imports: [IonContent, IonicVirtualScrollComponent, MateBasicComponent, NoMateFoundComponent]
})
export class MyGroupListComponent {
  private router = inject(Router);


  responseList = input<GroupInvites[]>([]);

  constructor() { }

  openGroup(item:GroupInvites) {
    this.router.navigate(['dashboard/invites/group', item.id]);

    console.log("grp");
  }

}
