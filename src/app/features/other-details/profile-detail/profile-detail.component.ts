import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CameraSource, Photo } from '@capacitor/camera';
import { IonContent, IonFooter } from '@ionic/angular/standalone';
import { UserStore } from 'src/app/core/stores/user-store';
import { CountryDropdownComponent } from "src/app/shared/components/country-dropdown/country-dropdown.component";
import { ImageSourceComponent } from "src/app/shared/components/image-source/image-source.component";
import { ImageSourceService } from 'src/app/shared/components/image-source/image-source.service';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { ProfileImageComponent } from "src/app/shared/components/profile-image/profile-image.component";
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  imports: [IonFooter, IonicButtonComponent, FormsModule, CountryDropdownComponent, IonContent, ImageSourceComponent, ProfileImageComponent]
})
export class ProfileDetailComponent {
  private readonly userService = inject(UserService);
  private readonly userStore = inject(UserStore);
  private readonly toast = inject(IonicToastService);

  readonly sheet = viewChild<ImageSourceComponent>('sheet');
  private readonly imageSourceService = inject(ImageSourceService);

  readonly profileImage = signal<string | undefined>(undefined);
  readonly selectedPhoto = signal<Photo | null>(null);

  readonly selectedCountry = signal<string>('IND');

  static readonly navId = 'ProfileDetail';

  private readonly currentUser = this.userStore.getCurrent();

  constructor() {
    if (!this.currentUser()?.countryName) {
      this.onCountryChange({ 'code': 'IND' });
    }
    effect(() => {
      if (this.currentUser()?.profileImage) this.profileImage.set(this.currentUser()!.profileImage);
      if (this.currentUser()?.countryName) this.selectedCountry.set(this.currentUser()!.countryName);
    })
  }


  openImageSelector() {
    this.sheet()?.open();
  }


  async onSourceSelected(source: CameraSource): Promise<void> {
    const photo = await this.imageSourceService.pickImage(source);
    if (!photo?.webPath) return;

    this.selectedPhoto.set(photo);
    this.profileImage.set(photo.webPath);
  }


  onCountryChange(country: any) {
    this.currentUser.update(user => {
      if (!user) return user;
      return {
        ...user,
        countryName: country.code
      }
    });
  }

  async confirm(): Promise<void> {

    const photo = this.selectedPhoto();
    if (photo) { // photo updated
      const file = await this.imageSourceService.convertToFile(photo);
      if (!file) {
        this.toast.show('Profile image upload error');
        this.userService.updateUser(this.currentUser()!);
        return;
      }

      this.userService.uploadProfileImage(file).subscribe((res: any) => {
        if (res.rspFlag) {
          const updatedObj = {
            ...this.currentUser()!,
            profileImage: res.uploadedImages[0].imageUrl
          }
          this.userService.updateUser(updatedObj);
          return;
        }
        this.userService.updateUser(this.currentUser()!);
      });
      return;
    }
    this.userService.updateUser(this.currentUser()!);
  }

}
