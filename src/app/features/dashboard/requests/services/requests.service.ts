import { Injectable, signal } from '@angular/core';
import { AcceptReject } from '../models/requests.model';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  myRequestStatusFilter = signal<AcceptReject>(AcceptReject.Pending);
}
