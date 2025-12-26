import { Component, effect, EventEmitter, forwardRef, inject, Input, input, model, output, WritableSignal } from '@angular/core';
import { IonInput, IonInputPasswordToggle, IonLabel } from '@ionic/angular/standalone';
import { SignalHost } from 'src/app/core/model/signal.model';
import { SignalService } from 'src/app/core/services/signal.service';

@Component({
  selector: 'ionic-input',
  templateUrl: './ionic-input.component.html',
  styleUrls: ['./ionic-input.component.scss'],
  imports: [IonLabel, IonInput, IonInputPasswordToggle],
   providers: [
    {
      provide: SignalHost,
    useExisting: forwardRef(() => IonicInputComponent)
    }
  ]
})
export class IonicInputComponent {

  private readonly signalService = inject(SignalService);


  // Signal Inputs
  readonly label = input('');
  readonly type = input<'text' | 'number' | 'email' | 'password'>('text');
  readonly dynamicClass = input('');
  readonly placeholder = input('');
  readonly readonly = input(false);
  readonly disabled = input(false);
  readonly clearInput = input(false);

  // Two-way signal (Model)
  readonly value = model<any>();
  private signalValueChange = new EventEmitter<any>();
  readonly valueChange = new EventEmitter<any>();
  readonly blur = output<void>();

  @Input() path?: string;
  @Input() source?: WritableSignal<any>;

  private isUpdatingFromSignal = false;


  private onChange = (v: any) => { };
  private onTouched = () => { };

  private writeValue(v: any) { this.value.set(v); }
  private registerOnChange(fn: any) { this.onChange = fn; }
  private registerOnTouched(fn: any) { this.onTouched = fn; }
 

  constructor(){
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

  onInputChange(event: CustomEvent) {
    if (this.isUpdatingFromSignal) return;
     const val = event.detail.value;
    this.value.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
    this.signalValueChange.emit(val);
  }

  onBlurEvent() {
    this.onTouched();
    this.blur.emit();
  }

}
