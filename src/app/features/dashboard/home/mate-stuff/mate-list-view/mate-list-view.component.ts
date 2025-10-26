import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonList } from '@ionic/angular/standalone';
import { add } from 'ionicons/icons';
import { MateBasicComponent } from "../mate-basic/mate-basic.component";
import { MateListItem } from '../models/mate.model';
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";

@Component({
  selector: 'app-mate-list-view',
  templateUrl: './mate-list-view.component.html',
  styleUrls: ['./mate-list-view.component.scss'],
  imports: [IonList, IonGrid, NoMateFoundComponent, IonContent, CdkVirtualScrollViewport, ScrollingModule, MateBasicComponent]
})
export class MateListViewComponent {
  private router = inject(Router);
  icons = { add };

  visiblePlayers = input<MateListItem[]>([]);

  openMateDetail(id: number) {
    // Pass the ID or name in the route parameter
    this.router.navigate(['dashboard/mate-detail', id]);
  }

    trackById(index: number, item: MateListItem) {
    return item.id;
  }

}
