import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonButton, IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports:[IonContent,IonLabel, IonInput, IonButton,IonCheckbox, FormsModule]
})
export class SignupComponent  implements OnInit {
password: any;
email: any;
confirmPassword: any;

  constructor() { }

  
  ngOnInit() {}

  verify() {
    console.log("Email: ", this.email);
    console.log("Password: ", this.password);
    console.log("Confirm Password: ", this.confirmPassword);
    // Later you can add API call here
  }

}
