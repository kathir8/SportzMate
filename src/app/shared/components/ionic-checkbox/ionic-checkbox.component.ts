import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-checkbox',
  templateUrl: './ionic-checkbox.component.html',
  styleUrls: ['./ionic-checkbox.component.scss'],
  imports:[IonCheckbox],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonicCheckboxComponent),
      multi: true
    }
  ]
})
export class IonicCheckboxComponent implements ControlValueAccessor {

  @Input() label:string = '';                // Label text
  @Input() disabled:boolean = false;          // Disabled state
  @Input() labelPlacement:'start' | 'end' | 'fixed' | 'stack' = 'end';                // Label text

  @Output() blur = new EventEmitter<void>(); // Blur event

  value: boolean = false;             // Internal value

  // ControlValueAccessor callbacks
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  // -------- ControlValueAccessor methods --------
  writeValue(value: boolean): void {
    this.value = value ?? false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // -------- Event handlers --------
  onCheckboxChange(event: CustomEvent): void {
    const checked = event.detail.checked;
    this.value = checked;
    this.onChange(checked); // updates ngModel
  }

  onBlurEvent(): void {
    this.onTouched();
    this.blur.emit(); // emit blur for parent
  }

}
