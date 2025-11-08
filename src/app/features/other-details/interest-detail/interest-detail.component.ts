import { Component } from '@angular/core';
import { IonFooter, IonNavLink, IonContent } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { ProfileDetailComponent } from '../profile-detail/profile-detail.component';
import { SportType } from 'src/app/shared/models/shared.model';

@Component({
  selector: 'app-interest-detail',
  templateUrl: './interest-detail.component.html',
  styleUrls: ['./interest-detail.component.scss'],
  imports: [IonNavLink, IonicButtonComponent, IonFooter, IonicChipComponent, IonContent]
})
export class InterestDetailComponent {
  static navId = 'InterestDetail';

  profileComponent = ProfileDetailComponent;
  sports = Object.values(SportType);
  selectedSports: SportType[] = [SportType.Football, SportType.Running];

  toggleSportSelection(sport: SportType) {
    const index = this.selectedSports.indexOf(sport);

    if (index > -1) {
      this.selectedSports.splice(index, 1);
    } else {
      this.selectedSports.push(sport);
    }
  }

}
