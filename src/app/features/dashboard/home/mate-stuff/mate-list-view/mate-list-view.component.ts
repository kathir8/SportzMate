import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { add } from 'ionicons/icons';
import { IonicVirtualScrollComponent } from "src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component";
import { MyRequests, RequestedList } from '../../../requests/models/requests.model';
import { MateBasicComponent } from "../mate-basic/mate-basic.component";
import { MateListItem } from '../models/mate.model';
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";

@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [NoMateFoundComponent, IonContent,  MateBasicComponent, IonicVirtualScrollComponent]
})
export class MateListViewComponent<T extends MateListItem | MyRequests> {
  private readonly router = inject(Router);
  readonly icons = { add };

  private readonly selectedMate = signal<RequestedList>({} as RequestedList);

  dynamicClass = input<string>('from-mate-list');
  readonly responseList = input<T[]>([]);

  openMateDetail(item: T) {
    this.router.navigate(['dashboard/match', item.id, 'mate']);
  }

  trackById(index: number, item: T) {
    return item.id || index;
  }

   acceptOrReject(payload: { accepted: boolean; event: MouseEvent }) {
     payload.event.stopPropagation();
    setTimeout(() => {
      if (payload.accepted && this.selectedMate()) {
        console.log(this.selectedMate().name);
      }
    });
  }

}
