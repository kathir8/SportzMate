import { Component, input, output } from '@angular/core';
import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar } from '@ionic/angular/standalone';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonIcon],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  /* ------------------------------------
   Icons (static config)
  ------------------------------------- */
  readonly icons = {
    chevronBackOutline
  };

  /* ------------------------------------
   Inputs (Parent → Child)
  ------------------------------------- */
  showBackButton = input<boolean>(true);
  headerClass = input<string>('');

  /* ------------------------------------
   Outputs (Child → Parent)
  ------------------------------------- */
  backClicked = output<void>();

  /* ------------------------------------
   Event handler
  ------------------------------------- */
  emitBackClick(): void {
    this.backClicked.emit();
  }
}
