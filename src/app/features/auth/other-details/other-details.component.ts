import { Component, ViewChild } from '@angular/core';
import { IonContent, IonRange, IonNav } from '@ionic/angular/standalone';
import { GenderDetailComponent } from "./gender-detail/gender-detail.component";
import { HeaderComponent } from "src/app/shared/components/header/header.component";
@Component({
  selector: 'other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss'],
  imports: [IonContent, IonRange, IonNav, HeaderComponent]
})
export class OtherDetailsComponent {

  @ViewChild('nav') ionNav!: IonNav;

  genderComponent = GenderDetailComponent;
  showBackButton: boolean = false;
  ionValue: number = 20;
  constructor() { }


  onNavChange(event: CustomEvent<void>) {
    const ionNavElement = event.target as HTMLIonNavElement;
    const active = ionNavElement.getActive();

    active.then((view) => {
      const componentName = view?.component?.name;
      if (!componentName) {
        this.showBackButton = false;
        return
      }

      if (componentName === '_GenderDetailComponent') {
        this.showBackButton = false;
        this.ionValue = 20;
      } else if (componentName === '_AgeDetailComponent') {
        this.showBackButton = true;
        this.ionValue = 40;
      } else if (componentName === '_InterestDetailComponent') {
        this.showBackButton = true;
        this.ionValue = 60;
      } else if (componentName === '_ProfileDetailComponent') {
        this.showBackButton = true;
        this.ionValue = 80;
      }
    });
  }


  goBack() {
    this.ionNav?.pop();
  }

}
