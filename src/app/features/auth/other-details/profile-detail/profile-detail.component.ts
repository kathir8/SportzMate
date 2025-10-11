import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonFooter } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { CountryDropdownComponent } from "src/app/shared/components/country-dropdown/country-dropdown.component";

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  imports: [IonFooter, IonicButtonComponent, IonicInputComponent, FormsModule, CountryDropdownComponent]
})
export class ProfileDetailComponent  implements OnInit {

  userName:string='';
  constructor() { }

  ngOnInit() {}

  onCountryChange(country: any) {
  console.log('Selected:', country);
}

}
