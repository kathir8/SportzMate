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
  readonly restrictToAreaOnly = input<boolean>(false);

  readonly locationSelected = output<AddressInfo>();

  readonly locationCleared = output<void>();

  async ngAfterViewInit(): Promise<void> {
    const nativeInput = await this.searchInput().getInputElement();

    const autocompleteOptions: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: this.currentUser()!.currentLocationCountry },
      fields: ['geometry', 'formatted_address', 'name', 'vicinity', 'address_components']
    };

    if (this.restrictToAreaOnly()) {
      autocompleteOptions.types = ['(regions)'];
    }

    const autocomplete = new google.maps.places.Autocomplete(nativeInput, autocompleteOptions);

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        const fallbackAddress = place.formatted_address?.trim() || '';
        const areaName = this.extractAreaName(place);

        if (!place.geometry?.location) {
          return;
        }

        const selectedAddress = this.restrictToAreaOnly() ? (areaName || fallbackAddress) : fallbackAddress;

        if (!selectedAddress) {
          return;
        }

        this.locationSelected.emit({
          address: selectedAddress,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
        });
      });
    });
  }

  onUserTyping(event?: Event): void {
    const target = event?.target as HTMLIonInputElement | null;
    const value = target?.value?.toString().trim() ?? '';

    if (!value) {
      this.locationCleared.emit();
    }
  }

  private extractAreaName(place: google.maps.places.PlaceResult): string {
    const locality = place.address_components?.find(component =>
      component.types.includes('locality') ||
      component.types.includes('sublocality') ||
      component.types.includes('administrative_area_level_2') ||
      component.types.includes('postal_town')
    );

    if (locality?.long_name) {
      return locality.long_name;
    }

    return place.name?.trim() || place.vicinity?.trim() || place.formatted_address?.trim() || '';
  }

}
