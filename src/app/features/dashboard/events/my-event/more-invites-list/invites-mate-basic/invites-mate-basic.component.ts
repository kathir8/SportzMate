import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { IonCol, IonImg, IonRow, IonText, IonThumbnail, IonIcon } from "@ionic/angular/standalone";
import { chatbubbleEllipsesOutline } from 'ionicons/icons';
import { CommonService } from 'src/app/core/services/common.service';
import { AcceptOrReject } from 'src/app/features/dashboard/home/mate-stuff/models/mate.model';
import { AcceptOrRejectComponent } from "src/app/shared/components/accept-or-reject/accept-or-reject.component";

@Component({
  selector: 'app-invites-mate-basic',
  templateUrl: './invites-mate-basic.component.html',
  styleUrls: ['./invites-mate-basic.component.scss'],
  imports: [IonIcon, IonText, IonRow, IonCol, IonThumbnail, IonImg, AcceptOrRejectComponent]
})
export class InvitesMateBasicComponent {
  private readonly router = inject(Router);
  readonly commonService = inject(CommonService);

  readonly icons = { chatbubbleEllipsesOutline };

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

   openChat(id: string) {
    id = 'ZImljsDYntQLvi3y9NPgdxsDdqF3';
    this.router.navigate(['dashboard/chat', id],
       {
        state: {
          fromUrl: this.router.url
        }
      }
    );

  }

}
