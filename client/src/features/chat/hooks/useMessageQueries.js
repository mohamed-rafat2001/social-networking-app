import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as messageService from "../../../services/messageService";

export const useMessages = (chatId) => {
	return useQuery({
		queryKey: ["messages", chatId],
		queryFn: () => messageService.getMessages(chatId),
		enabled: !!chatId,
	});
};

export const useCreateMessage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: messageService.createMessage,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(["messages", variables.chatId]);
		},
	});
};
