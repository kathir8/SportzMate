import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCol, IonContent, IonIcon, IonImg, IonInput, IonItem, IonRow, IonTextarea, ModalController } from '@ionic/angular/standalone';
import { calendarClearOutline, caretDownOutline, caretUpOutline, locationSharp, personOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicDateTimeComponent } from "src/app/shared/components/ionic-datetime/ionic-datetime.component";
import { BottomSheetService } from 'src/app/shared/services/bottom-sheet.serivce';
import { DateTimePickerResult, formatToLocalTime } from 'src/app/shared/utils/date-utils';

type InviteForm = {
  name: string;
  location: string;
  players: number;
  datetime: number;
  description: string;
};

@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.scss'],
  imports: [IonContent, IonItem, IonIcon, IonInput, IonRow, IonCol, IonTextarea, FormsModule, IonImg, IonicButtonComponent]
})
export class CreateInviteComponent {
  private modalCtrl = inject(ModalController);
  private bottomSheet = inject(BottomSheetService);

  icons = { personOutline, locationSharp, calendarClearOutline, caretUpOutline, caretDownOutline };

  readonly MIN_PLAYERS = 1;
  readonly MAX_PLAYERS = 30;


  form = signal<InviteForm>({
    name: '',
    location: '',
    players: this.MIN_PLAYERS,
    datetime: 0,
    description: ''
  });

  formattedDateTime = computed(() => {
    const ts = this.form().datetime;
    return ts ? formatToLocalTime(ts, DATE_FORMATS.DATE_TIME) : '';
  });


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
    const payload = this.form();
    console.log('API Payload:', payload);
    this.modalCtrl.dismiss(this.form);
  }

}
