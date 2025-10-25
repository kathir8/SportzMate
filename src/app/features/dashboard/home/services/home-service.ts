import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  rangeKm = signal<number>(3500);

  updateRange(value: number) {
    this.rangeKm.set(value);
  }
}
