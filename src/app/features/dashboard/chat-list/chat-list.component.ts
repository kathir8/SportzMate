import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, Firestore, orderBy, query, Timestamp, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonContent, IonTitle } from '@ionic/angular/standalone';
import { UserStore } from 'src/app/core/stores/user-store';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { formatChatListTime } from 'src/app/shared/utils/date-utils';
import { ChatDocument } from './chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  imports: [IonTitle, IonContent, HeaderComponent]

})
export class ChatListComponent {

  private readonly router = inject(Router);

   private firestore = inject(Firestore);
  private auth = inject(Auth);
    private readonly userStore = inject(UserStore);
  
      private readonly currentUser = this.userStore.getCurrent();

        private chatsQuery = query(
    collection(this.firestore, 'chats'),
    where('participants', 'array-contains', this.currentUser()!.fcmID),
    orderBy('updatedAt', 'desc')
  );

       private chatsObservable = collectionData(this.chatsQuery, {
    idField: 'chatId'
  }) as unknown as import('rxjs').Observable<ChatDocument[]>;
  readonly filteredChats = toSignal(this.chatsObservable, { initialValue: [] });


  formatTime(timestamp: Timestamp): string {
   return formatChatListTime(timestamp.toMillis());
  }

  getOtherUserId(chat: ChatDocument): string {
    return chat.participants.find(id => id !== this.currentUser()!.fcmID) ?? '';
  }

  getUnreadCount(chat: ChatDocument): number {
    return chat.unreadCount?.[this.currentUser()!.fcmID] ?? 0;
  }





























  // filteredChats = chats.filter((chat) =>
  //   chat.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );


  openChat(id: string) {
    this.router.navigate(['dashboard/chat', id]);

  }

}
