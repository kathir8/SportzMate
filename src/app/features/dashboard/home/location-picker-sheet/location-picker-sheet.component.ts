import { Component, inject, output } from '@angular/core';
import { IonContent, IonIcon, IonItem, ModalController } from '@ionic/angular/standalone';
import { locationSharp } from 'ionicons/icons';
import { AddressInfo, GoogleLocationInputComponent } from 'src/app/shared/components/google-location-input/google-location-input.component';
@Component({
  selector: 'app-location-picker-sheet',
  templateUrl: './location-picker-sheet.component.html',
  styleUrls: ['./location-picker-sheet.component.scss'],
  imports: [IonContent, GoogleLocationInputComponent, IonItem, IonIcon]
})
export class LocationPickerSheetComponent {
  private readonly modalCtrl = inject(ModalController);

  readonly icons = { locationSharp };
  readonly locationSelected = output<AddressInfo>();

  onLocationSelected(data: AddressInfo): void {
    this.modalCtrl.dismiss(data, 'confirm');
  }

  onLocationCleared(): void {
    this.modalCtrl.dismiss(null, 'clear');
  }
}
