import { Component, signal, viewChild } from '@angular/core';
import { IonContent, IonNav, IonRange } from '@ionic/angular/standalone';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { GenderDetailComponent } from "./gender-detail/gender-detail.component";
@Component({
  selector: 'other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss'],
  imports: [IonContent, IonRange, IonNav, HeaderComponent]
})
export class OtherDetailsComponent {

  private readonly ionNav = viewChild.required<IonNav>('nav');

  readonly genderComponent = GenderDetailComponent;
  readonly showBackButton = signal<boolean>(false);
  readonly ionValue = signal<number>(20);

  onNavChange(event: CustomEvent<void>) {
    const ionNavElement = event.target as HTMLIonNavElement;
    const active = ionNavElement.getActive();

    active.then((view) => {
      const componentName = view?.component?.navId;
      if (!componentName) {
        this.showBackButton.set(false);
        return
      }

      if (componentName === 'GenderDetail') {
        this.showBackButton.set(false);
        this.ionValue.set(20);
      } else if (componentName === 'AgeDetail') {
        this.showBackButton.set(true);
        this.ionValue.set(40);
      } else if (componentName === 'InterestDetail') {
        this.showBackButton.set(true);
        this.ionValue.set(60);
      } else if (componentName === 'ProfileDetail') {
        this.showBackButton.set(true);
        this.ionValue.set(80);
      }
    });
  }


  goBack() {
    this.ionNav()?.pop();
  }

}
