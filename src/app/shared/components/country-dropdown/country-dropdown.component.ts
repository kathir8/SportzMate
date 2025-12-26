import { Component, computed, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonLabel } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { COUNTRIES, Country } from './country-list';


@Component({
  selector: 'country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss'],
  imports: [FormsModule, NgSelectModule, IonLabel]
})
export class CountryDropdownComponent {
  readonly countryChange = output<Country>();
  readonly countries = signal<Country[]>(COUNTRIES);
  readonly selectedCountryCode = model<string>('IND');

    readonly selectedCountry = computed(() =>
    this.countries().find(c => c.code === this.selectedCountryCode()) ?? 'IND'
  );

  // Generate flag URL dynamically
  getFlagUrl(flag: string) {
    return `/assets/flags/4x3/${flag}.svg`;
  }

  onSelectionChange(country: Country | null): void {
    if (!country) return;

    this.selectedCountryCode.set(country.code);
    this.countryChange.emit(country);
  }
}
