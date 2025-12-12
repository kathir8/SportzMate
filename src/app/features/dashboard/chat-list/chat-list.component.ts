import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  imports: [IonContent]

})
export class ChatListComponent {

  private router = inject(Router);

  constructor() { }

  openChat(id:string) {
    this.router.navigate(['dashboard/chat', id]);

  }

}
