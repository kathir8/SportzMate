// user.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { UserDetail } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private current = signal<UserDetail | null>(null);
  loading = signal(false);

  isOnboarded = computed(() => !!this.current()?.name && !!this.current()?.interest?.length);

  setCurrent(user: UserDetail): void {
    this.current.set(user);
  }

  getCurrent(): UserDetail | null {
    return this.current();
  }

}
