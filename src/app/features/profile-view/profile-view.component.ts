import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonFooter, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import type { AlertButton } from '@ionic/core';
import { UserDetail } from 'src/app/core/model/user.model';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user-service';
import { CommonStore } from 'src/app/core/stores/common-store';
import { UserStore } from 'src/app/core/stores/user-store';
import { COUNTRIES, Country } from 'src/app/shared/components/country-dropdown/country-list';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonicAlertComponent } from "src/app/shared/components/ionic-alert/ionic-alert.component";
import { IonicButtonComponent } from "src/app/shared/components/ionic-button/ionic-button.component";
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { ProfileImageComponent } from "src/app/shared/components/profile-image/profile-image.component";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  imports: [HeaderComponent, IonTitle, IonContent, ProfileImageComponent, IonicChipComponent, IonFooter, IonicButtonComponent, IonToolbar, IonicAlertComponent],
})
export class ProfileViewComponent {

  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly commonStore = inject(CommonStore);
  private readonly commonService = inject(CommonService);
  readonly userService = inject(UserService);


  private readonly routedProfileUser = signal<UserDetail | null>(
    (this.location.getState() as { profileUser?: UserDetail })?.profileUser ?? null);

  readonly isMyProfile = computed(() => this.routedProfileUser() === null);

  readonly profileUser = computed<UserDetail>(() =>
    this.routedProfileUser() ?? this.userStore.getCurrent()()!
  );


  readonly confirmLogOut = signal<boolean>(false);
  readonly alertHeading = signal<string>('Are you sure you want to delete your account!');
  readonly alertButtons = signal<ReadonlyArray<AlertButton>>([
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'ok'
    }
  ]);

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
    if (this.isMyProfile()) {
      this.router.navigate(['/dashboard/home']);
    } else {
      this.location.back();
    }
  }

  editProfile() {
    this.router.navigate(['/other-details']);
  }

  onAlertDismissed(detail: any): void {
    if (detail.role === 'ok') {
      this.userService.deleteUser(this.currentUser()!.email);
    } else {
      this.confirmLogOut.set(false);
    }
  }
}
