import { inject, Injectable, signal } from '@angular/core';
import { SportsList } from 'src/app/shared/models/shared.model';
import { CommonApiService } from '../services/common-api-service';

export interface SportsListResp {
  resMsg: string;
  sportsList: SportsList[];
}
@Injectable({
  providedIn: 'root',
})
export class CommonStore {
  private readonly commonApi = inject(CommonApiService);

  private readonly _sports = signal<SportsList[]>([]);

  readonly sports = this._sports.asReadonly();

  loadSports(): SportsList[] {
    if (this._sports().length > 0) {
      return this._sports();
    }

    this.commonApi.getSports().subscribe({

      next: (res: SportsListResp) => {
        if (res.resMsg === 'success') {
          this._sports.set(res.sportsList);
        } else {
          console.log('API responded but business failed');
        }
      },
      error: (err) => {

        const sport = [
          {
            sportID: 1,
            sportsName: 'Badminton',
            sportsIcon: '',
            sportsImg: ''
          },
          {
            sportID: 2,
            sportsName: 'Cricket',
            sportsIcon: '',
            sportsImg: ''
          },
          {
            sportID: 3,
            sportsName: 'Cycling',
            sportsIcon: '',
            sportsImg: ''
          },
          {
            sportID: 4,
            sportsName: 'Tennis',
            sportsIcon: '',
            sportsImg: ''
          },
          {
            sportID: 5,
            sportsName: 'Football',
            sportsIcon: '',
            sportsImg: ''
          },
          {
            sportID: 6,
            sportsName: 'Running',
            sportsIcon: '',
            sportsImg: ''
          },
          {
            sportID: 7,
            sportsName: 'Swimming',
            sportsIcon: '',
            sportsImg: ''
          },
          {
            sportID: 8,
            sportsName: 'Yoga',
            sportsIcon: '',
            sportsImg: ''
          },
          {
            sportID: 9,
            sportsName: 'Basketball',
            sportsIcon: '',
            sportsImg: ''
          },
        ]
        this._sports.set([]);
      }
    });

    return this._sports();
  }
}