import { Component, effect, inject, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { UserStore } from 'src/app/core/stores/user-store';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { HomeApiService } from '../../services/home-api-service';
import { MateDetailComponent } from "../mate-detail/mate-detail.component";
import { EventDetailApiResp, MateDetail, requestJoinApi } from '../models/mate.model';
import { CommonStore } from 'src/app/core/stores/common-store';
import { EventBasic } from 'src/app/shared/models/shared.model';

@Component({
  selector: 'app-mate-detail-container',
  templateUrl: './mate-detail-container.component.html',
  styleUrls: ['./mate-detail-container.component.scss'],
  imports: [IonicButtonComponent, MateDetailComponent]
})

export class MateDetailContainerComponent {

  private readonly homeApi = inject(HomeApiService);
  private readonly userStore = inject(UserStore);
  private readonly toast = inject(IonicToastService);
  private readonly commonStore = inject(CommonStore);
  private readonly commonService = inject(CommonService);


  private readonly footerTemplate = viewChild<TemplateRef<unknown>>('footer');
  readonly footerReady = output<TemplateRef<unknown>>();
  readonly disableBtn = signal<boolean>(false);

  readonly mate = signal<EventBasic>({} as EventBasic);
  readonly eventId = input<number>(0);
  readonly headingName = output<string>();

  private readonly currentUser = this.userStore.getCurrent()!;


  constructor() {
    effect(() => {
      if (this.eventId()) {
        this.homeApi.getEventDetails(this.eventId()).subscribe((res:EventDetailApiResp) => {
          if (res.rspFlg) {
            this.mate.set(res.eventDetails);
            // this.headingName.emit(this.commonService.selectedSports(res.sportId)?.sportsName || '');
          }else{
            // this.handleBack();
          }
        });
      }
    });
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

      } else if(res.status !== 'PENDING'){
        this.disableBtn.set(false);
      }
    });
    
  }

  ngAfterViewInit() {
    this.footerReady.emit(this.footerTemplate()!);
  }
}
