import { Component, computed, Input, input } from '@angular/core';
import { IonCol, IonIcon, IonImg, IonLabel, IonRow, IonThumbnail } from '@ionic/angular/standalone';
import { bicycleOutline, calendarClear, chatboxEllipses, peopleOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { IonicBadgeComponent } from 'src/app/shared/components/ionic-badge/ionic-badge.component';
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { MateListItem } from '../models/mate.model';
import { MyInvites } from '../../../invites/models/invite.model';

@Component({
  selector: 'app-mate-basic',
  templateUrl: './mate-basic.component.html',
  styleUrls: ['./mate-basic.component.scss'],
  imports: [IonThumbnail, IonRow, IonCol, IonLabel, IonIcon, LocalTimePipe, IonicBadgeComponent, IonImg]
})
export class MateBasicComponent<T extends MateListItem | MyInvites> {
  DATE_FORMATS = DATE_FORMATS;

  icons = { peopleOutline, bicycleOutline, calendarClear, chatboxEllipses };
  mate = input<T>();
  @Input() dynamicClass = '';

  getDistanceOrDuration(): string | null {
    const m = this.mate();
    return m && 'distanceOrDuration' in m ? m.distanceOrDuration : null;
  }

  getChatCount(): number | null {
    const m = this.mate();
    return m && 'chatCount' in m ? m.chatCount : null;
  }

   badgeInfo = computed(() => {
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
