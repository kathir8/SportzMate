import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Component, input } from '@angular/core';
import { MateListItem } from 'src/app/features/dashboard/home/mate-stuff/models/mate.model';
import { MyInvites } from 'src/app/features/dashboard/invites/models/invite.model';
import { IonGrid, IonList } from '@ionic/angular/standalone';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ionic-virtual-scroll',
  templateUrl: './ionic-virtual-scroll.component.html',
  styleUrls: ['./ionic-virtual-scroll.component.scss'],
  imports: [CdkVirtualScrollViewport, ScrollingModule, IonList, IonGrid, NgTemplateOutlet],
})
export class IonicVirtualScrollComponent<T extends MateListItem | MyInvites> {

  constructor() { }

  dynamicListClass = input<string>('');
  dynamicGridClass = input<string>('');
  itemSize = input<number>(90);
  minBufferPx = input<number>(185);
  maxBufferPx = input<number>(365);

  items = input<T[]>([]);

  itemTemplate = input<any>();
  noDataTemplate = input<any>();

  onItemClick = input<(item: any) => void>();

  trackByFn = (_: number, item: any) => item.id;


  handleItemClick(item: any) {
    const fn = this.onItemClick();   // get function from signal
    if (fn) {
      fn(item);                      // invoke it correctly
    }
  }

}
