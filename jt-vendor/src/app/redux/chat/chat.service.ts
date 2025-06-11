import apiService from '@/app/services/api.service';
import { MESSAGE_ENDPOINTS } from '../../constants/api.constants';
import { ChatList, ChatListModel, ChatMessageModel } from './chat.model';

// Get customer chat list
const getChatList = async (offset: number, limit: number): Promise<ChatListModel> => {
  const response = await apiService.get<ChatListModel>(
    `${MESSAGE_ENDPOINTS.LIST}customer?offset=${offset}&limit=${limit}`
  );
  //console.log('Chat list API response:', response);
  return response;
};

// Get messages for a specific customer
const getMessages = async (customerId: number, offset: number, limit: number): Promise<ChatMessageModel> => {
  const response = await apiService.get<ChatMessageModel>(
    `${MESSAGE_ENDPOINTS.GET_MESSAGE}customer/${customerId}?offset=${offset}&limit=${limit}`
  );
  //console.log('Chat messages API response:', response);
  return response;
};

// Send message to a customer
const sendMessage = async (customerId: number, data: FormData): Promise<any> => {
  // Add type=customer to FormData
  data.append('id', customerId.toString());
  data.append('type', 'customer');
  
  const response = await apiService.postForm<any>(
    `${MESSAGE_ENDPOINTS.SEND_MESSAGE}customer`,
    data
  );
  //console.log('Send message API response:', response);
  return response;
};

// Search for customers in chat
const searchCustomers = async (searchText: string): Promise<ChatListModel> => {
  const response = await apiService.get<ChatListModel>(
    `${MESSAGE_ENDPOINTS.SEARCH}customer?search=${searchText}`
  );
  //console.log('Search customers API response:', response);
  return response;
};

const chatService = {
  getChatList,
  getMessages,
  sendMessage,
  searchCustomers
};

export default chatService;
