import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonNavLink, IonFooter } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { InterestDetailComponent } from '../interest-detail/interest-detail.component';

@Component({
  selector: 'app-age-detail',
  templateUrl: './age-detail.component.html',
  styleUrls: ['./age-detail.component.scss'],
  imports: [IonNavLink, IonicButtonComponent, IonFooter]
})
export class AgeDetailComponent {

  interestComponent = InterestDetailComponent;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  startAge = 15;
  endAge = 50;
  ages: number[] = Array.from({ length: (this.endAge - this.startAge + 1) }, (_, i) => i + this.startAge);
  selectedAge = 29;
  private readonly ITEM_GAP = 24;


  constructor() { }

  ngAfterViewInit() {
    setTimeout(() => this.centerOnAge(this.selectedAge));
  }

  onScroll() {
    const el = this.scrollContainer.nativeElement;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.children[0].clientWidth + this.ITEM_GAP;
    const centerIndex = Math.round(scrollLeft / itemWidth);
    this.selectedAge = this.ages[centerIndex];
  }

  centerOnAge(age: number) {
    const el = this.scrollContainer.nativeElement;
    const index = this.ages.indexOf(age);
    if (index === -1) return;

    const itemWidth = el.children[0].clientWidth + this.ITEM_GAP;
    const centerOffset = el.offsetWidth / 2 - (el.children[0].clientWidth / 2);
    el.scrollTo({
      left: index * itemWidth - centerOffset,
      behavior: 'smooth',
    });
  }
}
