import { Component, input, model, output } from '@angular/core';
import { IonInput, IonInputPasswordToggle, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-input',
  templateUrl: './ionic-input.component.html',
  styleUrls: ['./ionic-input.component.scss'],
  imports: [IonLabel, IonInput, IonInputPasswordToggle],

})
export class IonicInputComponent {

  // Signal Inputs
  label = input('');
  type = input<'text' | 'number' | 'email' | 'password'>('text');
  dynamicClass = input('');
  placeholder = input('');
  readonly = input(false);
  disabled = input(false);
  clearInput = input(false);

  // Two-way signal (Model)
  value = model.required<any>();
  blur = output<void>();

  onChange = (v: any) => { };
  onTouched = () => { };

  writeValue(v: any) { this.value.set(v); }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }

  onInputChange(event: any) {
    const val = event.detail.value;
    this.value.set(val);
    this.onChange(val);
  }

  onBlurEvent() {
    this.onTouched();
    this.blur.emit();
  }

}
