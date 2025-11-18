import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonFooter, IonIcon, IonImg, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth.service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, RouterLink, IonicInputComponent, IonicButtonComponent, IonImg]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  icons = { chevronForward, heartOutline, logoFacebook, logoGoogle, logoInstagram };


  email: string = '';

  async login() {
    try {
      // this.loading.set(true);
      await this.auth.googleLogin();
      this.router.navigateByUrl('/auth/signup', { replaceUrl: true });
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      console.log("finally");
      
      // this.loading.set(false);
    }
  }

  next() {
    console.log("Entered Email: ", this.email);
    // Later you can add API call here
  }

}
