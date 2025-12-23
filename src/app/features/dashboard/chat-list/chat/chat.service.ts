import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, orderBy, query, serverTimestamp, Timestamp, updateDoc } from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { UserStore } from 'src/app/core/stores/user-store';


export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private readonly firestore = inject(Firestore);
  private readonly userStore = inject(UserStore);


  // Create a unique room ID for two users
  getRoomId(uid1: string, uid2: string): string {
    return [uid1, uid2].sort().join('_');
  }

  // Send Message
  async sendMessage(roomId: string, senderId: string, text: string) {

    try {
      const chatRef = collection(this.firestore, `messages/${roomId}/chat`);

      await addDoc(chatRef, {
        senderId,
        text,
        timestamp: serverTimestamp(),
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
    const createdBy = this.userStore.getCurrent()?.id ?? 'unknown';

    const groupsRef = collection(this.firestore, 'groups');
    const docRef = await addDoc(groupsRef, {
      name,
      members,
      createdBy,
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
    const senderId = this.userStore.getCurrent()?.id;
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
