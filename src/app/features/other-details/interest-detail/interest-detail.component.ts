import { Component, computed, effect, inject, signal } from '@angular/core';
import { IonContent, IonFooter, IonNavLink } from '@ionic/angular/standalone';
import { CommonStore } from 'src/app/core/stores/common-store';
import { UserStore } from 'src/app/core/stores/user-store';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { ProfileDetailComponent } from '../profile-detail/profile-detail.component';
import { SignalService } from 'src/app/core/services/signal.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-interest-detail',
  templateUrl: './interest-detail.component.html',
  styleUrls: ['./interest-detail.component.scss'],
  imports: [IonNavLink, IonicButtonComponent, IonFooter, IonicChipComponent, IonContent]
})
export class InterestDetailComponent {
  static readonly navId = 'InterestDetail';
  private readonly userStore = inject(UserStore);
  private readonly commonStore = inject(CommonStore);
  private readonly signalService = inject(SignalService);
  private readonly commonService = inject(CommonService);


  readonly profileComponent = ProfileDetailComponent;
  readonly sports = computed(() => this.commonStore.sports());

  readonly currentUser = this.userStore.getCurrent()!;
  readonly selectedSports = signal<string[]>(this.commonService.csvToArray(this.currentUser()?.interestedSportsIds));

  constructor() {
    this.commonStore.loadSports();
  }

  toggleSportSelection(ID: number): void {
    const sportID = String(ID);
    this.selectedSports.update(previousSelected =>
      previousSelected.includes(sportID)
        ? previousSelected.filter(item => item !== sportID)
        : [...previousSelected, sportID]
    );
    this.updateInterest();
  }

  getChipClass(ID: number): string {
    const sportID = String(ID);
    return this.selectedSports().includes(sportID)
      ? 'interest-chip selected'
      : 'interest-chip';
  }


  updateInterest(): void {
    this.signalService.patchSignal(this.currentUser, {
      interestedSportsIds: this.selectedSports().join(',')
    });
  }

}
