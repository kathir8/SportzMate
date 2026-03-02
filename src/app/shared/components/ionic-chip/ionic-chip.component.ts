import { Component, computed, input, model, output } from '@angular/core';
import { IonChip } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-chip',
  templateUrl: './ionic-chip.component.html',
  styleUrls: ['./ionic-chip.component.scss'],
  imports: [IonChip]
})
export class IonicChipComponent {

  readonly color = input<
    'primary' | 'secondary' | 'tertiary' |
    'success' | 'danger' | 'warning' |
    'light' | 'medium' | 'dark'
  >('primary');

  readonly outline = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly dynamicClass = input<string>('');

  readonly ionClick = output<void>();

  readonly selected = model<boolean>(false);
  readonly selectedColor = input<string>('primary');


  readonly computedColor = computed(() =>
    this.selected() ? this.selectedColor() : this.color()
  );

  onClick(): void {
    if (!this.disabled()) {
      this.ionClick.emit();
    }
  }
}
