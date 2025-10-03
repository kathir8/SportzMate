import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { chevronForward,heartOutline, logoFacebook, logoGoogle, logoInstagram } from 'ionicons/icons';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, FormsModule]
})
export class LoginComponent {
public icons = {chevronForward,heartOutline,logoFacebook,logoGoogle,logoInstagram}; // You can add in this object as many as you need

  email: string = '';

  next() {
    console.log("Entered Email: ", this.email);
    // Later you can add API call here
  }

}
