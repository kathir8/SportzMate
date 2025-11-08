import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonFooter, IonImg, IonContent, IonAvatar, IonButton } from '@ionic/angular/standalone';
import { CountryDropdownComponent } from "src/app/shared/components/country-dropdown/country-dropdown.component";
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  imports: [IonFooter, IonicButtonComponent, IonicInputComponent, FormsModule, CountryDropdownComponent, IonImg, IonContent, IonAvatar,IonButton]
})
export class ProfileDetailComponent {
  private router = inject(Router);
  profileImage: string | undefined = undefined;


    async captureProfileImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // base64 format
      source: CameraSource.Camera, // directly open camera
    });

    this.profileImage = image.dataUrl;
  }

  async chooseFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos, // open gallery
    });

    this.profileImage = image.dataUrl;
  }

  static navId = 'ProfileDetail';
  userName: string = '';

  onCountryChange(country: any) {
    console.log('Selected:', country);
  }

  confirm() {
    this.router.navigate(['/dashboard/home']);
  }

}
