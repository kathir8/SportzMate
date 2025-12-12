import { Component, computed, inject, Signal, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ChatMessage, ChatService } from './chat.service';
import { UserStore } from 'src/app/core/stores/user-store';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { happyOutline, attachOutline, sendOutline, closeOutline } from 'ionicons/icons';
import { IonicInputComponent } from "src/app/shared/components/ionic-input/ionic-input.component";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [IonContent, FormsModule, DatePipe, IonIcon, IonicInputComponent]
})
export class ChatComponent {

  private chatService = inject(ChatService);
  private userStore = inject(UserStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  icons = { happyOutline, attachOutline, sendOutline, closeOutline };

  currentUid = signal(this.userStore.getCurrent()?.id ?? 'unknown');
  receiverUid = signal('');
  showEmojiPicker = signal(false);
  emojiList = signal([
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


   ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.receiverUid.set(idParam);
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
    this.router.navigate(['/dashboard/chat']);
  }
}
