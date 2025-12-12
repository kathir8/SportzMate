import { Component, inject, input, OnInit } from '@angular/core';
import { MyInvites } from '../models/invite.model';
import { IonContent } from '@ionic/angular/standalone';
import { IonicVirtualScrollComponent } from "src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-group-list',
  templateUrl: './my-group-list.component.html',
  styleUrls: ['./my-group-list.component.scss'],
  imports: [IonContent, IonicVirtualScrollComponent]
})
export class MyGroupListComponent {
  private router = inject(Router);


  responseList = input<MyInvites[]>([]);

  constructor() { }

  openGroup(item:MyInvites) {
    this.router.navigate(['dashboard/invites/group', item.id]);

    console.log("grp");
  }

}
