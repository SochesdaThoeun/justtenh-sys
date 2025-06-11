import React from 'react'
import {ChatFilterWidget} from '../widgets/ChatFilterWidget'
import {ContactType} from '../utils/types'

interface ChatHeaderProps {
  selectedContact: ContactType | undefined
}

const ChatHeader: React.FC<ChatHeaderProps> = ({selectedContact}) => {
  return (
    <div className='card-header' id='kt_chat_messenger_header'>
      <div className='card-title'>
        <div className='symbol-group symbol-hover'></div>
        <div className='d-flex justify-content-center flex-column me-3'>
          <span className='fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1'>
            {selectedContact?.name}
          </span>
          <div className='mb-0 lh-1'>
            {selectedContact?.status === 'online' ? (
              <>
                <span className='badge badge-success badge-circle w-10px h-10px me-1'></span>
                <span className='fs-7 fw-bold text-gray-500'>Active</span>
              </>
            ) : (
              <span className='fs-7 fw-bold text-gray-500'>
                Last seen {selectedContact?.lastMessageTime}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='card-toolbar'>
        <div className='me-n3'>
          <button
            className='btn btn-sm btn-icon btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <i className='bi bi-three-dots fs-2'></i>
          </button>
          <ChatFilterWidget />
        </div>
      </div>
    </div>
  )
}

export default ChatHeader 