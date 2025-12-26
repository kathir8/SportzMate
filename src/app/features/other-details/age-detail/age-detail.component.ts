import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { IonContent, IonFooter, IonNavLink } from '@ionic/angular/standalone';
import { UserStore } from 'src/app/core/stores/user-store';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { InterestDetailComponent } from '../interest-detail/interest-detail.component';
import { SignalService } from 'src/app/core/services/signal.service';

@Component({
  selector: 'app-age-detail',
  templateUrl: './age-detail.component.html',
  styleUrls: ['./age-detail.component.scss'],
  imports: [IonNavLink, IonicButtonComponent, IonFooter, IonContent]
})
export class AgeDetailComponent {
  static readonly navId = 'AgeDetail';

  private readonly userStore = inject(UserStore);
  private readonly signalService = inject(SignalService);

  readonly interestComponent = InterestDetailComponent;
  private readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  private readonly startAge = 15;
  private readonly endAge = 50;
  private readonly ITEM_GAP = 24;

  private scrollRafId: number | null = null;


  readonly currentUser = this.userStore.getCurrent()!;
  readonly selectedAge = signal<string>(this.currentUser()?.age || '25');


  readonly ages = computed<string[]>(() =>
    Array.from(
      { length: this.endAge - this.startAge + 1 },
      (_, index) => String(this.startAge + index)
    )
  );

  ngAfterViewInit() {
    if (this.currentUser()) {
      queueMicrotask(() => this.centerOnAge(this.selectedAge()));
    }
  }

  onScroll() {
    if (this.scrollRafId !== null) return;

    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      this.handleScroll();
    });
  }

  private handleScroll(): void {
    const el = this.scrollContainer()?.nativeElement;
    if (!el || el.children.length === 0) return;

    const itemWidth = el.children[0].clientWidth + this.ITEM_GAP;
    const centerIndex = Math.round(el.scrollLeft / itemWidth);
    const age = this.ages()[centerIndex];

    if (age !== undefined && age !== this.selectedAge()) {
      this.selectedAge.set(age);
      this.updateAge();
    }
  }

  centerOnAge(age: string) {
    const el = this.scrollContainer()?.nativeElement;
    if (!el || el.children.length === 0) return;

    const index = this.ages().indexOf(age);
    if (index === -1) return;

    const itemWidth = el.children[0].clientWidth + this.ITEM_GAP;
    const centerOffset = el.offsetWidth / 2 - (el.children[0].clientWidth / 2);
    el.scrollTo({
      left: index * itemWidth - centerOffset,
      behavior: 'smooth',
    });
  }


  updateAge(): void {
    this.signalService.patchSignal(this.currentUser, {
      age: this.selectedAge()
    });
  }
}
