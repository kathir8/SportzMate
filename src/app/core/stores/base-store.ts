// base-store.ts
import { signal } from '@angular/core';

export abstract class BaseStore<T> {
  protected data = signal<T | null>(null);
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  get state() {
    return {
      value: () => this.data(),
      loading: () => this.loading(),
      error: () => this.error()
    };
  }

  protected setLoading(v: boolean) { this.loading.set(v); }
  protected setError(msg: string | null) { this.error.set(msg); }
  protected setData(value: T | null) { this.data.set(value); }
}
