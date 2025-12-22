import { Injectable, WritableSignal } from '@angular/core';
type KeyOf<T> = Extract<keyof T, string>;

@Injectable({
  providedIn: 'root',
})
export class SignalService {

  updateField<T extends object, K extends KeyOf<T>>(
    signal: WritableSignal<T>,
    key: K,
    value: T[K]
  ): void {
    signal.update(prev => ({
      ...prev,
      [key]: value
    }));
  }

  updateNestedField<
    T extends object,
    G extends KeyOf<T>,
    K extends KeyOf<NonNullable<T[G]>>
  >(
    signal: WritableSignal<T>,
    group: G,
    key: K,
    value: NonNullable<T[G]>[K]
  ): void {
    signal.update(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] as NonNullable<T[G]>),
        [key]: value
      }
    }));
  }
}
