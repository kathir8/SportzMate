import { Component, input, OnInit } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/angular/standalone';

export interface IonicAccordionItem {
  value: string;
  header: string;
  content: string;
}


@Component({
  selector: 'ionic-accordion',
  templateUrl: './ionic-accordion.component.html',
  styleUrls: ['./ionic-accordion.component.scss'],
  imports: [IonAccordionGroup, IonAccordion, IonItem, IonLabel],
})
export class IonicAccordionComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

   items = input<IonicAccordionItem[]>([]);

}
