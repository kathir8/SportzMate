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


  private readonly currentUser = this.userStore.getCurrent();

  readonly currentUid = computed(() => {
    return this.currentUser()!.userID;
  });

  readonly icons = { happyOutline, attachOutline, sendOutline, closeOutline };

  private readonly receiverUid = signal(0);
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
  private readonly roomId = computed(() =>
    this.chatService.getRoomId(this.currentUid(), this.receiverUid())
  );

  readonly newMessage = signal('');

  readonly messages: Signal<ChatMessage[]> = toSignal(
    toObservable(this.roomId).pipe(
      switchMap(roomId => this.chatService.getMessages(roomId))
    ),
    { initialValue: [] }
  );


  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.receiverUid.set(parseInt(idParam));
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

  getMsgSide(senderId: number): 'sender' | 'reciever' {
    return senderId === this.currentUid() ? 'sender' : 'reciever';
  }

  isMessageFirstInGroup(currentSenderIsMe: number, index: number): boolean {
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
