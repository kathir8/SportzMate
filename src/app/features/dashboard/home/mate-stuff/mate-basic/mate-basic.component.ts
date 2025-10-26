import { Component, Input, input } from '@angular/core';
import { IonCol, IonIcon, IonImg, IonLabel, IonRow, IonThumbnail } from '@ionic/angular/standalone';
import { bicycleOutline, calendarClear, peopleOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { IonicBadgeComponent } from 'src/app/shared/components/ionic-badge/ionic-badge.component';
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { MateListItem } from '../models/mate.model';

@Component({
  selector: 'app-mate-basic',
  templateUrl: './mate-basic.component.html',
  styleUrls: ['./mate-basic.component.scss'],
  imports: [IonThumbnail, IonRow, IonCol, IonLabel, IonIcon, LocalTimePipe, IonicBadgeComponent, IonImg]
})
export class MateBasicComponent {
  DATE_FORMATS = DATE_FORMATS;

  icons = { peopleOutline, bicycleOutline, calendarClear };
  mate = input<MateListItem>();
  @Input() dynamicClass = '';

}
