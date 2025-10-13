import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonFooter, IonImg } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { CountryDropdownComponent } from "src/app/shared/components/country-dropdown/country-dropdown.component";

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  imports: [IonFooter, IonicButtonComponent, IonicInputComponent, FormsModule, CountryDropdownComponent,IonImg]
})
export class ProfileDetailComponent {

  userName:string='';

  onCountryChange(country: any) {
  console.log('Selected:', country);
}

}
