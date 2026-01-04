// invite.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { Invite } from 'src/app/features/dashboard/requests/models/requests.model';
import { InviteApiService } from 'src/app/features/dashboard/requests/services/invite-api-service';

@Injectable({ providedIn: 'root' })
export class InviteStore {
  invites = signal<Invite[]>([]);
  selected = signal<Invite | null>(null);
  loading = signal(false);

  listCount = computed(() => this.invites().length);

  constructor(private inviteApi: InviteApiService) { }

  async loadNearby(lat: number, lng: number) {
    this.loading.set(true);
    try {
      this.inviteApi.fetchNearby(lat, lng).subscribe(res => this.invites.set(res));
    } finally { this.loading.set(false); }
  }

  async selectInvite(id: string) {
    this.loading.set(true);
    try {
      await this.inviteApi.fetchById(id).subscribe(res => this.selected.set(res));
    } finally { this.loading.set(false); }
  }

  // --- Optimistic join example
  async joinInviteOptimistic(inviteId: string, uid: string) {
    // find index
    const prev = this.invites();
    const idx = prev.findIndex(i => i.id === inviteId);
    if (idx === -1) return;

    const updated = prev.map(i => i.id === inviteId ? { ...i, participants: [...i.participants, uid] } : i);
    this.invites.set(updated);

    try {
      await this.inviteApi.joinInvite(inviteId, uid).toPromise();
      // success -> nothing more
    } catch (err) {
      // rollback
      this.invites.set(prev);
      throw err;
    }
  }
}
