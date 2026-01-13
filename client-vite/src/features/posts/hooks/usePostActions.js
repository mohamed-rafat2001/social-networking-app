import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
	useLikePost,
	useSharePost,
	useIncrementView,
	useDeletePost,
	useUpdatePost,
} from "./usePostQueries";

export function usePostActions(post, user) {
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
	const [editContent, setEditContent] = useState(post?.text || "");

	const postRef = useRef(null);
	const viewIncremented = useRef(false);

	const isShare = post?.type === "share";
	const isOwner =
		user?._id === (isShare ? post?.sharedBy?._id : post?.userId?._id);
	const displayUser = isShare ? post?.sharedBy : post?.userId;

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !viewIncremented.current) {
					incrementView(post._id);
					viewIncremented.current = true;
				}
			},
			{ threshold: 0.5 }
		);

		if (postRef.current) {
			observer.observe(postRef.current);
		}

		return () => observer.disconnect();
	}, [post?._id, incrementView]);

	const handleDelete = () => {
		deletePost(post._id);
	};

	const handleUpdate = (e) => {
		e?.stopPropagation();
		if (!editContent.trim()) return;
		updatePost(
			{ postId: post._id, postData: { text: editContent } },
			{
				onSuccess: () => setIsEditModalOpen(false),
			}
		);
	};

	const handleRepost = (e) => {
		e?.stopPropagation();
		const originalPostId = post.originalPostId || post._id;
		const recipientId = post.userId?._id || post.userId;
		sharePost(
			{ postId: originalPostId, note: "", recipientId },
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
		const originalPostId = post.originalPostId || post._id;
		const recipientId = post.userId?._id || post.userId;
		sharePost(
			{ postId: originalPostId, note: repostNote, recipientId },
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

	const handleLike = (e) => {
		e?.stopPropagation();
		likePost(post._id);
	};

	const goToDetail = () => {
		navigate(`/posts/${post._id}`);
	};

	return {
		postRef,
		isOwner,
		isShare,
		displayUser,
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
		handleDelete,
		handleUpdate,
		handleRepost,
		handleRepostWithNote,
		closeRepostModal,
		handleLike,
		goToDetail,
	};
}
