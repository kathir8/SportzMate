import { DatePipe } from '@angular/common';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon, IonTitle } from '@ionic/angular/standalone';
import { attachOutline, closeOutline, happyOutline, sendOutline } from 'ionicons/icons';
import { switchMap } from 'rxjs';
import { UserStore } from 'src/app/core/stores/user-store';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonicInputComponent } from 'src/app/shared/components/ionic-input/ionic-input.component';
import { ChatMessage, ChatService } from './chat.service';
import { RecievedUser } from '../chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [IonTitle, IonContent, FormsModule, DatePipe, IonIcon, IonicInputComponent, HeaderComponent]
})
export class ChatComponent {

  private readonly chatService = inject(ChatService);
  private readonly userStore = inject(UserStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  // private readonly navHistory = inject(NavigationHistoryService);

  readonly icons = { happyOutline, attachOutline, sendOutline, closeOutline };

  private readonly recievedUser = signal<RecievedUser | null>(
    window.history.state?.recievedMate ?? null
  );

  private readonly currentUser = this.userStore.getCurrent();

  readonly currentUid = computed(() => {
    return this.currentUser()!.fcmID;
  });

  readonly receiverUid = computed(() => {
    return this.recievedUser()?.fcmID;
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
      switchMap(roomId => this.chatService.getMessages(roomId))
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
    this.router.navigate(['/dashboard/chat-list']);
  }
}
