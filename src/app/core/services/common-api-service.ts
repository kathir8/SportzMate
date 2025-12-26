import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SportsListResp } from '../stores/common-store';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CommonApiService {
  private readonly api = inject(ApiService);

  getSports(): Observable<SportsListResp> {
    return this.api.get<SportsListResp>('sportslist');
  }
}
