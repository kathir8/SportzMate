import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonLabel, IonInput, IonInputPasswordToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-input',
  templateUrl: './ionic-input.component.html',
  styleUrls: ['./ionic-input.component.scss'],
  imports: [IonLabel, IonInput, IonInputPasswordToggle],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonicInputComponent),
      multi: true
    }
  ]
})
export class IonicInputComponent<T extends string | number = string> implements ControlValueAccessor {

  @Input() label = '';
  @Input() type: 'text' | 'number' | 'email' | 'password' = 'text';
  @Input() dynamicClass = {};
  @Input() placeholder: string = '';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() clearInput: boolean = false;

  @Output() blur = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<T>();

  value: T | null = null;

  // ControlValueAccessor methods
  private onChange: (value: T | null) => void = () => { };
  private onTouched = () => { };

  writeValue(value: T | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // optional
  }

  onInputChange(event: CustomEvent): void {
    const value = (event.detail.value ?? '') as unknown as T;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onBlurEvent(): void {
    this.onTouched();
    this.blur.emit(); // emit blur event for parent
  }

}
