import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useAddComment } from "./useCommentQueries";

const commentSchema = z.object({
	text: z
		.string()
		.min(1, "Comment cannot be empty")
		.max(1000, "Comment cannot exceed 1000 characters"),
});

export function useAddCommentForm(postId, recipientId) {
	const { mutate: addComment, isLoading } = useAddComment();

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			text: "",
		},
		mode: "onChange",
	});

	const text = watch("text");

	const onSubmit = (data) => {
		if (!data.text.trim()) return;

		addComment(
			{
				postId,
				commentData: { commentBody: data.text },
				postAuthorId: recipientId,
			},
			{
				onSuccess: () => {
					reset();
					toast.success("Comment added!");
				},
				onError: (error) => {
					toast.error(error.response?.data?.message || "Failed to add comment");
				},
			}
		);
	};

	return {
		control,
		handleSubmit: handleSubmit(onSubmit),
		isLoading,
		text,
		errors,
	};
}
