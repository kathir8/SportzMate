import { Component, input, output } from '@angular/core';
import { IonAlert } from '@ionic/angular/standalone';
import type { AlertButton, OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'ionic-alert',
  templateUrl: './ionic-alert.component.html',
  styleUrls: ['./ionic-alert.component.scss'],
  imports: [IonAlert],
})
export class IonicAlertComponent {

   readonly isOpen = input<boolean>(false);
  readonly heading = input<string>('Alert');
  readonly buttons = input<ReadonlyArray<AlertButton>>([]);

  // ---------- Output ----------
  readonly dismissed = output<OverlayEventDetail>();

  // ---------- Methods ----------
  onDismiss(event: CustomEvent<OverlayEventDetail>): void {
    this.dismissed.emit(event.detail);
  }

}
