import { Component, effect, inject, input, TemplateRef, viewChild } from '@angular/core';
import { ChatDocument, RecievedUser } from '../chat.model';
import { Timestamp } from '@angular/fire/firestore';
import { formatChatListTime } from 'src/app/shared/utils/date-utils';
import { IonicVirtualScrollComponent } from 'src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-chat-list-items',
  templateUrl: './chat-list-items.component.html',
  styleUrls: ['./chat-list-items.component.scss'],
  imports: [IonicVirtualScrollComponent, CommonModule]
})
export class ChatListItemsComponent {

  private readonly router = inject(Router);
  private readonly chatService = inject(ChatService);

  readonly isPersonalChat = input<boolean>(false);

  readonly chats = input<ChatDocument[]>([]);
  readonly currentUserId = input<string>('');
  readonly onChatClick = input<(user: RecievedUser) => void>(() => {});

  private itemTemplateRef = viewChild('itemTemplate', { read: TemplateRef });
  private noDataTemplateRef = viewChild('noDataTemplate', { read: TemplateRef });

  get itemTemplate(): TemplateRef<any> | undefined {
    return this.itemTemplateRef();
  }

  get noDataTemplate(): TemplateRef<any> | undefined {
    return this.noDataTemplateRef();
  }
constructor() {
  effect(() => {
    console.log(this.chats());
    
  })
}
  formatTime(timestamp: Timestamp): string {
    if (!timestamp) return '';
    return formatChatListTime(new Timestamp(timestamp.seconds, timestamp.nanoseconds).toMillis());
  }

  getOtherUserId(chat: ChatDocument): string {
    return chat.participants.find(id => id !== this.currentUserId()) ?? '';
  }

  getOtherUser(chat: ChatDocument, userID: string): RecievedUser & { userID: string } {
    return {
      ...chat.participantDetails[userID],
      userID
    };
  }

  getUnreadCount(chat: ChatDocument): number {
    return chat.unreadCount?.[this.currentUserId()] ?? 0;
  }

   openChat(mate: RecievedUser & { userID: string }): void {
    this.router.navigate(['dashboard/chat'],
      {
        state: {
          recievedMate: { userID: mate.userID, profileImage: mate.profileImage, name: mate.name }
        }
      }
    );
  }

  openGroupChat(groupId: string, groupName: string): void {
     this.router.navigate(['dashboard/chat'],
      {
        state: {
          groupId: groupId,
          groupName: groupName
        }
      }
    );  
  }

  handleChatClick(user: RecievedUser & { userID: string }): void {
    this.onChatClick()(user);
  }
}

