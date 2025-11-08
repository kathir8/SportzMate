import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicCheckboxComponent } from 'src/app/shared/components/ionic-checkbox/ionic-checkbox.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [IonContent, FormsModule, IonicInputComponent, IonicButtonComponent, IonicCheckboxComponent, IonImg]
})
export class SignupComponent {
  private router = inject(Router);
  password: string = '';
  email: string = '';
  confirmPassword: string = ''
  code: string = ''
  accepted: boolean = false;
  passwordPane: boolean = true;

  verify() {
    console.log("Email: ", this.email);
    console.log("Password: ", this.password);
    console.log("Confirm Password: ", this.confirmPassword);
    // Later you can add API call here
    this.passwordPane = false;
  }

  register(){
    this.router.navigate(['/other-details'], { replaceUrl: true });
  }

}
