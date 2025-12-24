import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./rtk/chats";

export const store = configureStore({
	reducer: {
		chats: chatSlice,
	},
});
