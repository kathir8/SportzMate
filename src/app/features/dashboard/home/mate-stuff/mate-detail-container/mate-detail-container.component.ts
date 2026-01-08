import { Component, effect, inject, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { HomeApiService } from '../../services/home-api-service';
import { MateDetailComponent } from "../mate-detail/mate-detail.component";
import { MateDetail, requestJoinApi } from '../models/mate.model';
import { UserStore } from 'src/app/core/stores/user-store';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';

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


  private readonly footerTemplate = viewChild<TemplateRef<unknown>>('footer');
  readonly footerReady = output<TemplateRef<unknown>>();

  readonly mate = signal<MateDetail>({} as MateDetail);
  readonly eventId = input<number>(0);
  readonly headingName = output<string>();

  private readonly currentUser = this.userStore.getCurrent()!;


  constructor() {
    effect(() => {
      if (this.eventId()) {
        this.homeApi.getMateById(this.eventId()).subscribe((res) => {
          if (res) {
            this.mate.set(res);
            this.headingName.emit(res.sport);
          }
        });
      }
    });
  }

  requestJoin() {
    const obj: requestJoinApi = {
      eventId: this.eventId(),
      userId: this.currentUser()!.userID
    }
    this.homeApi.requestJoin(obj).subscribe((res) => {
      if (res.rspFlg) {

      } else {
        this.toast.show(res.rspMsg);
      }
    });

  }

  ngAfterViewInit() {
    this.footerReady.emit(this.footerTemplate()!);
  }
}
