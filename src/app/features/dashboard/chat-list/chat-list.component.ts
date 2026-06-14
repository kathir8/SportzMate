import { Component, inject, signal, computed } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, Firestore, query, Timestamp, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonContent, IonTitle } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { UserStore } from 'src/app/core/stores/user-store';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { ChatDocument, RecievedUser } from './chat.model';
import { ChatListItemsComponent } from './chat-list-items/chat-list-items.component';
import { IonicAccordionComponent, IonicAccordionItem } from 'src/app/shared/components/ionic-accordion/ionic-accordion.component';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  imports: [IonTitle, IonContent, HeaderComponent, ChatListItemsComponent, IonicAccordionComponent]
})
export class ChatListComponent {

  private readonly router = inject(Router);

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private readonly userStore = inject(UserStore);

  protected readonly currentUser = this.userStore.getCurrent();


  protected readonly personalChats = signal<ChatDocument[]>([]);
  protected readonly filteredPersonalChats = signal<ChatDocument[]>([]);
  protected readonly groupChats = signal<ChatDocument[]>([]);
  protected readonly filteredGroupChats = signal<ChatDocument[]>([]);
  protected readonly searchQuery = signal<string>('');

  protected readonly hasPersonalChats = computed(() => this.filteredPersonalChats().length > 0);
  protected readonly hasGroupChats = computed(() => this.filteredGroupChats().length > 0);
  protected readonly hasPersonalChatsEver = computed(() => this.personalChats().length > 0);
  protected readonly hasGroupChatsEver = computed(() => this.groupChats().length > 0);
  protected readonly shouldShowAccordion = computed(() => this.hasPersonalChatsEver() && this.hasGroupChatsEver());
  protected readonly hasOnlyOneType = computed(() => {
    const personal = this.hasPersonalChatsEver();
    const group = this.hasGroupChatsEver();
    return (personal && !group) || (!personal && group);
  });

  protected readonly onChatClickHandler =
    (user: RecievedUser): void => {
      this.openChat(user);
    };

  protected readonly accordionItems = computed<IonicAccordionItem[]>(() => {
    if (this.shouldShowAccordion()) {
      return [
        {
          value: 'groupChats',
          title: `Group Chats (${this.filteredGroupChats().length})`,
          component: ChatListItemsComponent,
          inputs: {
            chats: this.filteredGroupChats(),
            currentUserId: this.currentUser()?.userID || '',
            onChatClick:this.onChatClickHandler,
            isPersonalChat: false
          }
        },
        {
          value: 'personalChats',
          title: `Personal Chats (${this.filteredPersonalChats().length})`,
          component: ChatListItemsComponent,
          inputs: {
            chats: this.filteredPersonalChats(),
            currentUserId: this.currentUser()?.userID || '',
            onChatClick:this.onChatClickHandler,
            isPersonalChat: true
          }
        }
      ];
    }
    return [];
  });

  constructor() {
    this.loadChats();
  }


  private loadChats() {
    const chatsQuery = query(
      collection(this.firestore, 'messages'),
      where('participants', 'array-contains', this.currentUser()!.userID),
      // orderBy('updatedAt', 'desc')
    );

    const chatsObservable = collectionData(chatsQuery, {
      idField: 'chatId'
    }) as Observable<ChatDocument[]>;

    chatsObservable.subscribe((chats) => {
      this.personalChats.set(chats);
      this.filterChats();
    });

    const chatsGroupQuery = query(
      collection(this.firestore, 'groups'),
      where('members', 'array-contains', this.currentUser()!.userID)
    );

    const chatsGroupObservable = collectionData(chatsGroupQuery, {
      idField: 'chatId'
    }) as Observable<ChatDocument[]>;

    chatsGroupObservable.subscribe((chats) => {
      const updatedChats = chats.map(chat => ({
        ...chat,
        participants: chat.members
      }));
      this.groupChats.set(updatedChats);
      this.filterChats();
    });
  }

  private filterChats(): void {
    const query = this.searchQuery().toLowerCase();

    if (!query) {
      this.filteredPersonalChats.set(this.personalChats());
      this.filteredGroupChats.set(this.groupChats());
      return;
    }

    this.filteredPersonalChats.set(
      this.personalChats().filter(chat => this.matchesChatSearch(chat, query))
    );
    this.filteredGroupChats.set(
      this.groupChats().filter(chat => this.matchesChatSearch(chat, query))
    );
  }

  private matchesChatSearch(chat: ChatDocument, query: string): boolean {
    // Search in participant names
    for (const participantDetails of Object.values(chat.participantDetails)) {
      if (participantDetails.name.toLowerCase().includes(query)) {
        return true;
      }
    }
    // Search in last message
    if (chat.lastMessage.toLowerCase().includes(query)) {
      return true;
    }
    return false;
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery.set(query);
    this.filterChats();
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

}
