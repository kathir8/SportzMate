import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCol, IonContent, IonIcon, IonImg, IonInput, IonItem, IonRow, IonTextarea, ModalController } from '@ionic/angular/standalone';
import { calendarClearOutline, caretDownOutline, caretUpOutline, locationSharp, personOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { GlobalLoadingService } from 'src/app/core/services/global-loading-service';
import { SignalService } from 'src/app/core/services/signal.service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicDateTimeComponent } from "src/app/shared/components/ionic-datetime/ionic-datetime.component";
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { BottomSheetService } from 'src/app/shared/services/bottom-sheet.serivce';
import { DateTimePickerResult, formatToLocalTime } from 'src/app/shared/utils/date-utils';
import { CreateInviteService, InviteForm, InviteFormApiResp } from './create-invite.service';


@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.scss'],
  imports: [IonContent, IonItem, IonIcon, IonInput, IonRow, IonCol, IonTextarea, FormsModule, IonImg, IonicButtonComponent]
})
export class CreateInviteComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly bottomSheet = inject(BottomSheetService);
  private readonly signalService = inject(SignalService);
  private readonly loader = inject(GlobalLoadingService);
  private readonly toast = inject(IonicToastService);
  private readonly createInviteService = inject(CreateInviteService);


  readonly icons = { personOutline, locationSharp, calendarClearOutline, caretUpOutline, caretDownOutline };
  readonly MIN_PLAYERS = 1;
  readonly MAX_PLAYERS = 30;


  readonly form = signal<InviteForm>({} as InviteForm);

  readonly formattedDateTime = computed(() => {
    const ts = this.form().datetime;
    return ts ? formatToLocalTime(ts, DATE_FORMATS.DATE_TIME) : '';
  });


  constructor(){
    this.form().players = this.MIN_PLAYERS;
  }

  getVal(path: string, fallback: any = '') {
    return this.signalService.getDeepValue(this.form(), path, fallback);
  }

  setVal(path: string, event: any) {
    this.signalService.updateDeepValue(this.form, path, event);
  }

  updateForm<K extends keyof InviteForm>(
    key: K,
    event: CustomEvent
  ) {
    const value = (event.detail?.value ?? '') as InviteForm[K];
    this.form.update(f => ({ ...f, [key]: value }));
  }

  private updateFormManually(key: keyof InviteForm, value: any) {
    this.form.update(f => ({ ...f, [key]: value }));
  }


  async openDateTimePickerModel() {
    const result = await this.bottomSheet.open<DateTimePickerResult>(IonicDateTimeComponent,
      {
        componentProps: {
          initialTimestamp: this.form().datetime || null
        }
      }
    );

    if (!result) return;

    const { data, role } = result;

    if (role === 'confirm' && data) {
      this.updateFormManually('datetime', data);
    }
  }

  updatePlayersFromInput(event: CustomEvent) {
    const input = event.target as HTMLIonInputElement;
    let value = Number(event.detail?.value);

    if (isNaN(value)) {
      value = this.MIN_PLAYERS;
    }

    value = Math.min(this.MAX_PLAYERS, Math.max(this.MIN_PLAYERS, value));
    this.updateFormManually('players', value);

    input.value = value;
  }

  updatePlayers(isIncrease?: boolean) {
    const current = this.form().players || this.MIN_PLAYERS;
    const next = isIncrease ? current + 1 : current - 1;
    const value = Math.min(this.MAX_PLAYERS, Math.max(this.MIN_PLAYERS, next))
    this.updateFormManually('players', value);
  }


  submit() {
    console.log(this.form());
    return;
    
    if (!this.formValidation()) {
      return;
    }

    this.loader.start();
    this.createInviteService.createEvent(this.form()).subscribe((res: InviteFormApiResp) => {
      if (res.resFlag) {
        this.modalCtrl.dismiss(this.form);
        this.loader.stop();
      }
    });;


  }

  private formValidation(): boolean {
    if (!this.form()) {
      return false;
    }
    if (!this.form().eventName) {
      this.toast.show('Enter invite name');
      return false;
    }

    if (!this.form().location) {
      this.toast.show('Choose the location');
      return false;
    }

    if (!this.form().datetime) {
      this.toast.show('Choose date and time');
      return false;
    }

    if (!this.form().players) {
      this.toast.show('Choose No. of players');
      return false;
    }

    return true
  }

}
