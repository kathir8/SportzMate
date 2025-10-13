import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonTabs, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { chatbubblesSharp, homeSharp, mailOpenSharp, menuOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonIcon, IonTabs, IonTabBar, IonTabButton, FormsModule]
})
export class DashboardComponent {
  icons = { homeSharp, chatbubblesSharp, menuOutline, mailOpenSharp };

}
