import { Component, computed, effect, inject, signal } from '@angular/core';
import { IonFooter, IonNavLink, IonContent } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { ProfileDetailComponent } from '../profile-detail/profile-detail.component';
import { SportsList, SportType } from 'src/app/shared/models/shared.model';
import { UserStore } from 'src/app/core/stores/user-store';
import { CommonStore } from 'src/app/core/stores/common-store';

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


  readonly profileComponent = ProfileDetailComponent;
  readonly sports = computed(() => this.commonStore.sports());
  readonly selectedSports = signal<number[]>([]);

  readonly currentUser = this.userStore.getCurrent()!;

  constructor(){
    this.commonStore.loadSports();
    effect(()=>{
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
    this.currentUser.update(user => {
      if (!user) return user;

      return {
        ...user,
        interest: this.selectedSports()
      };
    });
  }

}
