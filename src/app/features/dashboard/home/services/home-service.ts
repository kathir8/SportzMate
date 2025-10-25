import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  range = signal<number>(3);
  segmentView = signal<'list' | 'map'>('list');

  updateRange(value: number) {
    this.range.set(value);
  }

  updateSegmentView(value: 'list' | 'map') {
    this.segmentView.set(value);
  }
}
