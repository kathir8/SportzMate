import { Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ChatMessage, ChatService } from './chat.service';
import { UserStore } from 'src/app/core/stores/user-store';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [IonContent, FormsModule,DatePipe]
})
export class ChatComponent {

  private chatService = inject(ChatService);
  private userStore = inject(UserStore);

  currentUid = signal(this.userStore.getCurrent()?.id ?? '');
  receiverUid = signal('');
  roomId = computed(() =>
    this.chatService.getRoomId(this.currentUid(), this.receiverUid())
  );

  newMessage = signal('');

  messages: Signal<ChatMessage[]> = toSignal(
    toObservable(this.roomId).pipe(
      switchMap(roomId => this.chatService.getMessages(roomId))
    ),
    { initialValue: [] }
  );


  constructor() {

     const navState = history.state as { receiverUid?: string };

    if (navState.receiverUid) {
      this.receiverUid.set(navState.receiverUid);
    }
  }


  send() {
    if (!this.newMessage().trim()) return;

    this.chatService.sendMessage(
      this.roomId(),
      this.currentUid(),
      this.newMessage()
    );

    this.newMessage.set('');
  }

}
