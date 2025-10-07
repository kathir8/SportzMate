import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'ionic-button',
  templateUrl: './ionic-button.component.html',
  styleUrls: ['./ionic-button.component.scss'],
  imports:[IonButton]
})
export class IonicButtonComponent {

  @Input() color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning' | 'light' | 'medium' | 'dark' = 'primary';
  @Input() expand: 'full' | 'block' | 'default' = 'block';
  @Input() size: 'small' | 'default' | 'large' = 'default';
  @Input() disabled:boolean = false;
  @Input() fill: 'clear' | 'outline' | 'solid' = 'solid';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() shape: 'round' | 'default' | 'circle' = 'default';

  @Output() ionClick = new EventEmitter<void>();


   onClick() {
    if (!this.disabled) {
      this.ionClick.emit();
    }
  }

}
