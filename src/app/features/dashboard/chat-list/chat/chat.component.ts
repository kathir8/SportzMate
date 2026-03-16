import { Location } from '@angular/common';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonTitle } from '@ionic/angular/standalone';
import { attachOutline, closeOutline, happyOutline, sendOutline } from 'ionicons/icons';
import { map, switchMap } from 'rxjs';
import { UserStore } from 'src/app/core/stores/user-store';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { formatChatMessageTime } from 'src/app/shared/utils/date-utils';
import { RecievedUser } from '../chat.model';
import { ChatMessage, ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [IonTitle, IonContent, FormsModule, IonIcon, IonicInputComponent, HeaderComponent]
})
export class ChatComponent {

  private readonly chatService = inject(ChatService);
  private readonly userStore = inject(UserStore);
  private location = inject(Location);


  readonly icons = { happyOutline, attachOutline, sendOutline, closeOutline };

  readonly recievedUser = signal<RecievedUser | null>(
    window.history.state?.recievedMate ?? null
  );

  private readonly currentUser = this.userStore.getCurrent();

  readonly currentUid = computed(() => {
    return this.currentUser()!.userID;
  });

  readonly receiverUid = computed(() => {
    return this.recievedUser()?.userID;
  });


  readonly showEmojiPicker = signal(false);
  readonly emojiList = signal([
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
    "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
    "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
    "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
    "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯",
    "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐",
    "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈",
    "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾",
    "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿",
    "😾", "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤏", "✌️", "🤞",
    "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
    "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝",
    "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂",
    "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁", "👅", "👄", "💋",
    "🩸", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍",
    "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟",
    "🔥", "✨", "🌟", "💫", "💥", "💢", "💦", "💧", "💤", "🕳",
    "🎉", "🎊", "🎈", "🎂", "🎁", "🕯", "💣"
  ]);
  private readonly roomId = signal('');

  readonly newMessage = signal('');

  readonly messages: Signal<ChatMessage[]> = toSignal(
    toObservable(this.roomId).pipe(
      switchMap(roomId => this.chatService.getMessages(roomId)),
      map(messages =>
        messages.map(msg => ({
          ...msg,
          updatedAt: new Timestamp(
            msg.timestamp.seconds,
            msg.timestamp.nanoseconds
          )
        }))
      )
    ),
    { initialValue: [] }
  );


  async ngOnInit() {
    if (this.currentUid() && this.receiverUid()) {
      this.roomId.set(await this.chatService.getOrCreateChat(this.currentUser()!, this.recievedUser()!));
    } else {
      this.handleBack();
    }

  }

  handleEmojiClick(emoji: string) {
    this.newMessage.set(this.newMessage() + emoji);
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

  getMsgSide(senderId: string): 'sender' | 'reciever' {
    return senderId === this.currentUid() ? 'sender' : 'reciever';
  }

  formatMsgTime(timestamp: Timestamp): string {

    if (!timestamp) return '';

    const date = timestamp.toDate();
    return formatChatMessageTime(date.getTime());
  }

  isMessageFirstInGroup(currentSenderIsMe: string, index: number): boolean {
    // 1. Check if it's the very first message
    if (index === 0) {
      return true;
    }

    // 2. Check if the sender is different from the previous message's sender
    const previousMessage = this.messages()[index - 1];
    return previousMessage.senderId !== currentSenderIsMe;
  }

  handleBack() {
    this.location.back();
  }
}
