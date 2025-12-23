import { Injectable, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignalService {

  getDeepValue<T>(source: T, path: string, defaultValue: any = ''): any {

   const data = (typeof source === 'function') ? (source as any)() : source;
    if (!data) return defaultValue;
    const value = path.split('.').reduce((acc, key) => (acc as any)?.[key], data);
    return value !== undefined && value !== null ? value : defaultValue;
  }

  updateDeepValue<T extends object>(
    signal: WritableSignal<T>,
    path: string,
    value: any
  ): void {
    signal.update((prev) => {
      // 1. Shallow clone the root state
      const newState = { ...prev };
      const keys = path.split('.');
      let current: any = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        // 2. The critical step: Clone the existing level if it exists, 
        // otherwise start a new object. This preserves "home" when updating "pincode".
        current[key] = current[key] ? { ...current[key] } : {};

        // 3. Move deeper into the tree
        current = current[key];
      }

      // 4. Final leaf assignment
      current[keys[keys.length - 1]] = value;

      return newState;
    });
  }
}
