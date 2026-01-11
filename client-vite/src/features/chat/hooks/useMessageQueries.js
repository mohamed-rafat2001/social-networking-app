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
		onMutate: async (variables) => {
			const { chatId, optimisticMessage } = variables;
			if (!optimisticMessage) return;

			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["messages", chatId] });

			// Snapshot the previous value
			const previousMessages = queryClient.getQueryData(["messages", chatId]);

			// Optimistically update to the new value
			queryClient.setQueryData(["messages", chatId], (old) => {
				const oldData = old?.data || [];
				return { ...old, data: [...oldData, optimisticMessage] };
			});

			return { previousMessages };
		},
		onError: (err, variables, context) => {
			if (context?.previousMessages) {
				queryClient.setQueryData(
					["messages", variables.chatId],
					context.previousMessages
				);
			}
		},
		onSuccess: (response, variables) => {
			const { chatId, optimisticMessage } = variables;
			if (optimisticMessage) {
				queryClient.setQueryData(["messages", chatId], (old) => {
					const oldData = old?.data || [];
					return {
						...old,
						data: oldData.map((m) =>
							m._id === optimisticMessage._id ? response.data : m
						),
					};
				});
			} else {
				queryClient.invalidateQueries(["messages", chatId]);
			}
			queryClient.invalidateQueries(["chats"]);
		},
		onSettled: (data, error, variables) => {
			// Invalidate to ensure we are in sync, though success already handles the swap
			// queryClient.invalidateQueries(["messages", variables.chatId]);
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

export const useMarkAsRead = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: messageService.markMessagesAsRead,
		onSuccess: () => {
			queryClient.invalidateQueries(["chats"]);
		},
	});
};
