import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonNavLink } from '@ionic/angular/standalone';
import { IonicButtonComponent } from 'src/app/shared/components/ionic-button/ionic-button.component';
import { InterestDetailComponent } from '../interest-detail/interest-detail.component';

@Component({
  selector: 'app-age-detail',
  templateUrl: './age-detail.component.html',
  styleUrls: ['./age-detail.component.scss'],
  imports: [IonNavLink, IonicButtonComponent]
})
export class AgeDetailComponent {
  interestComponent = InterestDetailComponent;
    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  ages: number[] = [];
  selectedAge = 29;

  constructor() { }

   ngOnInit() {
    this.ages = Array.from({ length: 33 }, (_, i) => i + 18); // 18 → 50
  }

  ngAfterViewInit() {
    // Set scroll to selectedAge initially (centered)
    setTimeout(() => this.centerOnAge(this.selectedAge), 100);
  }

    onScroll() {
    const el = this.scrollContainer.nativeElement;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.children[0].clientWidth + 24; // 24 = gap
    const centerIndex = Math.round(scrollLeft / itemWidth) + 1;
    this.selectedAge = this.ages[centerIndex] || this.selectedAge;
  }

  centerOnAge(age: number) {
    const el = this.scrollContainer.nativeElement;
    const index = this.ages.indexOf(age);
    const itemWidth = el.children[0].clientWidth + 24;
    el.scrollTo({
      left: (index - 1) * itemWidth,
      behavior: 'smooth',
    });
  }
  

}
