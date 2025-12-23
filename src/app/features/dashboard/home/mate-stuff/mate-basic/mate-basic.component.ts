import { Component, computed, input, output } from '@angular/core';
import { IonCol, IonIcon, IonImg, IonLabel, IonRow, IonThumbnail } from '@ionic/angular/standalone';
import { bicycleOutline, calendarClear, chatboxEllipses, peopleOutline, thumbsDownOutline, thumbsUpOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { IonicBadgeComponent } from 'src/app/shared/components/ionic-badge/ionic-badge.component';
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { MyInvites, RequestedList } from '../../../invites/models/invite.model';
import { MateListItem } from '../models/mate.model';

@Component({
  selector: 'app-mate-basic',
  templateUrl: './mate-basic.component.html',
  styleUrls: ['./mate-basic.component.scss'],
  imports: [IonThumbnail, IonRow, IonCol, IonLabel, IonIcon, LocalTimePipe, IonicBadgeComponent, IonImg, IonicChipComponent]
})
export class MateBasicComponent<T extends MateListItem | MyInvites | RequestedList> {
  readonly DATE_FORMATS = DATE_FORMATS;

  readonly icons = { peopleOutline, bicycleOutline, calendarClear, chatboxEllipses, thumbsUpOutline, thumbsDownOutline };
  readonly mate = input<T>();
  readonly dynamicClass = input<string>('');
  readonly isAccepted = output<boolean>();

  readonly badgeInfo = computed(() => {
    const m = this.mate();
    if (!m) return null;

    if ('distanceOrDuration' in m) {
      return { type: 'distance', value: m.distanceOrDuration };
    }

    if ('chatCount' in m) {
      return { type: 'chat', value: m.chatCount };
    }

    return null;
  });

}
