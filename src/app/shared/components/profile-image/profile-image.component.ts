import { Component, inject, input, output } from '@angular/core';
import { IonAvatar, IonImg } from '@ionic/angular/standalone';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  imports: [IonAvatar, IonImg]
})
export class ProfileImageComponent {

  readonly commonService = inject(CommonService);

  readonly profileImage = input<string>();
  readonly imgChange = output<void>();

  profileChange() {
    this.imgChange.emit();
  }

}
