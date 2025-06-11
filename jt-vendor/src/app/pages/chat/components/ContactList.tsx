import React from 'react'
import {KTIcon} from '../../../../_metronic/helpers'
import {ChatList, ChatListModel, ChatCustomer} from '../../../redux/models'
import {format, formatDistanceToNow, parseISO} from 'date-fns'

interface ContactListProps {
  chatList: ChatList[]
  searchResults: ChatListModel | null
  selectedContactId: number | null
  isLoading: boolean
  searchQuery: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onContactClick: (contactId: number) => void
}

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp)
    return formatDistanceToNow(date, {addSuffix: true})
  } catch (error) {
    console.error('Error formatting date:', error)
    return timestamp
  }
}

const capitalizeWords = (str: string): string => {
  if (!str) return ''
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const ContactList: React.FC<ContactListProps> = ({
  chatList,
  searchResults,
  selectedContactId,
  isLoading,
  searchQuery,
  onSearchChange,
  onContactClick,
}) => {
  const renderContact = (chatItem: ChatList) => {
    const customer = chatItem.customer
    let customerName = customer.name || `${customer.f_name} ${customer.l_name}`
    customerName = capitalizeWords(customerName)
    const initials = customerName.charAt(0).toUpperCase()

    return (
      <div
        key={customer.id}
        className={`d-flex flex-stack py-4 cursor-pointer ${
          selectedContactId === customer.id ? 'bg-light-primary rounded' : ''
        }`}
        onClick={() => onContactClick(customer.id)}
      >
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-45px symbol-circle'>
            {customer.image_full_url?.path ? (
              <img alt='Pic' src={customer.image_full_url.path} />
            ) : (
              <span className='symbol-label bg-light-primary text-primary fs-6 fw-bolder'>
                {initials}
              </span>
            )}
          </div>

          <div className='ms-5'>
            <span className='fs-5 fw-bolder text-gray-900 text-hover-primary d-block mb-1'>
              {customerName}
            </span>
            <div className='fw-bold text-gray-500'>{customer.email}</div>
            <div className='text-muted fs-7 text-truncate' style={{maxWidth: '150px'}}>
              {chatItem.message}
            </div>
          </div>
        </div>

        <div className='d-flex flex-column align-items-end ms-2'>
          <span className='text-muted fs-7 mb-1'>{formatTimestamp(chatItem.updated_at)}</span>
          {chatItem.unseen_message_count > 0 && (
            <span className='badge badge-sm badge-circle badge-light-success'>
              {chatItem.unseen_message_count}
            </span>
          )}
        </div>
      </div>
    )
  }

  const getDisplayList = (): ChatList[] => {
    //console.log('searchQuery', searchResults);
    //console.log('chatList', chatList);
    if (searchQuery && searchResults && searchResults.chat) {
      return searchResults.chat
    }
    return chatList || []
  }

  const displayList = getDisplayList()

  return (
    <div className='card card-flush'>
      <div className='card-header pt-7' id='kt_chat_contacts_header'>
        <form className='w-100 position-relative' autoComplete='off'>
          <KTIcon
            iconName='magnifier'
            className='fs-2 text-lg-1 text-gray-500 position-absolute top-50 ms-5 translate-middle-y'
          />
          <input
            type='text'
            className='form-control form-control-solid px-15'
            name='search'
            value={searchQuery}
            onChange={onSearchChange}
            placeholder='Search by username or email...'
          />
        </form>
      </div>

      <div className='card-body pt-5' id='kt_chat_contacts_body'>
        <div
          className='scroll-y me-n5 pe-5 h-200px h-lg-auto'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
          data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
          data-kt-scroll-offset='0px'
        >
          {isLoading ? (
            <div className='d-flex justify-content-center py-10'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            </div>
          ) : displayList.length === 0 ? (
            <div className='text-center py-10'>
              <p className='text-gray-500'>
                {searchQuery ? 'No search results found' : 'No contacts available'}
              </p>
            </div>
          ) : (
            displayList.map(renderContact)
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactList 