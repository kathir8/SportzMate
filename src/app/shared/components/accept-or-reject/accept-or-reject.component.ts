import { Component, output } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";
import { thumbsDownOutline, thumbsUpOutline } from 'ionicons/icons';
import { IonicChipComponent } from "../ionic-chip/ionic-chip.component";
import { AcceptOrReject } from 'src/app/features/dashboard/home/mate-stuff/models/mate.model';

@Component({
  selector: 'app-accept-or-reject',
  templateUrl: './accept-or-reject.component.html',
  styleUrls: ['./accept-or-reject.component.scss'],
  imports: [IonicChipComponent, IonIcon],
})
export class AcceptOrRejectComponent  {

  icons = {thumbsUpOutline, thumbsDownOutline};

  readonly approvalClickEmit = output<AcceptOrReject>();


  approvalClick(accepted: boolean, event: MouseEvent) : void{
    this.approvalClickEmit.emit({accepted,event});
  }

}
