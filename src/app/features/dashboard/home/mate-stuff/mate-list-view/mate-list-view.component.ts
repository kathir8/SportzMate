import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { add } from 'ionicons/icons';
import { MateBasicComponent } from "../mate-basic/mate-basic.component";
import { MateListItem } from '../models/mate.model';
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";
import { MyInvites } from '../../../invites/models/invite.model';
import { IonicVirtualScrollComponent } from "src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component";

@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [NoMateFoundComponent, IonContent,  MateBasicComponent, IonicVirtualScrollComponent]
})
export class MateListViewComponent<T extends MateListItem | MyInvites> {
  private router = inject(Router);
  icons = { add };

  responseList = input<T[]>([]);
  dynamicClass = input<string>('from-mate-list');


  openMateDetail(item: T) {
    this.router.navigate(['dashboard/match', item.id, 'mate']);
  }

  trackById(index: number, item: T) {
    return item.id;
  }

}
