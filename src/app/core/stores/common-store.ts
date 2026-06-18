import { inject, Injectable, signal } from '@angular/core';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { ApiResp, SportsList } from 'src/app/shared/models/shared.model';
import { CommonApiService } from '../services/common-api-service';
import { UniqueActionId } from '../model/common.model';

export interface SportsListResp extends ApiResp {
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

  private readonly _uniqueActionId = signal<UniqueActionId | null>(null);

  readonly uniqueActionId = this._uniqueActionId.asReadonly();

  setUniqueActionId(action: UniqueActionId):void {
    this._uniqueActionId.set(action);
  }

  clearUniqueActionIdId() {
    this._uniqueActionId.set(null);
  }
  
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