import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonFooter, IonTitle } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { MateDetailContainerComponent } from "../home/mate-stuff/mate-detail-container/mate-detail-container.component";

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss'],
  imports: [IonContent, IonFooter, IonTitle, HeaderComponent, MateDetailContainerComponent, NgTemplateOutlet]

})
export class MatchDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly showInterestBtn = signal<boolean>(true);
 
  readonly id = signal<number>(0);
  readonly headingText = signal<string>('');
  readonly footerTpl = signal<TemplateRef<unknown> | null>(null);

  ngOnInit() {

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
    } else {
      this.handleBack();
    }

    const showInterestBtnParam = this.route.snapshot.paramMap.get('showInterestBtn');
    if(showInterestBtnParam){
      this.showInterestBtn.set(showInterestBtnParam === 'true');
    }
  }


  handleBack() {
    this.router.navigate(['/dashboard/home']);
  }

}
