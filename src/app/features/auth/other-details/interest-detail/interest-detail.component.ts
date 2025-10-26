import { Component } from '@angular/core';
import { IonNavLink, IonFooter } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { ProfileDetailComponent } from '../profile-detail/profile-detail.component';
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";

@Component({
  selector: 'app-interest-detail',
  templateUrl: './interest-detail.component.html',
  styleUrls: ['./interest-detail.component.scss'],
  imports: [IonNavLink, IonicButtonComponent, IonFooter, IonicChipComponent]
})
export class InterestDetailComponent {
  static navId = 'InterestDetail';

  profileComponent = ProfileDetailComponent;
  sports: string[] = ['Cricket', 'Football', 'Badminton', 'Running', 'Tennis', 'Volleyball', 'Basketball', 'Kabaddi', 'Cycling'];
  selectedSports: string[] = ['Football', 'Running'];

  toggleSportSelection(sport: string) {
    const index = this.selectedSports.indexOf(sport);

    if (index > -1) {
      this.selectedSports.splice(index, 1);
    } else {
      this.selectedSports.push(sport);
    }
  }

}
