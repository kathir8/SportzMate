import { Injectable } from '@angular/core';
import { IonicToastComponent } from './ionic-toast.component';

@Injectable({
  providedIn: 'root',
})
export class IonicToastService {
  private toast!: IonicToastComponent;

  register(t: IonicToastComponent) {
    this.toast = t;
  }

  show(message: string) {
    this.toast.show(message);
  }
}
