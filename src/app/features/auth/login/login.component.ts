import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonFooter, IonIcon, IonImg, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth.service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { UserService } from '../../other-details/services/user-service';
import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, RouterLink, IonicInputComponent, IonicButtonComponent, IonImg]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private userService = inject(UserService);

  icons = { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram };


  email: string = '';

  ionViewDidEnter() {
    this.auth.initialize();
  }

  async loginViaGoogle() {
    try {
      // this.loading.set(true);
      const loggedinUser: User = await this.auth.loginViaGoogle();
      this.userService.updateUserDetail(loggedinUser.uid);
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      // this.loading.set(false);
    }
  }

  next() {
    console.log("Entered Email: ", this.email);
    // Later you can add API call here
  }

}
