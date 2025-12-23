import { Component, input, output } from '@angular/core';
import { IonChip } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-chip',
  templateUrl: './ionic-chip.component.html',
  styleUrls: ['./ionic-chip.component.scss'],
  imports: [IonChip]
})
export class IonicChipComponent {

  color = input<
    'primary' | 'secondary' | 'tertiary' |
    'success' | 'danger' | 'warning' |
    'light' | 'medium' | 'dark'
  >('primary');

  outline = input<boolean>(false);
  disabled = input<boolean>(false);

  dynamicClass = input<string>('');

  ionClick = output<void>();

  onClick(): void {
    if (!this.disabled()) {
      this.ionClick.emit();
    }
  }
}
