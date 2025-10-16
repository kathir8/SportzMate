import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { chevronBackOutline } from 'ionicons/icons';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonIcon]
})
export class HeaderComponent {
  icons = { chevronBackOutline };
  @Input() showBackButton = true;
  @Output() backClicked = new EventEmitter<null>();
}
