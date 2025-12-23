import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-checkbox',
  templateUrl: './ionic-checkbox.component.html',
  styleUrls: ['./ionic-checkbox.component.scss'],
  imports: [IonCheckbox],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonicCheckboxComponent),
      multi: true
    }
  ]
})
export class IonicCheckboxComponent implements ControlValueAccessor {

  // inputs
  label = input<string>('');
  disabled = input<boolean>(false);
  labelPlacement = input<'start' | 'end' | 'fixed' | 'stack'>('end');

  // Internal value
  checked = signal<boolean>(false);

  // ControlValueAccessor callbacks
  private onChange: (value: boolean) => void = () => { };
  private onTouched: () => void = () => { };

  // -------- ControlValueAccessor methods --------
  writeValue(value: boolean): void {
    this.checked.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }


  // -------- Event handlers --------
  onCheckboxChange(event: CustomEvent): void {
    const isChecked = event.detail.checked;
    this.checked.set(isChecked);
    this.onChange(isChecked);
    this.onTouched();
  }

}
