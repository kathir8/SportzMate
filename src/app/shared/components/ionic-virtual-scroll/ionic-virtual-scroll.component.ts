import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Component, input } from '@angular/core';
import { MateListItem } from 'src/app/features/dashboard/home/mate-stuff/models/mate.model';
import { MyRequests, RequestedList } from 'src/app/features/dashboard/requests/models/requests.model';
import { IonGrid, IonList } from '@ionic/angular/standalone';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ionic-virtual-scroll',
  templateUrl: './ionic-virtual-scroll.component.html',
  styleUrls: ['./ionic-virtual-scroll.component.scss'],
  imports: [CdkVirtualScrollViewport, ScrollingModule, IonList, IonGrid, NgTemplateOutlet],
})
export class IonicVirtualScrollComponent<T extends MateListItem | MyRequests | RequestedList> {

  constructor() { }

  readonly dynamicListClass = input<string>('');
  readonly dynamicGridClass = input<string>('');
  readonly itemSize = input<number>(90);
  readonly minBufferPx = input<number>(185);
  readonly maxBufferPx = input<number>(365);

  readonly items = input<T[]>([]);

  readonly itemTemplate = input<any>();
  readonly noDataTemplate = input<any>();

  readonly onItemClick = input<(item: any) => void>();

  trackByFn = (_: number, item: any) => item.id;


  handleItemClick(item: any) {
    const fn = this.onItemClick();   // get function from signal
    if (fn) {
      fn(item);                      // invoke it correctly
    }
  }

}
