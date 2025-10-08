import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonFooter, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

import { chevronForward,heartOutline, logoFacebook, logoGoogle, logoInstagram } from 'ionicons/icons';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, IonButton, RouterLink, IonicInputComponent, IonicButtonComponent]
})
export class LoginComponent {
icons = {chevronForward,heartOutline,logoFacebook,logoGoogle,logoInstagram};

  email: string = '';

  next() {
    console.log("Entered Email: ", this.email);
    // Later you can add API call here
  }

}
