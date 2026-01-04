import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { IonicVirtualScrollComponent } from "src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component";
import { MateBasicComponent } from "../../home/mate-stuff/mate-basic/mate-basic.component";
import { NoMateFoundComponent } from "../../home/mate-stuff/no-mate-found/no-mate-found.component";
import { JoinRequests } from '../models/requests.model';

@Component({
  selector: 'app-my-group-list',
  templateUrl: './my-group-list.component.html',
  styleUrls: ['./my-group-list.component.scss'],
  imports: [IonContent, IonicVirtualScrollComponent, MateBasicComponent, NoMateFoundComponent]
})
export class MyGroupListComponent {
  private readonly router = inject(Router);

  readonly responseList = input<JoinRequests[]>([]);

  openGroup(item: JoinRequests) {
    this.router.navigate(['dashboard/match', item.id, 'group']);
  }

}
