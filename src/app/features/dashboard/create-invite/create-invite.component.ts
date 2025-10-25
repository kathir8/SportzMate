import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonIcon, IonInput, IonRow, IonCol, IonTextarea, IonButton, ModalController } from '@ionic/angular/standalone';
import { calendarClearOutline, locationSharp, personOutline } from 'ionicons/icons';
@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.scss'],
  imports: [IonContent, IonItem, IonIcon, IonInput, IonRow, IonCol, IonTextarea, IonButton, FormsModule]
})
export class CreateInviteComponent {
  private modalCtrl = inject(ModalController);

  icons = { personOutline, locationSharp, calendarClearOutline }
  form = {
    name: '',
    location: '',
    players: '',
    datetime: '',
    description: ''
  };


  submit() {
    this.modalCtrl.dismiss(this.form);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
