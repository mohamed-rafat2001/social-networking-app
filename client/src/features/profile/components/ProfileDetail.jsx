import { useParams, useNavigate } from "react-router-dom";
import {
	useUserProfile,
	useFollowUser,
	useUnfollowUser,
} from "../../auth/hooks/useUserQueries";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useUser } from "../../../shared/hooks/useUser";
import { usePosts } from "../../posts/hooks/usePostQueries";
import { PostItem } from "../../posts";
import { Avatar, Button, Spinner } from "../../../shared/components/UI";
import FollowsModal from "./FollowsModal";
import {
	HiOutlineMail,
	HiOutlineAcademicCap,
	HiOutlineCalendar,
	HiHeart,
	HiDotsHorizontal,
	HiOutlineChatAlt2,
	HiUserAdd,
	HiUserRemove,
} from "react-icons/hi";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ProfileDetail = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useUser();
	const { onlineUsers } = useSocket();
	const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
	const { data: postsResponse, isLoading: postsLoading } = usePosts();
	const { mutate: followUser } = useFollowUser();
	const { mutate: unfollowUser } = useUnfollowUser();

	const [activeTab, setActiveTab] = useState("posts"); // posts, followers, following
	const [isFollowsModalOpen, setIsFollowsModalOpen] = useState(false);
	const [modalType, setModalType] = useState("followers"); // followers or following

	const isCurrentUser =
		currentUser?._id === userId || !userId || userId === "user";

	const allPosts = postsResponse?.data || [];
	const userPosts = Array.isArray(allPosts)
		? allPosts.filter(
				(post) =>
					String(post.userId?._id) === String(userId || currentUser?._id) ||
					post.shares?.some(
						(s) =>
							String(s.userId?._id || s.userId) ===
							String(userId || currentUser?._id)
					)
		  )
		: [];

	if (profileLoading || postsLoading) {
		return (
			<div className="flex items-center justify-center h-[calc(100vh-100px)]">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="text-center py-20">
				<h3 className="text-xl font-bold text-gray-900 dark:text-white">
					User not found
				</h3>
			</div>
		);
	}

	const user = profile.data;
	const isFollowing = user.followers?.some(
		(f) => String(f._id || f) === String(currentUser?._id)
	);

	const handleFollowToggle = () => {
		if (isFollowing) {
			unfollowUser(user._id);
		} else {
			followUser(user._id);
		}
	};

	const handleMessage = () => {
		// Logic to open or create a chat
		navigate("/messages");
	};

	const handleFollowsClick = (type) => {
		setModalType(type);
		setIsFollowsModalOpen(true);
	};

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-8">
			<FollowsModal
				isOpen={isFollowsModalOpen}
				onClose={() => setIsFollowsModalOpen(false)}
				title={modalType === "followers" ? "Followers" : "Following"}
				users={modalType === "followers" ? user.followers : user.following}
				currentUser={currentUser}
			/>
			{/* Cover & Profile Info */}
			<div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm mb-8 transition-colors duration-300">
				<div className="h-40 bg-gradient-to-r from-primary/20 to-purple-200 dark:from-primary/30 dark:to-purple-900/40"></div>
				<div className="px-8 pb-8">
					<div className="relative flex justify-between items-end -mt-12 mb-6">
						<Avatar
							src={user.image?.secure_url}
							size="xl"
							className="w-32 h-32 border-4 border-white dark:border-gray-900 shadow-lg"
							isActive={onlineUsers?.some(
								(u) => String(u.userId) === String(user._id)
							)}
						/>
						<div className="flex items-center gap-6">
							<div className="flex gap-4">
								<div
									className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors"
									onClick={() => handleFollowsClick("followers")}
								>
									<p className="text-xl font-black text-gray-900 dark:text-white">
										{user.followers?.length || 0}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
										Followers
									</p>
								</div>
								<div
									className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors"
									onClick={() => handleFollowsClick("following")}
								>
									<p className="text-xl font-black text-gray-900 dark:text-white">
										{user.following?.length || 0}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
										Following
									</p>
								</div>
							</div>

							{!isCurrentUser && (
								<div className="flex gap-3 border-l border-gray-100 dark:border-gray-800 pl-6">
									<Button
										variant="secondary"
										className="rounded-xl flex items-center gap-2"
										onClick={handleMessage}
									>
										<HiOutlineChatAlt2 size={18} />
										Message
									</Button>
									<Button
										className={`rounded-xl flex items-center gap-2 ${
											isFollowing
												? "bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
												: ""
										}`}
										variant={isFollowing ? "outline" : "primary"}
										onClick={handleFollowToggle}
									>
										{isFollowing ? (
											<>
												<HiUserRemove size={18} />
												Unfollow
											</>
										) : (
											<>
												<HiUserAdd size={18} />
												Follow
											</>
										)}
									</Button>
								</div>
							)}
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<h1 className="text-3xl font-black text-gray-900 dark:text-white">
								{user.firstName} {user.lastName}
							</h1>
							<div className="flex items-center gap-3">
								<p className="text-gray-500 dark:text-gray-400 font-medium">
									@{user.username}
								</p>
							</div>
						</div>

						<p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
							{user.bio ||
								"Engineering student at the university. Interested in collaboration and sharing resources."}
						</p>

						<div className="flex flex-wrap gap-6 pt-2">
							<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
								<HiOutlineAcademicCap size={18} className="text-primary" />
								<span>Handle: @{user.username}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
								<HiOutlineMail size={18} className="text-primary" />
								<span>{user.email}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
								<HiOutlineCalendar size={18} className="text-primary" />
								<span>
									Joined{" "}
									{format(new Date(user.createdAt || Date.now()), "MMMM yyyy")}
								</span>
							</div>
						</div>

						<div className="flex gap-8 pt-4 border-t border-gray-100 dark:border-gray-800">
							<div
								className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors"
								onClick={() => handleFollowsClick("followers")}
							>
								<p className="text-xl font-black text-gray-900 dark:text-white">
									{user.followers?.length || 0}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
									Followers
								</p>
							</div>
							<div
								className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors"
								onClick={() => handleFollowsClick("following")}
							>
								<p className="text-xl font-black text-gray-900 dark:text-white">
									{user.following?.length || 0}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
									Following
								</p>
							</div>
							<div
								className={`text-center cursor-pointer p-2 rounded-xl transition-colors ${
									activeTab === "posts"
										? "bg-primary/5 text-primary"
										: "hover:bg-gray-50 dark:hover:bg-gray-800"
								}`}
								onClick={() => setActiveTab("posts")}
							>
								<p className="text-xl font-black text-gray-900 dark:text-white">
									{userPosts.length}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
									Posts
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between px-4">
					<h3 className="text-xl font-black text-gray-900 dark:text-white capitalize">
						{activeTab}
					</h3>
				</div>

				<div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
					<AnimatePresence mode="wait">
						{activeTab === "posts" && (
							<motion.div
								key="posts"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
							>
								{userPosts.length > 0 ? (
									userPosts.map((post, index) => (
										<PostItem key={post._id} post={post} index={index} />
									))
								) : (
									<div className="py-20 text-center">
										<div className="bg-gray-50 dark:bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
											<HiDotsHorizontal
												size={40}
												className="text-gray-300 dark:text-gray-600"
											/>
										</div>
										<p className="text-gray-500 dark:text-gray-400 font-medium">
											No posts yet
										</p>
									</div>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default ProfileDetail;
