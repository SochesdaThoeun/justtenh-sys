import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatList, ChatListModel, ChatMessage, ChatMessageModel } from './chat.model';
import chatService from './chat.service';

// Define chat state interface
interface ChatState {
  chatList: ChatListModel | null;
  selectedChat: ChatMessageModel | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  searchResults: ChatListModel | null;
}

// Initial state
const initialState: ChatState = {
  chatList: null,
  selectedChat: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  searchResults: null,
};

// Async thunks for chat operations

// Get chat list
export const getChatList = createAsyncThunk(
  'chat/getChatList',
  async ({ offset, limit }: { offset: number; limit: number }, thunkAPI) => {
    try {
      return await chatService.getChatList(offset, limit);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get messages for a specific chat
export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async ({ customerId, offset, limit }: { customerId: number; offset: number; limit: number }, thunkAPI) => {
    try {
      return await chatService.getMessages(customerId, offset, limit);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ customerId, message, files }: { customerId: number; message: string; files?: File[] }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      // Add files if provided
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          // Determine if it's an image or a document based on file type
          if (file.type.startsWith('image/')) {
            formData.append(`image[${index}]`, file);
          } else {
            formData.append(`file[${index}]`, file);
          }
        });
      }
      
      const response = await chatService.sendMessage(customerId, formData);
      
      // After sending message, refresh the messages
      thunkAPI.dispatch(getMessages({ customerId, offset: 1, limit: 100 }));
      
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Search customers
export const searchCustomers = createAsyncThunk(
  'chat/searchCustomers',
  async (searchText: string, thunkAPI) => {
    try {
      return await chatService.searchCustomers(searchText);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Create the chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChat: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getChatList
      .addCase(getChatList.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getChatList.fulfilled, (state, action: PayloadAction<ChatListModel>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.chatList = action.payload;
      })
      .addCase(getChatList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // Handle getMessages
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getMessages.fulfilled, (state, action: PayloadAction<ChatMessageModel>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedChat = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // Handle sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // Handle searchCustomers
      .addCase(searchCustomers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(searchCustomers.fulfilled, (state, action: PayloadAction<ChatListModel>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.searchResults = action.payload;
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetChat, clearSelectedChat, clearSearchResults } = chatSlice.actions;
export default chatSlice.reducer;
