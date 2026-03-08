import { Component, output, signal } from '@angular/core';
import { AcceptReject } from 'src/app/features/dashboard/requests/models/requests.model';
import { IonicChipComponent } from "../ionic-chip/ionic-chip.component";

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss'],
  imports: [IonicChipComponent],
})
export class StatusFilterComponent {

  /** status filters used by the chips */
  readonly filters = signal<{ label: string, status: AcceptReject }[]>([
    { label: 'Pending', status: AcceptReject.Pending },
    { label: 'Accepted', status: AcceptReject.Accepted },
    { label: 'Rejected', status: AcceptReject.Rejected }
  ] as const);

  readonly selectedFilter = signal<AcceptReject>(AcceptReject.Pending);
  readonly filterChange = output<AcceptReject>();

  
  setFilter(status: AcceptReject): void {
    this.selectedFilter.set(status);
    this.filterChange.emit(status);
  }

}
