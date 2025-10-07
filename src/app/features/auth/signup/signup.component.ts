import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicCheckboxComponent } from 'src/app/shared/components/ionic-checkbox/ionic-checkbox.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports:[IonContent, FormsModule, IonicInputComponent, IonicButtonComponent, IonicCheckboxComponent]
})
export class SignupComponent  implements OnInit {
password:string ='';
email:string ='kathir@gmail.com';
confirmPassword: string = ''
accepted:boolean=false;

  constructor() { }

  
  ngOnInit() {}

  verify() {
    console.log("Email: ", this.email);
    console.log("Password: ", this.password);
    console.log("Confirm Password: ", this.confirmPassword);
    // Later you can add API call here
  }

  onCheckboxBlur(){
    console.log(this.accepted);
    
  }

}
