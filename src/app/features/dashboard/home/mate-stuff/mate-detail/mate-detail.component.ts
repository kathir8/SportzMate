import { UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { IonGrid, IonIcon } from '@ionic/angular/standalone';
import { calendarOutline, mailOpenOutline, timeOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { GroupDetail } from '../../../requests/models/requests.model';
import { MateBasicComponent } from "../mate-basic/mate-basic.component";
import { MateDetail } from '../models/mate.model';
@Component({
  selector: 'app-mate-detail',
  templateUrl: './mate-detail.component.html',
  styleUrls: ['./mate-detail.component.scss'],
  imports: [IonGrid, IonIcon, LocalTimePipe, UpperCasePipe, MateBasicComponent]
})
export class MateDetailComponent {

  readonly mate = input<MateDetail | GroupDetail>({} as MateDetail);

  readonly DATE_FORMATS = DATE_FORMATS;

  readonly icons = { calendarOutline, timeOutline, mailOpenOutline };

}
