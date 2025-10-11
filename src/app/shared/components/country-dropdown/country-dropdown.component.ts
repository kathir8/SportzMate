import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { COUNTRIES, Country } from './country-list';
import { IonLabel } from '@ionic/angular/standalone';


@Component({
  selector: 'country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss'],
  imports: [FormsModule, NgSelectModule,IonLabel]
})
export class CountryDropdownComponent {
  @Output() countryChange = new EventEmitter<Country>();

  countries: Country[] = COUNTRIES;

  selectedCountry: string = 'in';

  // Generate flag URL dynamically
  getFlagUrl(code: string) {
    return `/assets/flags/4x3/${code}.svg`;
  }

  onSelectionChange(country: Country) {
    this.selectedCountry = country?.code;
    this.countryChange.emit(country);
  }
}
