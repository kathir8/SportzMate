import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { IonCol, IonIcon, IonImg, IonLabel, IonRow, IonThumbnail } from '@ionic/angular/standalone';
import { bicycleOutline, calendarClear, chatboxEllipses, peopleOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { CommonService } from 'src/app/core/services/common.service';
import { AcceptOrRejectComponent } from "src/app/shared/components/accept-or-reject/accept-or-reject.component";
import { IonicBadgeComponent } from 'src/app/shared/components/ionic-badge/ionic-badge.component';
import { EventBasic, SportType } from 'src/app/shared/models/shared.model';
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { Requests } from '../../../requests/models/requests.model';
import { AcceptOrReject } from '../models/mate.model';
import { MateService } from '../mate.service';

@Component({
  selector: 'app-mate-basic',
  templateUrl: './mate-basic.component.html',
  styleUrls: ['./mate-basic.component.scss'],
  imports: [IonThumbnail, IonRow, IonCol, IonLabel, IonIcon, LocalTimePipe, IonicBadgeComponent, IonImg, AcceptOrRejectComponent]
})
export class MateBasicComponent<T extends Requests | EventBasic> {
  readonly commonService = inject(CommonService);
  private readonly router = inject(Router);
  private readonly mateService = inject(MateService);
  readonly DATE_FORMATS = DATE_FORMATS;


  readonly icons = { peopleOutline, bicycleOutline, calendarClear, chatboxEllipses };
  readonly mate = input<T>();
  readonly dynamicClass = input<string>('');
  readonly reduceSize = input<boolean>(false);
  readonly isAccepted = output<AcceptOrReject>();

  acceptOrRejectEmit(resp:AcceptOrReject): void {
    this.isAccepted.emit({
      item: this.mate()! as Requests,
      ...resp
    });
  }

  profileInfo(event: MouseEvent) {
    event.stopPropagation();

    const m = this.mate();
    if (!m || this.dynamicClass() === 'from-my-event') return null;

    if ('eventCreator' in m) {
      return this.router.navigate(['profile'], {
        state: { profileUser: m.eventCreator }
      });
    }

    if ('interestedUser' in m) {
      return this.router.navigate(['profile'], {
        state: { profileUser: m.interestedUser }
      });
    }

    return this.router.navigate(['profile'], {
      state: { userID: m.eventId }
    });
  }


  eventStatus() {
    const m = this.mate();
    if (!m) return null;

    if ('status' in m) {
      return m.status;
    } else if (this.mateService.currentMateStatusForEvent()) {
      return this.mateService.currentMateStatusForEvent();
    }
    
    return null;
  }

  spotIcon() {
    const m = this.mate();
    if (!m) return 'cup-star';
    switch (m.sportId) {
      case SportType.Badminton:
        return 'badminton';
      case SportType.Cricket:
        return 'cricket';
      case SportType.Cycling:
        return 'bicycle';
      case SportType.Tennis:
        return 'tennis';
      case SportType.Football:
        return 'football';
      case SportType.Running:
        return 'running';
      case SportType.Swimming:
        return 'swimming';
      case SportType.Yoga:
        return 'yoga';
      case SportType.Basketball:
        return 'basketball';
      default:
        return 'cup-star';
    }
  }

  ngOnDestroy(){
    this.mateService.currentMateStatusForEvent.set(null);
  }
}
