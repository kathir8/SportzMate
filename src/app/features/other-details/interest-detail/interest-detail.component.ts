import { Component, computed, effect, inject, signal } from '@angular/core';
import { IonContent, IonFooter, IonNavLink } from '@ionic/angular/standalone';
import { CommonStore } from 'src/app/core/stores/common-store';
import { UserStore } from 'src/app/core/stores/user-store';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { ProfileDetailComponent } from '../profile-detail/profile-detail.component';
import { SignalService } from 'src/app/core/services/signal.service';

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


  readonly profileComponent = ProfileDetailComponent;
  readonly sports = computed(() => this.commonStore.sports());
  readonly selectedSports = signal<number[]>([]);

  readonly currentUser = this.userStore.getCurrent()!;

  constructor() {
    this.commonStore.loadSports();
    effect(() => {
      console.log(this.sports());

    })
  }

  toggleSportSelection(ID: number): void {
    this.selectedSports.update(previousSelected =>
      previousSelected.includes(ID)
        ? previousSelected.filter(item => item !== ID)
        : [...previousSelected, ID]
    );
    this.updateInterest();
  }

  getChipClass(ID: number): string {
    return this.selectedSports().includes(ID)
      ? 'interest-chip selected'
      : 'interest-chip';
  }


  updateInterest(): void {
    this.signalService.patchSignal(this.currentUser, {
      interest: this.selectedSports()
    });
  }

}
