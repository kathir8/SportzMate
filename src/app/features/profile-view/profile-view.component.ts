import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonTitle, IonFooter, IonToolbar } from '@ionic/angular/standalone';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonStore } from 'src/app/core/stores/common-store';
import { UserStore } from 'src/app/core/stores/user-store';
import { COUNTRIES, Country } from 'src/app/shared/components/country-dropdown/country-list';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { ProfileImageComponent } from "src/app/shared/components/profile-image/profile-image.component";
import { IonicButtonComponent } from "src/app/shared/components/ionic-button/ionic-button.component";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  imports: [HeaderComponent, IonTitle, IonContent, ProfileImageComponent, IonicChipComponent, IonFooter, IonicButtonComponent, IonToolbar],
})
export class ProfileViewComponent {

  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);
  private readonly commonStore = inject(CommonStore);
  private readonly commonService = inject(CommonService);


  readonly currentUser = this.userStore.getCurrent();
  readonly sports = computed(() => this.commonStore.sports());
  readonly countries = signal<Country[]>(COUNTRIES);
  readonly selectedCountry = computed(() => this.countries().find(c => c.code === this.currentUser()!.countryName));
  readonly selectedSports = computed(() => {
    const selSports = this.commonService.wrapWithSymbol(this.currentUser()!.interestedSportsIds) || ',1,2,3,';
    return this.sports().filter(x => selSports.includes(this.commonService.wrapWithSymbol(x.sportID))).map(x => x.sportsName);
  });


  constructor() {
    this.commonStore.loadSports();
  }


  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }

}
