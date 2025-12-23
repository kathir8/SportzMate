import { Component, effect, inject, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { HomeApiService } from '../../services/home-api-service';
import { MateDetailComponent } from "../mate-detail/mate-detail.component";
import { MateDetail } from '../models/mate.model';

@Component({
  selector: 'app-mate-detail-container',
  templateUrl: './mate-detail-container.component.html',
  styleUrls: ['./mate-detail-container.component.scss'],
  imports: [IonicButtonComponent, MateDetailComponent]
})

export class MateDetailContainerComponent {

  private homeApi = inject(HomeApiService);

  private readonly footerTemplate = viewChild<TemplateRef<unknown>>('footer');
  footerReady = output<TemplateRef<unknown>>();

  mate = signal<MateDetail>({} as MateDetail);
  mateId = input<number>(0);
  headingName = output<string>();

  constructor() {
    effect(() => {
      if (this.mateId()) {
        this.homeApi.getMateById(this.mateId()).subscribe((res) => {
          if (res) {
            this.mate.set(res);
            this.headingName.emit(res.sport);
          }
        });
      }
    });
  }


  ngAfterViewInit() {
    this.footerReady.emit(this.footerTemplate()!);
  }
}
