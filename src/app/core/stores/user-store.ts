// user.store.ts
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { UserDetail } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly current = signal<UserDetail | null>(null);
  loading = signal(false);

  readonly isOnboarded = computed(() => !!this.current()?.name && !!this.current()?.countryName);

  setCurrent(user: UserDetail): void {
    this.current.set(user);
    localStorage.setItem('userDetail', JSON.stringify(user));  // CACHE
  }

  getCurrent(): WritableSignal<UserDetail | null> {
    return this.current;
  }

  updateCurrent<K extends keyof UserDetail>(key: K, value: UserDetail[K]) {
    this.current.update(current => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value
      };
    });
    localStorage.setItem('userDetail', JSON.stringify(this.current()));  // CACHE
  }

  loadFromCache(): UserDetail | null {
    try {
      const cached = localStorage.getItem('userDetail');
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      this.current.set(parsed);
      return parsed;

    } catch {
      return null;
    }
  }

  clear(): void {
    this.current.set(null);
    localStorage.removeItem('userDetail');
  }

}
