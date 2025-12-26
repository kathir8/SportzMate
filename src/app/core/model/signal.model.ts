import { InjectionToken, EventEmitter } from '@angular/core';
import { WritableSignal } from '@angular/core';

export interface SignalHost {
  signalValue: WritableSignal<any>;
  signalValueChange: EventEmitter<any>;
}

export const SignalHost = new InjectionToken<SignalHost>('SignalHost');