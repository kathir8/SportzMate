import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonChip } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-chip',
  templateUrl: './ionic-chip.component.html',
  styleUrls: ['./ionic-chip.component.scss'],
  imports: [IonChip]
})
export class IonicChipComponent {

  @Input() color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning' | 'light' | 'medium' | 'dark' = 'primary';
  @Input() outline:boolean = false;
  @Input() disabled:boolean = false;
  @Input() dynamicClass: any = {};

  @Output() ionClick = new EventEmitter<void>();

  onClick() {
    this.ionClick.emit();
  }

}
