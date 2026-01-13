import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
	useLikePost,
	useSharePost,
	useIncrementView,
	useDeletePost,
	useUpdatePost,
} from "./usePostQueries";

export function usePostDetail(postId, postData) {
	const navigate = useNavigate();
	const { mutate: likePost } = useLikePost();
	const { mutate: sharePost } = useSharePost();
	const { mutate: incrementView } = useIncrementView();
	const { mutate: deletePost } = useDeletePost();
	const { mutate: updatePost } = useUpdatePost();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
	const [repostNote, setRepostNote] = useState("");
	const [editContent, setEditContent] = useState("");

	const viewIncremented = useRef(false);

	useEffect(() => {
		if (postData?.data && !viewIncremented.current) {
			incrementView(postId);
			viewIncremented.current = true;
		}
		if (postData?.data) {
			setEditContent(postData.data.text || "");
		}
	}, [postId, postData, incrementView]);

	const handleLike = () => {
		if (postData?.data?._id) {
			likePost(postData.data._id);
		}
	};

	const handleRepost = () => {
		const post = postData?.data;
		if (!post) return;

		const originalPostId = post.originalPostId || post._id;
		sharePost(
			{ postId: originalPostId, note: "" },
			{
				onSuccess: () => {
					toast.success("Reposted successfully");
				},
				onError: (error) => {
					toast.error(error.response?.data?.message || "Failed to repost");
				},
			}
		);
	};

	const handleRepostWithNote = () => {
		const post = postData?.data;
		if (!post) return;

		const originalPostId = post.originalPostId || post._id;
		sharePost(
			{ postId: originalPostId, note: repostNote },
			{
				onSuccess: () => {
					setIsRepostModalOpen(false);
					setRepostNote("");
					toast.success(
						repostNote.trim() ? "Reposted with note" : "Reposted successfully"
					);
				},
				onError: (error) => {
					toast.error(error.response?.data?.message || "Failed to repost");
				},
			}
		);
	};

	const closeRepostModal = () => {
		setIsRepostModalOpen(false);
		setRepostNote("");
	};

	const handleDelete = () => {
		if (postData?.data?._id) {
			deletePost(postData.data._id, {
				onSuccess: () => {
					toast.success("Post deleted");
					navigate("/feed");
				},
			});
		}
	};

	const handleUpdate = () => {
		if (!editContent.trim() || !postData?.data?._id) return;
		updatePost(
			{ postId: postData.data._id, postData: { text: editContent } },
			{
				onSuccess: () => {
					setIsEditModalOpen(false);
					toast.success("Post updated");
				},
			}
		);
	};

	return {
		isEditModalOpen,
		setIsEditModalOpen,
		isDeleteModalOpen,
		setIsDeleteModalOpen,
		isRepostModalOpen,
		setIsRepostModalOpen,
		repostNote,
		setRepostNote,
		editContent,
		setEditContent,
		handleLike,
		handleRepost,
		handleRepostWithNote,
		closeRepostModal,
		handleDelete,
		handleUpdate,
	};
}
