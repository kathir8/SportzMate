import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonIcon, IonInput, IonGrid, IonRow, IonCol, IonDatetime, IonTextarea, IonButton, ModalController } from '@ionic/angular/standalone';
import { calendarClearOutline, locationSharp, personOutline } from 'ionicons/icons';
@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.scss'],
  imports:[IonContent, IonItem, IonIcon, IonInput, IonGrid, IonRow, IonCol, IonDatetime, IonTextarea, IonButton, FormsModule]
})
export class CreateInviteComponent {
  icons = { personOutline, locationSharp, calendarClearOutline }
form = {
    name: '',
    location: '',
    players: '',
    datetime: '',
    description: ''
  };

  constructor(private modalCtrl: ModalController) {}

  submit() {
    this.modalCtrl.dismiss(this.form);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
