import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { IonCol, IonImg, IonRow, IonText, IonThumbnail } from "@ionic/angular/standalone";
import { CommonService } from 'src/app/core/services/common.service';
import { AcceptOrReject } from 'src/app/features/dashboard/home/mate-stuff/models/mate.model';
import { AcceptOrRejectComponent } from "src/app/shared/components/accept-or-reject/accept-or-reject.component";

@Component({
  selector: 'app-invites-mate-basic',
  templateUrl: './invites-mate-basic.component.html',
  styleUrls: ['./invites-mate-basic.component.scss'],
  imports: [IonText, IonRow, IonCol, IonThumbnail, IonImg, AcceptOrRejectComponent]
})
export class InvitesMateBasicComponent {
  private readonly router = inject(Router);
  readonly commonService = inject(CommonService);


  readonly mate = input<any>();

  readonly isAccepted = output<AcceptOrReject>();

  acceptOrRejectEmit(resp: AcceptOrReject): void {
    this.isAccepted.emit({
      item: this.mate()!,
      ...resp
    });
  }


  profileInfo() {
    //  return this.router.navigate(['profile'], {
    //   state: { profileUser: m.user }
    // });
  }

}
