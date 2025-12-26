import { Injectable, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignalService {

   updateDeepValue<T extends object, P extends string>(
    signal: WritableSignal<T>,
    path: P,
    value: any
  ): void {
    signal.update((prev) => {
      const root = { ...prev };
      const keys = path.split('.');
      let current: any = root;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = current[key] ? { ...current[key] } : {};
        current = current[key];
      }

      // Assign the type-safe value
      current[keys[keys.length - 1]] = value;
      return root;
    });
  }

  getDeepValue<T>(obj: T, path: string='', defaultValue: any = ''): any {
    if (!obj) return defaultValue;
    const value = path.split('.').reduce((acc, key) => (acc as any)?.[key], obj);
    return value !== undefined && value !== null ? value : defaultValue;
  }

  patchSignal<T extends object | null>(
    signal: WritableSignal<T>,
    patches: Record<string, any>
  ) {
    signal.update(prev => {
      if (!prev) return prev;
      const root: any = structuredClone(prev);

      for (const path in patches) {
        const keys = path.split('.');
        let current = root;

        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] ??= {};
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = patches[path];
      }

      return root;
    });
  }
}
