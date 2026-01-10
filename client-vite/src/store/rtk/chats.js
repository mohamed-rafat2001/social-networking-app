import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'Chat',
    initialState: {
        activeChat: null, // This holds the ID or the selected chat object for UI state
    },
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        clearActiveChat: (state) => {
            state.activeChat = null;
        }
    }
});

export const { setActiveChat, clearActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
