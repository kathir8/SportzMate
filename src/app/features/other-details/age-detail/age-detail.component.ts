import { Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { IonContent, IonFooter, IonNavLink } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { InterestDetailComponent } from '../interest-detail/interest-detail.component';

@Component({
  selector: 'app-age-detail',
  templateUrl: './age-detail.component.html',
  styleUrls: ['./age-detail.component.scss'],
  imports: [IonNavLink, IonicButtonComponent, IonFooter, IonContent]
})
export class AgeDetailComponent {
  static readonly navId = 'AgeDetail';

  readonly interestComponent = InterestDetailComponent;
  private readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  private readonly startAge = 15;
  private readonly endAge = 50;
  private readonly ITEM_GAP = 24;

  readonly selectedAge = signal<number>(29);


  readonly ages = computed<number[]>(() =>
    Array.from(
      { length: this.endAge - this.startAge + 1 },
      (_, index) => this.startAge + index
    )
  );
  
  ngAfterViewInit() {
    queueMicrotask(() => this.centerOnAge(this.selectedAge()));
  }

  onScroll() {
    const el = this.scrollContainer()?.nativeElement;
    if (!el || el.children.length === 0) return;
    const itemWidth = el.children[0].clientWidth + this.ITEM_GAP;
    const centerIndex = Math.round(el.scrollLeft / itemWidth);
    const age = this.ages()[centerIndex];
    if (age !== undefined) {
      this.selectedAge.set(age);
    }
  }

  centerOnAge(age: number) {
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
}
