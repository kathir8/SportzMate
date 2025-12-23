import { Component, output, signal } from '@angular/core';
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
  readonly countries = COUNTRIES;
  readonly selectedCountryCode = signal<string>('in');


  // Generate flag URL dynamically
  getFlagUrl(code: string) {
    return `/assets/flags/4x3/${code}.svg`;
  }

  onSelectionChange(country: Country | null): void {
    if (!country) return;

    this.selectedCountryCode.set(country.code);
    this.countryChange.emit(country);
  }
}
