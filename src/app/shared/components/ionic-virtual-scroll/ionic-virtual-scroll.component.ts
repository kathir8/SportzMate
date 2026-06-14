import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { IonGrid, IonList } from '@ionic/angular/standalone';
import { EventBasic } from '../../models/shared.model';
import { RequestedMember } from 'src/app/features/dashboard/home/mate-stuff/models/mate.model';
import { ChatDocument } from 'src/app/features/dashboard/chat-list/chat.model';

@Component({
  selector: 'ionic-virtual-scroll',
  templateUrl: './ionic-virtual-scroll.component.html',
  styleUrls: ['./ionic-virtual-scroll.component.scss'],
  imports: [CdkVirtualScrollViewport, ScrollingModule, IonList, IonGrid, NgTemplateOutlet],
})
export class IonicVirtualScrollComponent<T extends EventBasic | RequestedMember | ChatDocument> {

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
  readonly trackByFn = input<(index: number, item: any) => any>((index, item) => {
    // Default trackBy - works with EventBasic, RequestedMember
    if ('id' in item) return item.id;
    // Works with ChatDocument
    if ('chatId' in item) return item.chatId;
    // Fallback to index
    return index;
  });

  handleItemClick(item: any) {
    const fn = this.onItemClick();
    if (fn) {
      fn(item);
    }
  }

  getTrackByFn() {
    return this.trackByFn();
  }
}
