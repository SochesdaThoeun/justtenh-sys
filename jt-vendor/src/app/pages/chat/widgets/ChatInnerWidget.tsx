import React, {FC, useState, useRef} from 'react'
import clsx from 'clsx'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import ImagePreviewModal from '../components/ImagePreviewModal'
import {MessageModel, UserInfoModel} from '../utils/types'

type Props = {
  conversation: MessageModel[]
  userInfos: UserInfoModel[]
  onSendMessage: (msg: string, files?: File[]) => void
  contactId: number
  isDrawer?: boolean
}

const ChatInnerWidget: FC<Props> = ({ 
  conversation, 
  userInfos, 
  onSendMessage, 
  contactId, 
  isDrawer = false 
}) => {
  const [message, setMessage] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Reverse conversation array for display
  const reversedConversation = [...conversation].reverse()

  //console.log('conversation', conversation)

  // Helper function to handle the "enter" key
  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!message.trim() && selectedFiles.length === 0) return
    onSendMessage(message.trim(), selectedFiles)
    setMessage('')
    setSelectedFiles([])
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files).filter(file => {
      if (type === 'image') {
        return file.type.startsWith('image/')
      }
      return !file.type.startsWith('image/')
    })

    setSelectedFiles(prev => [...prev, ...newFiles])
    
    // Reset the input
    event.target.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageClick = (imageSrc: string) => {
    setPreviewImage(imageSrc)
  }

  // Attempt to get the "You" user info and the contact's user info
  const currentUserInfo = userInfos.find((u) => u.id === 2) // Seller (You)
  const contactUserInfo = userInfos.find((u) => u.id === contactId) // Customer

  return (
    <div
      className='card-body'
      id={isDrawer ? 'kt_drawer_chat_messenger_body' : 'kt_chat_messenger_body'}
    >
      {/* Messages List */}
      <div
        className={clsx('scroll-y me-n5 pe-5', {'h-300px h-lg-auto': !isDrawer})}
        data-kt-element='messages'
        data-kt-scroll='true'
        data-kt-scroll-activate='{default: false, lg: true}'
        data-kt-scroll-max-height='auto'
        data-kt-scroll-dependencies={
          isDrawer
            ? '#kt_drawer_chat_messenger_header, #kt_drawer_chat_messenger_footer'
            : '#kt_header, #kt_app_header, #kt_app_toolbar, #kt_toolbar, #kt_footer, #kt_app_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer'
        }
        data-kt-scroll-wrappers={
          isDrawer
            ? '#kt_drawer_chat_messenger_body'
            : '#kt_content, #kt_app_content, #kt_chat_messenger_body'
        }
        data-kt-scroll-offset={isDrawer ? '0px' : '-2px'}
      >
        {reversedConversation.map((msg, index) => {
          const isIncoming = msg.type === 'in'
          const user = isIncoming
            ? userInfos.find(u => u.id === msg.user)
            : userInfos.find(u => u.id === 2)
          
          const avatarSrc = isIncoming && msg.image 
            ? msg.image 
            : user?.avatar
            
          const hasAvatar = !!avatarSrc
          const nameInitial = user?.name.charAt(0).toUpperCase() || ''

          return (
            <div className={clsx('d-flex', {
              'justify-content-start': isIncoming,
              'justify-content-end': !isIncoming,
            }, 'mb-10')} key={`msg-${index}`}>
              <div className={clsx(
                'd-flex flex-column',
                `align-items-${isIncoming ? 'start' : 'end'}`
              )}>
                <div className='d-flex align-items-center mb-2'>
                  {isIncoming ? (
                    <>
                      <div className='symbol symbol-35px symbol-circle'>
                        {hasAvatar ? (
                          <img alt='Pic' src={avatarSrc} />
                        ) : (
                          <span className='symbol-label bg-light-primary text-primary fs-6 fw-bolder'>
                            {nameInitial}
                          </span>
                        )}
                      </div>
                      <div className='ms-3'>
                        <a href='#' className='fs-5 fw-bolder text-gray-900 text-hover-primary me-1'>
                          {user?.name}
                        </a>
                        <span className='text-muted fs-7 mb-1'>{msg.time}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='me-3'>
                        <span className='text-muted fs-7 mb-1'>{msg.time}</span>
                        <a href='#' className='fs-5 fw-bolder text-gray-900 text-hover-primary ms-1'>
                          {user?.name}
                        </a>
                      </div>
                      <div className='symbol symbol-35px symbol-circle'>
                        {hasAvatar ? (
                          <img alt='Pic' src={avatarSrc} />
                        ) : (
                          <span className='symbol-label bg-light-primary text-primary fs-6 fw-bolder'>
                            {nameInitial}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className={clsx(
                  'p-5 rounded',
                  `bg-light-${isIncoming ? 'info' : 'primary'}`,
                  `text-${isIncoming ? 'start' : 'end'}`
                )}>
                  <div className='text-gray-900 fw-bold mb-2'>{msg.text}</div>
                  {msg.attachment?.map((attachment, idx) => (
                    <div key={`attachment-${idx}`} className="mt-2">
                      {attachment.type === 'image' ? (
                        <img 
                          src={attachment.path} 
                          alt="Attachment" 
                          className="rounded cursor-pointer"
                          style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                          onClick={() => handleImageClick(attachment.path)}
                        />
                      ) : (
                        <div className="d-flex align-items-center bg-light rounded p-2">
                          <i className="bi bi-file-earmark fs-3 me-2"></i>
                          <div>
                            <div className="fw-bold">{attachment.key}</div>
                            <div className="text-muted fs-7">{attachment.size}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Message input area */}
      <div
        className='card-footer pt-4'
        id={isDrawer ? 'kt_drawer_chat_messenger_footer' : 'kt_chat_messenger_footer'}
      >
        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className='d-flex flex-wrap gap-2 mb-3'>
            {selectedFiles.map((file, index) => (
              <div key={index} className='d-flex align-items-center bg-light rounded p-2'>
                {file.type.startsWith('image/') ? (
                  <div className="position-relative">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      className="rounded me-2"
                    />
                    <button
                      className='btn btn-sm btn-icon btn-active-light-primary position-absolute top-0 end-0'
                      onClick={() => removeFile(index)}
                    >
                      <i className='bi bi-x-lg'></i>
                    </button>
                  </div>
                ) : (
                  <>
                    <i className="bi bi-file-earmark fs-3 me-2"></i>
                    <span className='text-truncate' style={{maxWidth: '150px'}}>{file.name}</span>
                    <button
                      className='btn btn-sm btn-icon btn-active-light-primary ms-2'
                      onClick={() => removeFile(index)}
                    >
                      <i className='bi bi-x-lg'></i>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <textarea
          className='form-control form-control-flush mb-3'
          rows={1}
          data-kt-element='input'
          placeholder='Type a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onEnterPress}
        ></textarea>

        <div className='d-flex flex-stack'>
          <div className='d-flex align-items-center me-2'>
            {/* Hidden file inputs */}
            <input
              type='file'
              ref={fileInputRef}
              className='d-none'
              onChange={(e) => handleFileSelect(e, 'file')}
              multiple
            />
            <input
              type='file'
              ref={imageInputRef}
              className='d-none'
              accept='image/*'
              onChange={(e) => handleFileSelect(e, 'image')}
              multiple
            />
            
            {/* File attachment button */}
            <button
              className='btn btn-sm btn-icon btn-active-light-primary me-1'
              type='button'
              onClick={() => fileInputRef.current?.click()}
              data-bs-toggle='tooltip'
              title='Attach file'
            >
              <i className='bi bi-paperclip fs-3'></i>
            </button>
            
            {/* Image attachment button */}
            <button
              className='btn btn-sm btn-icon btn-active-light-primary me-1'
              type='button'
              onClick={() => imageInputRef.current?.click()}
              data-bs-toggle='tooltip'
              title='Attach image'
            >
              <i className='bi bi-upload fs-3'></i>
            </button>
          </div>
          <button
            className='btn btn-primary'
            type='button'
            data-kt-element='send'
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        show={!!previewImage}
        onHide={() => setPreviewImage(null)}
        imageSrc={previewImage || ''}
      />
    </div>
  )
}

export {ChatInnerWidget}
