import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonFooter, IonImg, IonContent, IonAvatar } from '@ionic/angular/standalone';
import { CountryDropdownComponent } from "src/app/shared/components/country-dropdown/country-dropdown.component";
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserService } from '../services/user-service';
import { UserStore } from 'src/app/core/stores/user-store';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  imports: [IonFooter, IonicButtonComponent, IonicInputComponent, FormsModule, CountryDropdownComponent, IonImg, IonContent, IonAvatar]
})
export class ProfileDetailComponent {
  private router = inject(Router);
  userService = inject(UserService);
  userStore = inject(UserStore);
  profileImage = signal<string | undefined>(undefined);

  static navId = 'ProfileDetail';
  userName: string = '';

  constructor() {
    effect(() => {
      const user = this.userStore.getCurrent();
      if (user?.customProfile) this.profileImage.set(user.customProfile);
      else this.profileImage.set(user?.profile);
    })
  }

  async selectProfileImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Shows device default picker with camera and gallery options
      });

      if (!image.dataUrl) return;

      const isValid = this.validateImage(image.dataUrl);
      if (!isValid) return;

      this.profileImage.set(image.dataUrl);

      const uid = this.userStore.getCurrent()?.id;
      if (!uid) return;

      // Upload to Firebase
      // const downloadURL = await this.firebaseImageService.uploadProfileImageDataUrl(image.dataUrl, uid);

      // Save URL only in DB
      // await this.userService.updateProfileImage(uid, downloadURL).toPromise();
    } catch (err) {
      console.error("Image selection error:", err);
    }
  }

  private validateImage(dataUrl: string): boolean {
    const base64 = dataUrl.split(',')[1];
    const mime = dataUrl.substring(5, dataUrl.indexOf(';')); // e.g., "image/png"

    // Allowed formats
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(mime)) {
      alert("Only JPG, JPEG, PNG formats are allowed.");
      return false;
    }

    // Size check → base64 length * 3/4
    const sizeInBytes = Math.ceil((base64.length * 3) / 4);
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > 1) {
      alert("Maximum allowed file size is 1MB.");
      return false;
    }

    return true;
  }

  onCountryChange(country: any) {
    console.log('Selected:', country);
  }

  confirm() {
    this.router.navigate(['/dashboard/home']);
  }

}
