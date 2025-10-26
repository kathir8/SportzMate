import { UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonFooter, IonGrid, IonIcon, IonTitle } from '@ionic/angular/standalone';
import { calendarOutline, mailOpenOutline, timeOutline } from 'ionicons/icons';
import { DATE_FORMATS } from 'src/app/core/constants';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { LocalTimePipe } from 'src/app/shared/pipes/local-time';
import { HomeApiService } from '../../services/home-api-service';
import { MateBasicComponent } from "../mate-basic/mate-basic.component";
import { MateDetail } from '../models/mate.model';
@Component({
  selector: 'app-mate-detail',
  templateUrl: './mate-detail.component.html',
  styleUrls: ['./mate-detail.component.scss'],
  imports: [IonContent, IonTitle, HeaderComponent, IonGrid, IonIcon, IonFooter, IonicButtonComponent, LocalTimePipe, UpperCasePipe, MateBasicComponent]
})
export class MateDetailComponent implements OnInit {
  private homeApi = inject(HomeApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  DATE_FORMATS = DATE_FORMATS;

  icons = { calendarOutline, timeOutline, mailOpenOutline };

  mate?: MateDetail;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.homeApi.getMateById(idParam).subscribe((res) => {
        if (res) {
          this.mate = res;
        }
      });
    } else {
      this.handleBack();
    }

  }

  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }


}
