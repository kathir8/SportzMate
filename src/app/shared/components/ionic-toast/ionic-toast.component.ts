import { Component, effect, Input, signal } from '@angular/core';
import { IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-toast',
  templateUrl: './ionic-toast.component.html',
  styleUrls: ['./ionic-toast.component.scss'],
  imports: [IonToast]
})
export class IonicToastComponent {

  message = signal<string>('');
  isOpen = signal(false);

  @Input() duration = 3000;
  constructor() {
    effect(() => {
      const msg = this.message();
      this.isOpen.set(!!msg?.trim()?.length);
    });

  }


  show(msg: string) {
    this.message.set(msg);
  }


}
