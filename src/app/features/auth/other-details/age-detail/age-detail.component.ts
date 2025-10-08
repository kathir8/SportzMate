import { Component, OnInit } from '@angular/core';
import { IonNavLink } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { InterestDetailComponent } from '../interest-detail/interest-detail.component';

@Component({
  selector: 'app-age-detail',
  templateUrl: './age-detail.component.html',
  styleUrls: ['./age-detail.component.scss'],
  imports:[IonNavLink, IonicButtonComponent]
})
export class AgeDetailComponent  implements OnInit {
interestComponent = InterestDetailComponent;
  constructor() { }

  ngOnInit() {}

}
