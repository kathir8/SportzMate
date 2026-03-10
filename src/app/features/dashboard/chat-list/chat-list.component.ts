import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, Firestore, query, Timestamp, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonContent, IonTitle } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { UserStore } from 'src/app/core/stores/user-store';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { formatChatListTime } from 'src/app/shared/utils/date-utils';
import { ChatDocument, RecievedUser } from './chat.model';

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
  collection(this.firestore, 'messages'),
  where('participants', 'array-contains', 'b6dTrM6L25SCAERwTy2NOEvyrpH2'),
  // orderBy('updatedAt', 'desc')
);


  private chatsObservable = collectionData(this.chatsQuery, {
  idField: 'chatId'
}) as Observable<ChatDocument[]>;

  readonly filteredChats = toSignal(this.chatsObservable, { initialValue: [] });

  constructor() {
    effect(() => {
      console.log('Current user FCMID:', this.currentUser()?.fcmID);
      console.log('Filtered chats:', this.filteredChats());
    });
  }


  formatTime(timestamp: Timestamp): string {
      if (!timestamp) return '';
    return formatChatListTime(new Timestamp(timestamp.seconds, timestamp.nanoseconds).toMillis());
  }

  getOtherUserId(chat: ChatDocument): string {
    return chat.participants.find(id => id !== this.currentUser()!.fcmID) ?? '';
  }

  getOtherUser(chat: ChatDocument, fcmID: string): RecievedUser & { fcmID: string } {
    return {
      ...chat.participantDetails[fcmID],
      fcmID
    };
  }

  getUnreadCount(chat: ChatDocument): number {
    return chat.unreadCount?.[this.currentUser()!.fcmID] ?? 0;
  }


  // filteredChats = chats.filter((chat) =>
  //   chat.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );


  openChat(mate: RecievedUser) {

     this.router.navigate(['dashboard/chat'],
       {
        state: {
          fromUrl: this.router.url,
          recievedMate: { fcmID: mate.fcmID, profileImage: mate.profileImage, name: mate.name }
        }
      }
    );

  }

}
