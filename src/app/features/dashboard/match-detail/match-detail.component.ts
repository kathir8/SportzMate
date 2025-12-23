import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonFooter, IonTitle } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { MateDetailContainerComponent } from "../home/mate-stuff/mate-detail-container/mate-detail-container.component";
import { GroupInviteComponent } from '../invites/my-group-list/group-invite/group-invite.component';

type MatchType = 'group' | 'mate';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss'],
  imports: [IonContent, IonFooter, IonTitle, HeaderComponent, GroupInviteComponent, MateDetailContainerComponent, NgTemplateOutlet]

})
export class MatchDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  type = signal<'group' | 'mate'>('mate');
  private isMatchType(value: string | null): value is MatchType {
    return value === 'group' || value === 'mate';
  }

  readonly isGroup = computed(() => this.type() === 'group');

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

    const typeParam = this.route.snapshot.paramMap.get('type');
    if (this.isMatchType(typeParam)) {
      this.type.set(typeParam);
    } else {
      this.handleBack();
    }
  }


  handleBack() {
    if (this.isGroup()) {
      this.router.navigate(['/dashboard/invites']);
    } else {
      this.router.navigate(['/dashboard/home']);
    }
  }

}
