import { Component, input, output, signal } from '@angular/core';
import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar } from '@ionic/angular/standalone';
import { chevronBackOutline, searchOutline, closeOutline } from 'ionicons/icons';

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
    chevronBackOutline,
    searchOutline,
    closeOutline
  };

  /* ------------------------------------
   Inputs (Parent → Child)
  ------------------------------------- */
  readonly showBackButton = input<boolean>(true);
  readonly headerClass = input<string>('');
  readonly enableSearch = input<boolean>(false);

  /* ------------------------------------
   Outputs (Child → Parent)
  ------------------------------------- */
  readonly backClicked = output<void>();
  readonly searchToggled = output<void>();
  readonly searchChanged = output<string>();

  /* ------------------------------------
   Internal state
  ------------------------------------- */
  readonly showSearchInput = signal<boolean>(false);

  /* ------------------------------------
   Event handlers
  ------------------------------------- */
  emitBackClick(): void {
    this.backClicked.emit();
  }

  toggleSearch(): void {
    this.showSearchInput.update(value => !value);
    this.searchToggled.emit();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchChanged.emit(input.value);
  }

  clearSearch(): void {
    this.searchChanged.emit('');
    this.showSearchInput.set(false);
  }
}
