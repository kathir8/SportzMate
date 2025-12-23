import { Component, input, output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-button',
  imports: [IonButton],
  templateUrl: './ionic-button.component.html',
  styleUrls: ['./ionic-button.component.scss']
})
export class IonicButtonComponent {

  /* ------------------------------------
   Configuration Inputs (Parent → Child)
  ------------------------------------- */
  readonly color = input<'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning' | 'light' | 'medium' | 'dark'>('primary');

  readonly expand = input<'full' | 'block' | 'default'>('block');

  readonly size = input<'small' | 'default' | 'large'>('default');

  readonly disabled = input<boolean>(false);

  readonly fill = input<'clear' | 'outline' | 'solid'>('solid');

  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly shape = input<'round' | 'default'>('default');

  readonly dynamicClass = input<string>('');

  /* ------------------------------------
   Output Event (Child → Parent)
  ------------------------------------- */
  readonly ionClick = output<void>();

  /* ------------------------------------
   Click handler
  ------------------------------------- */
  onClick(): void {
    if (!this.disabled()) {
      this.ionClick.emit();
    }
  }
}
