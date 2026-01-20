import { Component, inject, input, NgZone, output, viewChild } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';
import { UserStore } from 'src/app/core/stores/user-store';

export interface AddressInfo{
   address: string;
    latitude: number;
    longitude: number;
}

@Component({
  selector: 'google-location-input',
  templateUrl: './google-location-input.component.html',
  styleUrls: ['./google-location-input.component.scss'],
  imports: [IonInput],
  host: {
    'style': 'display: block; width: 100%;'
  }

})
export class GoogleLocationInputComponent {

  private readonly ngZone = inject(NgZone);
  private readonly userStore = inject(UserStore);
  private readonly currentUser = this.userStore.getCurrent();


  declare google: typeof google;

  private readonly searchInput = viewChild.required<IonInput>('googleSearchInput');

  readonly placeholder = input<string>('Choose the location');

  readonly locationSelected = output<AddressInfo>();

  readonly locationCleared = output<void>();

  async ngAfterViewInit(): Promise<void> {
    const nativeInput = await this.searchInput().getInputElement();

    const autocomplete = new google.maps.places.Autocomplete(nativeInput, {
      componentRestrictions: { country: this.currentUser()!.currentLocationCountry },
      fields: ['geometry', 'formatted_address']
    });

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();

        if (!place.geometry?.location || !place.formatted_address) {
          return;
        }

        this.locationSelected.emit({
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
        });
      });
    });
  }

  onUserTyping(): void {
    this.locationCleared.emit();
  }

}
