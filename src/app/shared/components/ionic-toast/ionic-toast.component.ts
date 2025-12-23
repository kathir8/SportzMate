import { Component, effect, input, signal } from '@angular/core';
import { IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-toast',
  templateUrl: './ionic-toast.component.html',
  styleUrls: ['./ionic-toast.component.scss'],
  imports: [IonToast]
})
export class IonicToastComponent {

  readonly message = signal<string>('');
  readonly isOpen = signal(false);

  readonly duration = input<number>(2000);


  constructor() {
    effect(() => {
      const msg = this.message();
      this.isOpen.set(!!msg?.trim()?.length);
    });
  }

  show(msg: string) {
    this.message.set('');
    this.message.set(msg);
  }


}
