import React, {FC, useState, useEffect} from 'react'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {ChatInnerWidget} from './widgets/ChatInnerWidget'
import ChatHeader from './components/ChatHeader'
import ContactList from './components/ContactList'
import {useDispatch, useSelector} from 'react-redux'
import {AppDispatch, RootState} from '../../redux/store'
import {getChatList, getMessages, sendMessage, searchCustomers, clearSearchResults} from '../../redux/chat/chat.slice'
import {ChatList, ChatMessage, ChatListModel, ChatCustomer, ChatSellerData} from '../../redux/models'
import {parseISO, formatDistanceToNow} from 'date-fns'
import {MessageModel, UserInfoModel, ContactType} from './utils/types'

// Helper functions
const formatTimestamp = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp)
    return formatDistanceToNow(date, {addSuffix: true})
  } catch (error) {
    console.error('Error formatting date:', error)
    return timestamp
  }
}

const convertToMessageModel = (message: ChatMessage | ChatList, contactAvatar: string | null): MessageModel => {
  const messageType = message.notification_receiver === 'customer' ? 'out' : 'in'
  
  let attachments = []
  if (message.attachment && message.attachment !== '[]') {
    try {
      if (typeof message.attachment === 'string') {
        attachments = JSON.parse(message.attachment)
      } else {
        attachments = message.attachment
      }
    } catch (error) {
      console.error('Error parsing attachment:', error)
    }
  }
  
  return {
    user: message.sent_by_customer ? message.customer.id : 2,
    type: messageType,
    text: message.message,
    time: formatTimestamp(message.created_at),
    image: messageType === 'in' ? message.customer.image_full_url?.path : null,
    attachment: attachments.length > 0 ? attachments : undefined,
  }
}

const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'chat',
    path: '/chat',
    isSeparator: false,
    isActive: false,
  },
]

const ChatPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {chatList, selectedChat, isLoading, searchResults} = useSelector((state: RootState) => state.chat)
  
  const [conversations, setConversations] = useState<{[key: number]: MessageModel[]}>({})
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false)
  const [userInfosMap, setUserInfosMap] = useState<{[key: number]: UserInfoModel}>({
    2: {id: 2, name: 'You', avatar: 'media/avatars/300-9.jpg'},
  })

  useEffect(() => {
    dispatch(getChatList({offset: 1, limit: 20}))
  }, [dispatch])

  useEffect(() => {
    if (chatList?.data?.image_full_url?.path) {
      setUserInfosMap(prev => ({
        ...prev,
        2: {
          ...prev[2],
          avatar: chatList.data.image_full_url.path || 'media/avatars/300-9.jpg'
        }
      }))
    }
  }, [chatList])

  useEffect(() => {
    if (selectedChat && selectedChat.message && selectedChat.message.length > 0) {
      const selectedCustomer = chatList?.chat?.find(chat => chat.customer.id === selectedContactId)
      const contactAvatar = selectedCustomer?.customer.image_full_url?.path || null
      
      const messages = selectedChat.message.map(message => convertToMessageModel(message, contactAvatar))
      
      setConversations(prev => ({
        ...prev,
        [selectedContactId as number]: messages
      }))
      
      if (selectedCustomer) {
        const customer = selectedCustomer.customer
        setUserInfosMap(prev => ({
          ...prev,
          [customer.id]: {
            id: customer.id,
            name: customer.name || `${customer.f_name} ${customer.l_name}`,
            avatar: customer.image_full_url?.path || ''
          }
        }))
      }
    }
  }, [selectedChat, selectedContactId, chatList])

  const handleContactClick = (contactId: number) => {
    setSelectedContactId(contactId)
    setIsLoadingMessages(true)
    dispatch(getMessages({customerId: contactId, offset: 1, limit: 100}))
      .finally(() => setIsLoadingMessages(false))
  }

  const handleSendMessage = (messageText: string, files?: File[]) => {
    if (!selectedContactId) return
    
    const newMessage: MessageModel = {
      user: 2,
      type: 'out',
      text: messageText,
      time: 'Just now',
      image: null,
      attachment: files?.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'file',
        key: file.name,
        path: URL.createObjectURL(file),
        size: `${(file.size / 1024).toFixed(2)} KB`
      }))
    }
    
    setConversations((prev) => {
      const updated = {...prev}
      updated[selectedContactId] = [...(updated[selectedContactId] || []), newMessage]
      return updated
    })

    dispatch(sendMessage({ 
      customerId: selectedContactId, 
      message: messageText,
      files: files || []
    }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    if (query.trim().length > 0) {
      const timeout = setTimeout(() => {
        dispatch(searchCustomers(query))
      }, 500)
      setSearchTimeout(timeout)
    } else {
      dispatch(clearSearchResults())
    }
  }

  const activeConversation = selectedContactId
    ? conversations[selectedContactId] || []
    : []

  const selectedContact = chatList?.chat?.find(chat => chat.customer.id === selectedContactId)?.customer
  
  // Map ChatCustomer to ContactType
  const contactInfo = selectedContact ? {
    id: selectedContact.id,
    name: selectedContact.name || `${selectedContact.f_name} ${selectedContact.l_name}`,
    email: selectedContact.email,
    avatar: selectedContact.image_full_url?.path,
    initials: (selectedContact.name || `${selectedContact.f_name} ${selectedContact.l_name}`).charAt(0),
    bg: 'light-primary',
    status: 'offline',
    lastMessageTime: selectedContact.updated_at ? formatTimestamp(selectedContact.updated_at) : '',
    lastMessage: '',
    unreadCount: 0
  } as ContactType : undefined;
  
  const userInfosArray = Object.values(userInfosMap)
  //console.log('searchResults', searchResults)

  // Transform searchResults to match ChatListModel interface expected by ContactList
  const transformedSearchResults = searchResults ? {
    data: chatList?.data || {} as ChatSellerData,
    total_size: searchResults ? 1 : 0,
    limit: '10',
    offset: '0',
    chat: Array.isArray(searchResults) ? searchResults : [searchResults]
  } as ChatListModel : null;

  return (
    <>
      <PageTitle breadcrumbs={widgetsBreadCrumbs}>Chat</PageTitle>
      <div className='d-flex flex-column flex-lg-row'>
        <div className='flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0'>
          <ContactList
            chatList={chatList?.chat || []}
            searchResults={transformedSearchResults}
            selectedContactId={selectedContactId}
            isLoading={isLoading && !isLoadingMessages}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onContactClick={handleContactClick}
          />
        </div>

        <div className='flex-lg-row-fluid ms-lg-7 ms-xl-10'>
          {!selectedContactId ? (
            <div className='card'>
              <div className='card-body d-flex align-items-center justify-content-center' style={{height: 300}}>
                <h3>Select a contact to start chatting</h3>
              </div>
            </div>
          ) : (
            <div className='card' id='kt_chat_messenger'>
              <ChatHeader selectedContact={contactInfo} />
              {isLoadingMessages ? (
                <div className='card-body d-flex justify-content-center py-10'>
                  <div className='spinner-border text-primary' role='status'>
                    <span className='visually-hidden'>Loading messages...</span>
                  </div>
                </div>
              ) : (
                <ChatInnerWidget
                  conversation={activeConversation}
                  userInfos={userInfosArray}
                  onSendMessage={handleSendMessage}
                  contactId={selectedContactId}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ChatPage
