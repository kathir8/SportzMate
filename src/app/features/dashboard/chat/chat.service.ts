import { inject, Injectable, resource, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Firestore, collection, addDoc, query, orderBy, collectionData, Timestamp, CollectionReference, serverTimestamp } from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';


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
  private firestore = inject(Firestore);

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
  catch (error:any) {
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


}
