import { inject, Injectable, signal } from '@angular/core';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { SportsList } from 'src/app/shared/models/shared.model';
import { CommonApiService } from '../services/common-api-service';

export interface SportsListResp {
  rspFlg: boolean;
  rspMsg: string;
  sportsList: SportsList[];
}
@Injectable({
  providedIn: 'root',
})
export class CommonStore {
  private readonly commonApi = inject(CommonApiService);

  private readonly _sports = signal<SportsList[]>([]);

  readonly sports = this._sports.asReadonly();

  private readonly toast = inject(IonicToastService);

  loadSports(): SportsList[] {
    if (this._sports().length > 0) {
      return this._sports();
    }

    this.commonApi.getSports().subscribe((res: SportsListResp) => {
      if (res.rspFlg) {
        this._sports.set(res.sportsList);
      } else {
        this.toast.show(res.rspMsg);
      }
    });

    return this._sports();
  }
}