import { Component, effect, EventEmitter, forwardRef, inject, Input, input, model, WritableSignal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { IonCheckbox } from '@ionic/angular/standalone';
import { SignalHost } from 'src/app/core/model/signal.model';
import { SignalService } from 'src/app/core/services/signal.service';

@Component({
  selector: 'ionic-checkbox',
  templateUrl: './ionic-checkbox.component.html',
  styleUrls: ['./ionic-checkbox.component.scss'],
  imports: [IonCheckbox],
  providers: [
    {
      provide: SignalHost,
      useExisting: forwardRef(() => IonicCheckboxComponent),
    }
  ]
})
export class IonicCheckboxComponent implements ControlValueAccessor {

    private readonly signalService = inject(SignalService);
  
  // inputs
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly labelPlacement = input<'start' | 'end' | 'fixed' | 'stack'>('end');

  // Internal value
  readonly value = model<boolean>(false);
  private signalValueChange = new EventEmitter<any>();
  readonly valueChange = new EventEmitter<any>();

   @Input() path?: string;
  @Input() source?: WritableSignal<any>;

  private isUpdatingFromSignal = false;

  // ControlValueAccessor callbacks
  private onChange: (value: boolean) => void = () => { };
  private onTouched: () => void = () => { };

  // -------- ControlValueAccessor methods --------
  writeValue(value: boolean): void {
    this.value.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

   constructor() {
    effect(() => {
      if (!this.path || !this.source) return;
      const value = this.signalService.getDeepValue(
        this.source(),
        this.path!
      );

      this.isUpdatingFromSignal = true;
      this.value.set(value);
      this.isUpdatingFromSignal = false;
    });
  }

  // -------- Event handlers --------
  onCheckboxChange(event: CustomEvent): void {
    const isChecked = event.detail.checked;
    this.value.set(isChecked);
    this.onChange(isChecked);
    this.onTouched();
    this.valueChange.emit(isChecked);
    this.signalValueChange.emit(isChecked);

  }

}
