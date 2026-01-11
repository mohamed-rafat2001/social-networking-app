import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as chatService from "../services/chatService";
import { useUser } from "../../../shared/hooks/useUser";
import { setActiveChat } from "../../../store/rtk/chats";

export const useChats = () => {
	const { user } = useUser();
	return useQuery({
		queryKey: ["chats"],
		queryFn: async () => {
			const response = await chatService.getChats();
			return response.data; // Return only the data array
		},
		staleTime: 30000,
		enabled: !!user,
	});
};

export const useSingleChat = (chatId) => {
	const dispatch = useDispatch();
	return useQuery({
		queryKey: ["chat", chatId],
		queryFn: async () => {
			const response = await chatService.getSingleChat(chatId);
			return response?.data;
		},
		enabled: !!chatId,
		onSuccess: (data) => {
			if (data) {
				dispatch(setActiveChat(data));
			}
		},
	});
};

export const useCreateChat = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: chatService.createChat,
		onSuccess: (response) => {
			queryClient.invalidateQueries(["chats"]);
			if (response?.data?._id) {
				navigate(`/messages/${response.data._id}`);
			}
		},
	});
};

export const useDeleteChat = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: chatService.deleteChat,
		onSuccess: () => {
			queryClient.invalidateQueries(["chats"]);
			navigate("/messages");
		},
	});
};
