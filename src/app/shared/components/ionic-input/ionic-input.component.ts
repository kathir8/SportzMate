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
  readonly label = input('');
  readonly type = input<'text' | 'number' | 'email' | 'password'>('text');
  readonly dynamicClass = input('');
  readonly placeholder = input('');
  readonly readonly = input(false);
  readonly disabled = input(false);
  readonly clearInput = input(false);

  // Two-way signal (Model)
  readonly value = model.required<any>();
  readonly blur = output<void>();

  private onChange = (v: any) => { };
  private onTouched = () => { };

  private writeValue(v: any) { this.value.set(v); }
  private registerOnChange(fn: any) { this.onChange = fn; }
  private registerOnTouched(fn: any) { this.onTouched = fn; }

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
