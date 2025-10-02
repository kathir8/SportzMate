import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, FormsModule]
})
export class LoginComponent {

  email: string = '';

  next() {
    console.log("Entered Email: ", this.email);
    // Later you can add API call here
  }

}
