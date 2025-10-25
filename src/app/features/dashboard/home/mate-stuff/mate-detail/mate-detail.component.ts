import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonTitle, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { MateDetail } from '../models/mate.model';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { calendarClear, calendarOutline, mailOpenOutline, timeOutline } from 'ionicons/icons';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
@Component({
  selector: 'app-mate-detail',
  templateUrl: './mate-detail.component.html',
  styleUrls: ['./mate-detail.component.scss'],
  imports: [IonContent, IonTitle, HeaderComponent, IonThumbnail, IonGrid, IonRow, IonCol, IonBadge, IonLabel, IonIcon, IonFooter, IonicButtonComponent]
})
export class MateDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  icons = { calendarClear, calendarOutline, timeOutline, mailOpenOutline };

  mate?: MateDetail;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.mate = {
        id: +idParam,
        profileImg: 'assets/avatars/avatar1.jfif',
        name: 'Meera',
        location: 'Chicago',
        eventDateTime: '2025-10-20T16:00:00.000Z',
        requiredMembers: 8,
        confirmedMembers: 8,
        distanceOrDuration: '600 M',
        sport: 'Cycling',
        coords: { "lat": 13.0901, "lng": 80.2650 },
        description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`,
        members: [1, 2, 3, 4, 5],

      }
    } else {
      this.handleBack();
    }

  }

  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }


}
