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

  getDeepValue<T>(obj: T, path: string = '', defaultValue: any = ''): any {
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


  setList<T>(
    signalList: WritableSignal<readonly T[]>,
    list: readonly T[]
  ): void {
    signalList.set([...list]);
  }

  addItem<T>(
    signalList: WritableSignal<readonly T[]>,
    item: T
  ): void {
    signalList.update(list => [...list, item]);
  }


  prependItem<T>(
    signalList: WritableSignal<readonly T[]>,
    item: T
  ): void {
    signalList.update(list => [item, ...list]);
  }

  removeItemByKey<T, K extends keyof T>(
    signalList: WritableSignal<readonly T[]>,
    key: K,
    value: T[K]
  ): void {

    signalList.update(list =>
      list.filter(item => item[key] !== value)
    );
  }

  updateItemByKey<T, K extends keyof T>(
    signalList: WritableSignal<readonly T[]>,
    key: K,
    value: T[K],
    updater: (item: T) => T
  ): void {
    signalList.update(list =>
      list.map(item =>
        item[key] === value ? updater(item) : item
      )
    );
  }

  appendPage<T>(
    signalList: WritableSignal<readonly T[]>,
    pageItems: readonly T[]
  ): void {
    signalList.update(list => [...list, ...pageItems]);
  }

  clearList<T>(
    signalList: WritableSignal<readonly T[]>
  ): void {
    signalList.set([]);
  }

  resetSignal<T>(
    signal: WritableSignal<T>,
    initialValue: T
  ): void {
    signal.set(initialValue);
  }

  existsByKey<T, K extends keyof T>(
    list: readonly T[],
    key: K,
    value: T[K]
  ): boolean {
    return list.some(item => item[key] === value);
  }

  updateIfChanged<T>(
    signal: WritableSignal<T>,
    value: T
  ): void {
    if (signal() !== value) {
      signal.set(value);
    }
  }

}
