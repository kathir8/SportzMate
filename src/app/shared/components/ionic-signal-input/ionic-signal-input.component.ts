import { Component, input, model, output } from '@angular/core';
import { IonInput, IonInputPasswordToggle, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-signal-input',
  templateUrl: './ionic-signal-input.component.html',
  styleUrls: ['./ionic-signal-input.component.scss'],
  imports: [IonLabel, IonInput, IonInputPasswordToggle],

})
export class IonicSignalInputComponent {

  // Signal Inputs
  label = input('');
  type = input<'text' | 'number' | 'email' | 'password'>('text');
  dynamicClass = input({});
  placeholder = input('');
  readonly = input(false);
  disabled = input(false);
  clearInput = input(false);

  // Two-way signal (Model)
  value = model<any>(null);
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
