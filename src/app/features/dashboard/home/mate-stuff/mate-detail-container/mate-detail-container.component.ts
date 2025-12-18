import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonFooter, IonTitle } from '@ionic/angular/standalone';
import { calendarOutline, mailOpenOutline, timeOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { HomeApiService } from '../../services/home-api-service';
import { MateDetailComponent } from "../mate-detail/mate-detail.component";
import { MateDetail } from '../models/mate.model';
import { GroupInviteComponent } from "../../../invites/my-group-list/group-invite/group-invite.component";

@Component({
  selector: 'app-mate-detail-container',
  templateUrl: './mate-detail-container.component.html',
  styleUrls: ['./mate-detail-container.component.scss'],
  imports: [IonContent, IonTitle, HeaderComponent, IonFooter, IonicButtonComponent, MateDetailComponent, GroupInviteComponent]
})

export class MateDetailContainerComponent implements OnInit {

  private homeApi = inject(HomeApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  DATE_FORMATS = DATE_FORMATS;

  icons = { calendarOutline, timeOutline, mailOpenOutline };

  mate = signal<MateDetail>({} as MateDetail);
  groupId = input<number | null>(null);
  dynamicClass = input<string>('');

  ngOnInit() {
    if (this.dynamicClass() !== 'from-group') {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.homeApi.getMateById(idParam).subscribe((res) => {
          if (res) {
            this.mate.set(res);
          }
        });

      } else {
        this.handleBack();
      }
    }
  }


  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }
}
