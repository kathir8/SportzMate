import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonPicker, IonPickerColumn, IonPickerColumnOption, IonToolbar, ModalController } from '@ionic/angular/standalone';
import type { PickerColumnValue } from '@ionic/core';
import { toUtcTimestamp } from '../../utils/date-utils';

@Component({
  selector: 'ionic-datetime',
  templateUrl: './ionic-datetime.component.html',
  styleUrls: ['./ionic-datetime.component.scss'],
  imports: [IonContent, IonToolbar, IonButtons, IonButton, IonPicker,
    IonPickerColumn,
    IonPickerColumnOption]
})
export class IonicDateTimeComponent {
  private modalCtrl = inject(ModalController);
  private now = new Date();

  initialTimestamp : number | null = null;

  day = signal('');
  month = signal('');
  year = signal('');
  hour = signal('');
  minute = signal('');
  meridiem = signal<'AM' | 'PM'>('AM');
  

  years = computed(() => {
    const currentYear = this.now.getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(currentYear + i));
  });

  months = computed(() =>
    Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
  );

  days = computed(() => {
    if (!this.month() || !this.year()) return [];
    const daysInMonth = new Date(+this.year(), +this.month(), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) =>
      String(i + 1).padStart(2, '0')
    );
  });

  hours = computed(() =>
    Array.from({ length: 12 }, (_, i) =>
      String(i + 1).padStart(2, '0')
    )
  );

  minutes = computed(() =>
    Array.from({ length: 60 }, (_, i) =>
      String(i).padStart(2, '0')
    )
  );

  meridiems = ['AM', 'PM'];


  isPastSelection = computed(() => {
    if (!this.day() || !this.month() || !this.year()) return true;

    let h = +this.hour();
    if (this.meridiem() === 'PM' && h < 12) h += 12;
    if (this.meridiem() === 'AM' && h === 12) h = 0;

    const selected = new Date(
      +this.year(),
      +this.month() - 1,
      +this.day(),
      h,
      +this.minute()
    );

    return selected < this.now;
  });


    ionViewWillEnter() {
      
    const baseDate = this.initialTimestamp
      ? new Date(this.initialTimestamp)
      : this.now;

    this.initFromDate(baseDate);
  }

  private initFromDate(date: Date) {
    this.day.set(this.pad(date.getDate()));
    this.month.set(this.pad(date.getMonth() + 1));
    this.year.set(String(date.getFullYear()));

    const h24 = date.getHours();
    this.hour.set(this.get12Hour(h24));
    this.minute.set(this.pad(date.getMinutes()));
    this.meridiem.set(h24 >= 12 ? 'PM' : 'AM');
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  private get12Hour(hour24: number): string {
    const h = hour24 % 12 || 12;
    return this.pad(h);
  }


  setString(
    setter: (v: string) => void,
    value: PickerColumnValue
  ) {
    if (value !== undefined) {
      setter(String(value)); // ✅ number → string
    }
  }

  setMeridiem(value: PickerColumnValue) {
    if (value === 'AM' || value === 'PM') {
      this.meridiem.set(value);
    }
  }


  dismiss(role: 'confirm' | 'cancel') {
    if (role === 'confirm' && this.isPastSelection()) return;

    this.modalCtrl.dismiss(
      role === 'confirm'
        ? toUtcTimestamp({
          day: this.day(),
          month: this.month(),
          year: this.year(),
          hour: this.hour(),
          minute: this.minute(),
          meridiem: this.meridiem(),
        })
        : null,
      role
    );
  }
}
