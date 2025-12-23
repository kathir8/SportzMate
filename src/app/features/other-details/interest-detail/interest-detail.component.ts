import { Component, computed, signal } from '@angular/core';
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
  static readonly navId = 'InterestDetail';

  readonly profileComponent = ProfileDetailComponent;
  readonly sports = computed<SportType[]>(() =>
    Object.values(SportType)
  );
  readonly selectedSports = signal<SportType[]>([
    SportType.Football,
    SportType.Running
  ]);

  toggleSportSelection(sport: SportType): void {
    this.selectedSports.update(previousSelected =>
      previousSelected.includes(sport)
        ? previousSelected.filter(item => item !== sport)
        : [...previousSelected, sport]
    );
  }

  getChipClass(sport: SportType): string {
    return this.selectedSports().includes(sport)
      ? 'interest-chip selected'
      : 'interest-chip';
  }

}
