import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTextarea, ModalController } from '@ionic/angular/standalone';
import { UserStore } from 'src/app/core/stores/user-store';
import { IonicButtonComponent } from "src/app/shared/components/ionic-button/ionic-button.component";
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { ApiResp } from 'src/app/shared/models/shared.model';
import { CancelEventApiService } from './cancel-event-api.service';

export interface deleteApi {
  eventIdPk: number;
  userId: number;
  deleteReason: string
}


export interface deleteApiResp extends ApiResp {
  eventId: number,
  deleteReason: string,
  deletedDateTime: number
}

@Component({
  selector: 'app-cancel-event',
  templateUrl: './cancel-event.component.html',
  styleUrls: ['./cancel-event.component.scss'],
  imports: [IonContent, IonicChipComponent, IonicButtonComponent, IonTextarea, FormsModule]
})
export class CancelEventComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly cancelEventApiService = inject(CancelEventApiService);
  private readonly toast = inject(IonicToastService);
  private readonly userStore = inject(UserStore);

  private readonly eventId: number = 0;
  private readonly currentUser = this.userStore.getCurrent()!;


  readonly reasons = signal<string[]>(['Not Well', 'Busy Schedule', 'At Work', 'Not Interested', 'Slot Booked', 'Other']);

  readonly selectedReason = signal<string>('');
  readonly deleteReason = signal<string>('');


  updateReason(reason: string) {
    this.selectedReason.set(reason);
    if (reason !== 'Other') {
      this.deleteReason.set('');
    }
  }
  getChipClass(reason: string): string {
    return this.selectedReason() === reason
      ? 'reason-chip selected'
      : 'reason-chip';
  }

  submit() {
    if (!this.selectedReason()) {
      this.toast.show('Please select reason');
      return;
    }
    if (this.selectedReason() === 'Other' && !this.deleteReason()) {
      this.toast.show('Please Enter a reason');
      return;
    }
    const obj: deleteApi = {
      eventIdPk: this.eventId,
      userId: this.currentUser()!.userID,
      deleteReason: this.deleteReason() || this.selectedReason()
    }
    this.cancelEventApiService.cancelEvent(obj).subscribe(res => {
      this.toast.show(res.rspMsg);
      if (res.rspFlg) {
        this.modalCtrl.dismiss();
      }
    });
  }

}
