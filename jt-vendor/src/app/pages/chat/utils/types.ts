import { ChatMessage } from '../../../redux/chat/chat.model'

export interface ContactType {
  id: number
  name: string
  email: string
  avatar: string | null
  initials: string
  bg: string
  status: string
  lastMessageTime: string
  lastMessage: string
  unreadCount: number
}

export interface MessageModel {
  user: number
  type: 'in' | 'out'
  text: string
  time: string
  image?: string | null
  attachment?: Array<{
    type: string
    key: string
    path: string
    size: string
  }>
}

export interface UserInfoModel {
  id: number
  name: string
  avatar: string
}

export interface ConversationsMap {
  [contactId: number]: MessageModel[]
} 