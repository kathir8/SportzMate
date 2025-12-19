import { Component, input } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/angular/standalone';
import { NgComponentOutlet } from '@angular/common';

export interface IonicAccordionItem {
  value: string;
  title: string;
  component: any;
  inputs?: Record<string, any>;
}


@Component({
  selector: 'ionic-accordion',
  templateUrl: './ionic-accordion.component.html',
  styleUrls: ['./ionic-accordion.component.scss'],
  imports: [IonAccordionGroup, IonAccordion, IonItem, IonLabel, NgComponentOutlet],
})
export class IonicAccordionComponent {

    items = input<IonicAccordionItem[]>([]);


}
