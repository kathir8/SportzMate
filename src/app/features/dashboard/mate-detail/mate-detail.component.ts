import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IonContent, IonFooter, IonGrid, IonIcon, IonTitle } from '@ionic/angular/standalone';
import { calendarOutline, mailOpenOutline, timeOutline } from 'ionicons/icons';
import { filter } from 'rxjs';
import { DATE_FORMATS } from 'src/app/core/constants';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonStore } from 'src/app/core/stores/common-store';
import { UserStore } from 'src/app/core/stores/user-store';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonicButtonComponent } from "src/app/shared/components/ionic-button/ionic-button.component";
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { EventBasic } from 'src/app/shared/models/shared.model';
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { MateBasicComponent } from "../home/mate-stuff/mate-basic/mate-basic.component";
import { EventDetailApiResp, requestJoinApi } from '../home/mate-stuff/models/mate.model';
import { HomeApiService } from '../home/services/home-api-service';

@Component({
  selector: 'app-mate-detail',
  templateUrl: './mate-detail.component.html',
  styleUrls: ['./mate-detail.component.scss'],
  imports: [IonContent, IonFooter, IonTitle, HeaderComponent, IonicButtonComponent, MateBasicComponent, IonGrid, IonIcon, LocalTimePipe, UpperCasePipe, CommonModule]

})
export class MateDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly homeApi = inject(HomeApiService);
  private readonly userStore = inject(UserStore);
  private readonly toast = inject(IonicToastService);
  private readonly commonStore = inject(CommonStore);
  private readonly commonService = inject(CommonService);


  readonly showInterestBtn = signal<boolean>(true);
  readonly fromPage = signal<string>('');
  readonly disableBtn = signal<boolean>(false);

  private readonly currentUser = this.userStore.getCurrent()!;


  readonly eventId = signal<number>(0);
  readonly headingText = signal<string>('');
  readonly mate = signal<EventBasic>({} as EventBasic);

  readonly fromMyEvent = input<number | null>(null);

  readonly DATE_FORMATS = DATE_FORMATS;

  readonly icons = { calendarOutline, timeOutline, mailOpenOutline };

  readonly AcceptedRequest = signal<any[]>([]);

  readonly dynamicClass = computed(() => {
    if (!!this.fromMyEvent()) {
      return 'from-my-event';
    }
    if (this.showInterestBtn()) {
      return 'from-mate-detail';
    }
    return 'from-my-request';
  });

  constructor() {
    effect(() => {
      if (this.fromMyEvent()) {
        this.eventId.set(this.fromMyEvent()!);
      }
    });

    effect(() => {
      if (this.eventId()) {
        this.homeApi.getEventDetails(this.eventId()).subscribe((res: EventDetailApiResp) => {
          if (res.rspFlg) {
            // this.headingText.set(this.commonService.selectedSports(res.sportId)?.sportsName || '');
            this.mate.set(res.eventDetails);
            if (res.acceptedRequests) {
              this.AcceptedRequest.set(res.joinRequests.filter(x => x.approvalId === 3) || []);
            }

          } else {
            this.handleBack();
          }
        });
      }
    });
  }

  ngOnInit() {

    if (this.fromMyEvent()) {
      return;
    }

    this.initializeRouteListeners();
  }

  private initializeRouteListeners(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const state = history.state;

        if (state?.navigationId) {
          this.fromPage.set(state.fromPage ?? null);
          this.showInterestBtn.set(!!state.showInterestBtn);
        }
      });

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const idParam = params.get('eventId');

        if (idParam) {
          this.eventId.set(Number(idParam));
        } else {
          this.handleBack();
        }
      });
  }


  handleBack() {
    const url = this.fromMyEvent() ? '/dashboard/events' : (this.showInterestBtn() ? '/dashboard/home' : '/dashboard/requests');
    this.router.navigate([url]);
  }


  requestJoin() {
    this.disableBtn.set(true);
    const obj: requestJoinApi = {
      eventId: this.eventId(),
      userId: this.currentUser()!.userID
    }
    this.homeApi.requestJoin(obj).subscribe((res) => {
      this.toast.show(res.rspMsg);
      if (res.rspFlg) {
        this.commonStore.setMatchActionEventId(this.eventId());

      } else if (res.status !== 'PENDING') {
        this.disableBtn.set(false);
      }
    });
  }

}
