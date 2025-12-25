import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoadingService {
  private readonly _activeRequests = signal(0);

  readonly isLoading = computed(() => this._activeRequests() > 0);

  start(): void {
    this._activeRequests.update(v => v + 1);
  }

  stop(): void {
    this._activeRequests.update(v => Math.max(0, v - 1));
  }

  reset(): void {
    this._activeRequests.set(0);
  }
}
