import { Timestamp } from "@angular/fire/firestore";

export interface ChatDocument {
  chatId: string;
  participants: string[];
  participantDetails: Record<string, RecievedUser>;
  lastMessage: string;
  updatedAt: Timestamp;
  unreadCount: Record<string, number>;
}

export interface ParticipantDetails {
  name: string;
  profileImage: string;
}

export interface RecievedUser extends ParticipantDetails { 
  userID: string; 
}