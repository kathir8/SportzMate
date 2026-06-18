import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, TemplateRef, viewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { IonicVirtualScrollComponent } from 'src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component';
import { formatChatListTime } from 'src/app/shared/utils/date-utils';
import { ChatDocument, RecievedUser } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-list-items',
  templateUrl: './chat-list-items.component.html',
  styleUrls: ['./chat-list-items.component.scss'],
  imports: [IonicVirtualScrollComponent, CommonModule]
})
export class ChatListItemsComponent {

  protected readonly chatService = inject(ChatService);

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

  handleChatClick(user: RecievedUser & { userID: string }): void {
    this.onChatClick()(user);
  }
}

