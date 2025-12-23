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
  color = input<'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning' | 'light' | 'medium' | 'dark'>('primary');

  expand = input<'full' | 'block' | 'default'>('block');

  size = input<'small' | 'default' | 'large'>('default');

  disabled = input<boolean>(false);

  fill = input<'clear' | 'outline' | 'solid'>('solid');

  type = input<'button' | 'submit' | 'reset'>('button');

  shape = input<'round' | 'default'>('default');

  dynamicClass = input<string>('');

  /* ------------------------------------
   Output Event (Child → Parent)
  ------------------------------------- */
  ionClick = output<void>();

  /* ------------------------------------
   Click handler
  ------------------------------------- */
  onClick(): void {
    if (!this.disabled()) {
      this.ionClick.emit();
    }
  }
}
