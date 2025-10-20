import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonFooter, IonImg } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { CountryDropdownComponent } from "src/app/shared/components/country-dropdown/country-dropdown.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  imports: [IonFooter, IonicButtonComponent, IonicInputComponent, FormsModule, CountryDropdownComponent, IonImg]
})
export class ProfileDetailComponent {
  static navId = 'ProfileDetail';

  userName: string = '';

  constructor(private router: Router) { }
  onCountryChange(country: any) {
    console.log('Selected:', country);
  }

  confirm() {
    this.router.navigate(['/dashboard/home']);
  }

}
