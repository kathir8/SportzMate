import { Component, ViewChild } from '@angular/core';
import { IonContent, IonNav, IonRange } from '@ionic/angular/standalone';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { GenderDetailComponent } from "./gender-detail/gender-detail.component";
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
@Component({
  selector: 'other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss'],
  imports: [IonContent, IonRange, IonNav, HeaderComponent]
})
export class OtherDetailsComponent {

  @ViewChild('nav') ionNav!: IonNav;

  // genderComponent = GenderDetailComponent;
  profileDetailComponent = ProfileDetailComponent;
  showBackButton: boolean = false;
  ionValue: number = 20;

  onNavChange(event: CustomEvent<void>) {
    const ionNavElement = event.target as HTMLIonNavElement;
    const active = ionNavElement.getActive();

    active.then((view) => {
      const componentName = view?.component?.navId;
      if (!componentName) {
        this.showBackButton = false;
        return
      }

      if (componentName === 'GenderDetail') {
        this.showBackButton = false;
        this.ionValue = 20;
      } else if (componentName === 'AgeDetail') {
        this.showBackButton = true;
        this.ionValue = 40;
      } else if (componentName === 'InterestDetail') {
        this.showBackButton = true;
        this.ionValue = 60;
      } else if (componentName === 'ProfileDetail') {
        this.showBackButton = true;
        this.ionValue = 80;
      }
    });
  }


  goBack() {
    this.ionNav?.pop();
  }

}
