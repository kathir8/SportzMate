import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCol, IonContent, IonIcon, IonInput, IonItem, IonRow, IonTextarea, ModalController } from '@ionic/angular/standalone';
import { calendarClearOutline, caretDownOutline, caretUpOutline, locationSharp, personOutline, fitnessOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { SignalService } from 'src/app/core/services/signal.service';
import { CommonStore } from 'src/app/core/stores/common-store';
import { AddressInfo, GoogleLocationInputComponent } from "src/app/shared/components/google-location-input/google-location-input.component";
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicDateTimeComponent } from "src/app/shared/components/ionic-datetime/ionic-datetime.component";
import { IonicSelectComponent } from "src/app/shared/components/ionic-select/ionic-select.component";
import { mapToIonicSelectOptions } from 'src/app/shared/components/ionic-select/select-option.mapper';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { BottomSheetService } from 'src/app/shared/services/bottom-sheet.serivce';
import { formatToLocalTime } from 'src/app/shared/utils/date-utils';
import { CreateInviteService, InviteForm, InviteFormApiResp } from './create-invite.service';

@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.scss'],
  imports: [IonContent, IonItem, IonIcon, IonInput, IonRow, IonCol, IonTextarea, FormsModule, IonicButtonComponent, GoogleLocationInputComponent, IonicSelectComponent]
})
export class CreateInviteComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly bottomSheet = inject(BottomSheetService);
  private readonly signalService = inject(SignalService);
  private readonly toast = inject(IonicToastService);
  private readonly createInviteService = inject(CreateInviteService);
  private readonly commonStore = inject(CommonStore);



  readonly icons = { personOutline, locationSharp, calendarClearOutline, caretUpOutline, caretDownOutline, fitnessOutline };
  readonly MIN_PLAYERS = 1;
  readonly MAX_PLAYERS = 30;


  readonly form = signal<InviteForm>({} as InviteForm);

  private readonly sports = computed(() => this.commonStore.sports());
  readonly selectedSportId = signal<number | null>(null);
  readonly isSportsLoaded = computed(() => this.sports().length > 0);


  readonly formattedDateTime = computed(() => {
    const ts = this.form().eventDateTime;
    return ts ? formatToLocalTime(ts, DATE_FORMATS.DATE_TIME) : '';
  });

  readonly sportOptions = computed(() =>
    mapToIonicSelectOptions(
      this.sports(),
      sport => sport.sportsName,
      sport => sport.sportID
    )
  );



  constructor() {
    this.commonStore.loadSports();
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

  private updateFormManually<K extends keyof InviteForm>(key: K, value: InviteForm[K]) {
    this.form.update(f => ({ ...f, [key]: value }));
  }


  onSportSelected(sportId: number | null): void {
    if (sportId) {
      this.updateFormManually('sportIdFk', sportId);
    }
  }

  onLocationSelected(data: AddressInfo): void {
    this.updateFormManually('location', data.address);
    this.updateFormManually('latitude', data.latitude);
    this.updateFormManually('longitude', data.longitude);
  }

  onLocationCleared(): void {
    this.updateFormManually('latitude', null);
    this.updateFormManually('longitude', null);
  }

  async openDateTimePickerModel() {
    const result = await this.bottomSheet.open<number>(IonicDateTimeComponent,
      {
        componentProps: {
          initialTimestamp: this.form().eventDateTime || null
        }
      }
    );

    if (!result) return;

    const { data, role } = result;

    if (role === 'confirm' && data) {
      this.updateFormManually('eventDateTime', data);
    }
  }

  updatePlayersFromInput(event: CustomEvent) {
    const input = event.target as HTMLIonInputElement;
    let value = Number(event.detail?.value);

    if (isNaN(value)) {
      value = this.MIN_PLAYERS;
    }

    value = Math.min(this.MAX_PLAYERS, Math.max(this.MIN_PLAYERS, value));
    this.updateFormManually('totalVacancy', value);

    input.value = value;
  }

  updatePlayers(isIncrease?: boolean) {
    const current = this.form().totalVacancy || 0;
    const next = isIncrease ? current + 1 : current - 1;
    const value = Math.min(this.MAX_PLAYERS, Math.max(this.MIN_PLAYERS, next))
    this.updateFormManually('totalVacancy', value);
  }


  submit() {
    if (!this.formValidation()) {
      return;
    }

    this.createInviteService.createEvent(this.form()).subscribe((res: InviteFormApiResp) => {
      this.toast.show(res.rspMsg);
      if (res.rspFlg) {
        this.modalCtrl.dismiss(this.form);
      }
    });

  }

  private formValidation(): boolean {
    if (!this.form()) {
      return false;
    }

    if (!this.form().eventName) {
      this.toast.show('Enter invite name');
      return false;
    }

     if (!this.form().sportIdFk) {
      this.toast.show('Select sport type');
      return false;
    }

    if (!this.form().location) {
      this.toast.show('Choose the location');
      return false;
    }

    if (!this.form().latitude || !this.form().longitude) {
      this.toast.show('There is no coordinates to this location');
      return false;
    }

    if (!this.form().eventDateTime) {
      this.toast.show('Choose date and time');
      return false;
    }

    if (this.form().eventDateTime < new Date().getTime()) {
      this.toast.show('Choose future date and time');
      return false;
    }

    if (!this.form().totalVacancy) {
      this.toast.show('Choose No. of players required');
      return false;
    }

    if (!this.form().eventDesc) {
      this.toast.show('Enter description');
      return false;
    }

    return true
  }

}
