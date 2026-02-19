import { Timestamp } from "@angular/fire/firestore";

export interface ChatDocument{
 chatId: string;
  participants: string[];
  participantDetails: Record<string, ParticipantDetails>;
  lastMessage: string;
  lastMessageTime: Timestamp;
  updatedAt: Timestamp;
  unreadCount: Record<string, number>;
}

export interface ParticipantDetails {
  name: string;
  photoUrl: string;
}