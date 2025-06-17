import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  error: {},
  chatUserListResponse: {},
  createChatRoomResponse: {},
  messageListResponse: {},
  attachFileResponse: {},
  markReadChatResponse: {},
};

const ChatSlice = createSlice({
  name: 'Chat',
  initialState,
  reducers: {
    // chatUserList //
    chatUserListRequest(state, action) {
      state.status = action.type;
    },
    chatUserListSuccess(state, action) {
      state.chatUserListResponse = action.payload;
      state.status = action.type;
    },
    chatUserListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // createChatRoom //
    createChatRoomRequest(state, action) {
      state.status = action.type;
    },
    createChatRoomSuccess(state, action) {
      state.createChatRoomResponse = action.payload;
      state.status = action.type;
    },
    createChatRoomFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // messageList //
    messageListRequest(state, action) {
      state.status = action.type;
    },
    messageListSuccess(state, action) {
      state.messageListResponse = action.payload;
      state.status = action.type;
    },
    messageListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // attachFile //
    attachFileRequest(state, action) {
      state.status = action.type;
    },
    attachFileSuccess(state, action) {
      state.attachFileResponse = action.payload;
      state.status = action.type;
    },
    attachFileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // markReadChat //
    markReadChatRequest(state, action) {
      state.status = action.type;
    },
    markReadChatSuccess(state, action) {
      state.markReadChatResponse = action.payload;
      state.status = action.type;
    },
    markReadChatFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});
export const {
  chatUserListRequest,
  chatUserListSuccess,
  chatUserListFailure,

  createChatRoomRequest,
  createChatRoomSuccess,
  createChatRoomFailure,

  messageListRequest,
  messageListSuccess,
  messageListFailure,

  attachFileRequest,
  attachFileSuccess,
  attachFileFailure,

  markReadChatRequest,
  markReadChatSuccess,
  markReadChatFailure,
} = ChatSlice.actions;

export default ChatSlice.reducer;
