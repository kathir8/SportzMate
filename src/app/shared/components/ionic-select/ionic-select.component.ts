import { Component, input, model, output } from '@angular/core';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { IonicSelectOption } from './select-option.mapper';


@Component({
  selector: 'ionic-select',
  templateUrl: './ionic-select.component.html',
  styleUrls: ['./ionic-select.component.scss'],
  imports: [IonSelect, IonSelectOption],
})
export class IonicSelectComponent<T extends string | number> {

  readonly options = input<ReadonlyArray<IonicSelectOption<T>>>([]);
  readonly placeholder = input<string>('Select');
  readonly interfaceType = input<'popover' | 'alert' | 'action-sheet'>('popover');
  readonly disabled = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly hideArrow = input<boolean>(false);

  /* -------------------- internal state -------------------- */

  readonly value = model<T | null>(null);

  /* -------------------- outputs -------------------- */

  readonly valueChange = output<T>();
  readonly cancelled = output<void>();
  readonly dismissed = output<void>();

  /* -------------------- handlers -------------------- */

  onValueChange(value: T): void {
    this.value.set(value);
    this.valueChange.emit(value);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onDismiss(): void {
    this.dismissed.emit();
  }

}
