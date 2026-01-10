import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as messageService from "../services/messageService";

export const useMessages = (chatId) => {
	return useQuery({
		queryKey: ["messages", chatId],
		queryFn: () => messageService.getMessages(chatId),
		enabled: !!chatId,
		staleTime: 10000,
	});
};

export const useCreateMessage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: messageService.createMessage,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(["messages", variables.chatId]);
			queryClient.invalidateQueries(["chats"]);
		},
	});
};

export const useUpdateMessage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: messageService.updateMessage,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(["messages"]);
			queryClient.invalidateQueries(["chats"]);
		},
	});
};

export const useDeleteMessage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: messageService.deleteMessage,
		onSuccess: () => {
			queryClient.invalidateQueries(["messages"]);
			queryClient.invalidateQueries(["chats"]);
		},
	});
};
