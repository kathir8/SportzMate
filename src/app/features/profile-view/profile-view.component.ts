import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonTitle, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonItem, IonIcon, IonLabel, IonNote } from '@ionic/angular/standalone';
import { flagOutline } from 'ionicons/icons';
import { CommonStore } from 'src/app/core/stores/common-store';
import { UserStore } from 'src/app/core/stores/user-store';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { ProfileImageComponent } from "src/app/shared/components/profile-image/profile-image.component";
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  imports: [HeaderComponent, IonTitle, IonContent, ProfileImageComponent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonItem, IonIcon, IonLabel, IonNote, IonicChipComponent],
})
export class ProfileViewComponent {

  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);
  private readonly commonStore = inject(CommonStore);

  readonly currentUser = this.userStore.getCurrent();
  readonly sports = computed(() => this.commonStore.sports());


  readonly icons = { flagOutline };



  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }

}
