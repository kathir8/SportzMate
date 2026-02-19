import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SportsListResp } from '../stores/common-store';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CommonApiService {
  private readonly api = inject(ApiService);

  getSports(): Observable<SportsListResp> {
    return of({
      "rspFlg":true,
      "rspMsg":"Sports list fetched successfully",
      "sportsList":
    [
      {
         sportID: 1,
  sportsName: 'Badminton',
  sportsIcon: '🏸',
      },
       {
         sportID: 2,
  sportsName: 'Cricket',
  sportsIcon: '🏏',
      },
       {
         sportID: 3,
  sportsName: 'Cycling',
  sportsIcon: '🚴',
      }
    ]
    }as SportsListResp);
    return this.api.get<SportsListResp>('sportslist');
  }
}
