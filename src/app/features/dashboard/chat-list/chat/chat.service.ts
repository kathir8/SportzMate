import { computed, inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc } from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { UserDetail } from 'src/app/core/model/user.model';
import { UserStore } from 'src/app/core/stores/user-store';
import { RecievedUser } from '../chat.model';


export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  updatedAt: Timestamp;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private readonly firestore = inject(Firestore);
  private readonly userStore = inject(UserStore);

  private readonly currentUser = this.userStore.getCurrent();

  readonly currentUid = computed(() => {
    return this.currentUser()?.userID;
  });

  // Create a unique room ID for two users
  getRoomId(uid1: string, uid2: string): string {
    return [uid1, uid2].sort().join('_');
  }



  //  Call this when user opens a chat / clicks on a user to chat
  async getOrCreateChat(currentUser: UserDetail, recievedUser: RecievedUser): Promise<string> {
    const roomId = this.getRoomId(currentUser.fcmID, recievedUser.fcmID);

    const chatDocRef = doc(this.firestore, 'messages', roomId);
    const chatSnap = await getDoc(chatDocRef);

    if (!chatSnap.exists()) {
      // 🆕 Chat doesn't exist — create it with participants field
      await setDoc(chatDocRef, {
        participants: [currentUser.fcmID, recievedUser.fcmID],
        participantDetails:{
          [currentUser.fcmID] : { name: currentUser.name, profileImage: currentUser.profileImage ?? '' },
          [recievedUser.fcmID] : { name: recievedUser.name, profileImage: recievedUser.profileImage ?? '' },
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: ''
      });
    }

    return roomId; // return roomId to use in sendMessage
  }

  // Send Message
  async sendMessage(roomId: string, senderId: string, text: string) {

    try {

      // 1. Add message to subcollection
      const chatRef = collection(this.firestore, `messages/${roomId}/chat`);

      await addDoc(chatRef, {
        senderId,
        text,
        timestamp: serverTimestamp(),
      });

      // 2. Update parent document fields (so query can find it)
      const roomRef = doc(this.firestore, 'messages', roomId);
      await updateDoc(roomRef, {
        updatedAt: serverTimestamp(),
        lastMessage: text
      });
    }
    catch (error: any) {
      console.error("🔥 Firestore write error:", error.code, error.message);
    }
  }

  getMessages(roomId: string): Observable<ChatMessage[]> {
    if (!roomId) {
      const emptyRef = collection(this.firestore, 'empty') as CollectionReference<ChatMessage>;
      return collectionData<ChatMessage>(emptyRef, { idField: 'id' });
    }

    const ref = collection(this.firestore, `messages/${roomId}/chat`) as CollectionReference<ChatMessage>;
    const q = query(ref, orderBy('timestamp'));
    return collectionData<ChatMessage>(q, { idField: 'id' });
  }

  async createGroup(name: string, members: string[]) {
    const groupsRef = collection(this.firestore, 'groups');
    const docRef = await addDoc(groupsRef, {
      name,
      members,
      createdBy: this.currentUid(),
      createdAt: serverTimestamp(),
    });

    // return new groupId
    return docRef.id;
  }

  async addMember(groupId: string, uid: string) {
    const groupDocRef = doc(this.firestore, `groups/${groupId}`);
    const snapshot = await getDoc(groupDocRef);
    if (!snapshot.exists()) throw new Error('Group not found');
    const data = snapshot.data() as any;
    const members: string[] = Array.isArray(data.members) ? data.members : [];
    if (!members.includes(uid)) {
      members.push(uid);
      await updateDoc(groupDocRef, { members });
    }
  }


  async sendGroupMessage(groupId: string, text: string, audioUrl?: string, durationSec?: number) {
    if (!groupId) throw new Error('groupId required');
    const senderId = this.currentUid();
    if (!senderId) throw new Error('User not authenticated');

    const chatRef = collection(this.firestore, `groups/${groupId}/chat`);
    const docRef = await addDoc(chatRef, {
      senderId,
      text: text ?? null,
      audioUrl: audioUrl ?? null,
      audioDuration: durationSec ?? null,
      timestamp: serverTimestamp(),
    });

    return docRef.id;
  }

  async loadGroupMessagesOnce(groupId: string) {
    if (!groupId) return [];
    const ref = collection(this.firestore, `groups/${groupId}/chat`);
    const q = query(ref, orderBy('timestamp'));
    // convert observable to promise
    return await firstValueFrom(collectionData(q, { idField: 'id' }));
  }

  async getGroupInfo(groupId: string) {
    if (!groupId) return null;
    const groupDocRef = doc(this.firestore, `groups/${groupId}`);
    const snapshot = await getDoc(groupDocRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  }


}
