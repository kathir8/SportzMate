import { Component, input } from '@angular/core';
import { IonBadge } from '@ionic/angular/standalone';
@Component({
  selector: 'ionic-badge',
  templateUrl: './ionic-badge.component.html',
  styleUrls: ['./ionic-badge.component.scss'],
  imports: [IonBadge]
})
export class IonicBadgeComponent {

  readonly dynamicClass = input<string>('');

}
