// user.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { UserDetail } from '../model/user.model';
import { SportType } from 'src/app/shared/models/shared.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private current = signal<UserDetail | null>(null);
  loading = signal(false);

  isOnboarded = computed(() => !!this.current()?.name && !!this.current()?.interest?.length);

  setCurrent(user: UserDetail): void {
    this.current.set(user);
    localStorage.setItem('userDetail', JSON.stringify(user));  // CACHE
  }

  getCurrent(): UserDetail | null {
    return this.current();
  }

  loadFromCache(): UserDetail | null {
    try {
      // const cached = localStorage.getItem('userDetail');
       const parsed:UserDetail = {
      name : 'Kathir',
      email : 'ilayakathi@gmail.com',
      profile : '',
      customProfile : '',
      id : 'tXNwC6ZmTgdyUGKN7S1fmvTkX2o1',
      age: 25,
      gender: 'male',
      interest: [SportType.Basketball],
    }
      // if (!cached) return null;

      // const parsed = JSON.parse(cached);
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
