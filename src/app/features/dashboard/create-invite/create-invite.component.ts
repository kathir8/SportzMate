import { Component, computed, inject, NgZone, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCol, IonContent, IonIcon, IonInput, IonItem, IonRow, IonTextarea, ModalController } from '@ionic/angular/standalone';
import { calendarClearOutline, caretDownOutline, caretUpOutline, locationSharp, personOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { GlobalLoadingService } from 'src/app/core/services/global-loading-service';
import { SignalService } from 'src/app/core/services/signal.service';
import { UserStore } from 'src/app/core/stores/user-store';
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
  imports: [IonContent, IonItem, IonIcon, IonInput, IonRow, IonCol, IonTextarea, FormsModule, IonicButtonComponent]
})
export class CreateInviteComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly bottomSheet = inject(BottomSheetService);
  private readonly signalService = inject(SignalService);
  private readonly loader = inject(GlobalLoadingService);
  private readonly toast = inject(IonicToastService);
  private readonly createInviteService = inject(CreateInviteService);
  private readonly userStore = inject(UserStore);

  private readonly currentUser = this.userStore.getCurrent();

  declare google: typeof google;

  latitude: number | null = null;
  longitude: number | null = null;

  private readonly searchInput = viewChild.required<IonInput>('googleSearchInput');


  readonly icons = { personOutline, locationSharp, calendarClearOutline, caretUpOutline, caretDownOutline };
  readonly MIN_PLAYERS = 1;
  readonly MAX_PLAYERS = 30;


  readonly form = signal<InviteForm>({} as InviteForm);

  readonly formattedDateTime = computed(() => {
    const ts = this.form().datetime;
    return ts ? formatToLocalTime(ts, DATE_FORMATS.DATE_TIME) : '';
  });


  places: any[] = [];
  query: string = '';

  constructor(private ngZone: NgZone) {
    this.form().players = this.MIN_PLAYERS;
  }


  ngOnInit(): void {
    console.log(this.currentUser()!.countryName);
  }

  async ngAfterViewInit() {
    const nativeEl = await this.searchInput().getInputElement();

    // Attach Google's UI Widget to that element
    const autocomplete = new google.maps.places.Autocomplete(nativeEl, {
      componentRestrictions: { country: 'IN' },
      fields: ['geometry', 'formatted_address'] // This replaces getDetails call!
    });

    // Google handles the dropdown. You just listen for when they click a row.
    autocomplete.addListener('place_changed', () => {
      console.log("ome");

      this.ngZone.run(() => {
        const place = autocomplete.getPlace();

        if (place.geometry && place.geometry.location) {
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          console.log('Coordinates:', this.latitude, this.longitude);
          console.log('Full Address:', place.formatted_address);
        }
      });
    });
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

    this.createInviteService.createEvent(this.form()).subscribe((res: InviteFormApiResp) => {
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
