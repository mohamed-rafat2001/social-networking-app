import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../../../store/rtk/chats";
import * as chatService from "../../../services/chatService";

export const useChats = () => {
	return useQuery({
		queryKey: ["chats"],
		queryFn: chatService.getChats,
		refetchInterval: 5000,
	});
};

export const useSingleChat = (chatId) => {
	const dispatch = useDispatch();
	return useQuery({
		queryKey: ["chat", chatId],
		queryFn: () => chatService.getSingleChat(chatId),
		enabled: !!chatId,
		onSuccess: (data) => {
			if (data) {
				dispatch(setActiveChat(data));
			}
		},
	});
};
