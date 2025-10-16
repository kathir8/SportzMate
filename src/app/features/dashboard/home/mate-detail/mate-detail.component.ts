import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonTitle } from '@ionic/angular/standalone';
import { MateDetail } from '../models/mate.model';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
@Component({
  selector: 'app-mate-detail',
  templateUrl: './mate-detail.component.html',
  styleUrls: ['./mate-detail.component.scss'],
  imports: [IonContent, IonTitle, HeaderComponent]
})
export class MateDetailComponent implements OnInit {

  mate?: MateDetail;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.mate = {
        id: +idParam,
        profileImg: '',
        name: 'Christian Bale',
        location: 'Chicago',
        time: '20 Oct, 4 PM',
        requiredMembers: 8,
        confirmedMembers: 8,
        distanceOrDuration: '600 M',
        sport: 'Cycling',
        members: [1, 2, 3, 4, 5],
        description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here`
      }
    } else {
      this.handleBack();
    }

  }

  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }


}
