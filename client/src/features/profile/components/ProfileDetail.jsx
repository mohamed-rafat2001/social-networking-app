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
import { Avatar, Button, Spinner, cn } from "../../../shared/components/UI";
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
			<div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm mb-6 transition-colors duration-300">
				<div className="h-48 bg-gradient-to-br from-primary/20 via-primary/5 to-purple-200 dark:from-primary/30 dark:via-gray-800 dark:to-purple-900/40 relative">
					<div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_left] dark:bg-grid-slate-100/[0.02]"></div>
				</div>
				<div className="px-8 pb-8">
					<div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-16 mb-8 gap-6">
						<div className="relative group">
							<Avatar
								src={user.image?.secure_url}
								size="2xl"
								className="ring-4 ring-white dark:ring-gray-900 shadow-2xl transition-transform duration-300 group-hover:scale-105"
								isActive={onlineUsers?.some(
									(u) => String(u.userId) === String(user._id)
								)}
							/>
						</div>

						<div className="flex flex-col md:flex-row items-center gap-6">
							{!isCurrentUser && (
								<div className="flex gap-3">
									<Button
										variant="secondary"
										className="rounded-2xl flex items-center gap-2 px-6 h-12 font-bold"
										onClick={handleMessage}
									>
										<HiOutlineChatAlt2 size={20} />
										Message
									</Button>
									<Button
										className={cn(
											"rounded-2xl flex items-center gap-2 px-6 h-12 font-bold transition-all duration-300",
											isFollowing
												? "bg-red-50 text-red-600 hover:bg-red-100 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20"
												: ""
										)}
										variant={isFollowing ? "outline" : "primary"}
										onClick={handleFollowToggle}
									>
										{isFollowing ? (
											<>
												<HiUserRemove size={20} />
												Unfollow
											</>
										) : (
											<>
												<HiUserAdd size={20} />
												Follow
											</>
										)}
									</Button>
								</div>
							)}
						</div>
					</div>

					<div className="space-y-6">
						<div className="text-center md:text-left">
							<h1 className="text-4xl font-black text-gray-900 dark:text-white mb-1">
								{user.firstName} {user.lastName}
							</h1>
							<p className="text-lg text-primary font-bold">@{user.username}</p>
						</div>

						<p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl text-lg text-center md:text-left">
							{user.bio ||
								"Engineering student at the university. Interested in collaboration and sharing resources."}
						</p>

						<div className="flex flex-wrap justify-center md:justify-start gap-y-4 gap-x-8 py-4 border-y border-gray-100 dark:border-gray-800">
							<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold">
								<HiOutlineAcademicCap size={22} className="text-primary" />
								<span className="text-sm uppercase tracking-wider">
									Engineering Student
								</span>
							</div>
							<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold">
								<HiOutlineMail size={22} className="text-primary" />
								<span className="text-sm">{user.email}</span>
							</div>
							<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold">
								<HiOutlineCalendar size={22} className="text-primary" />
								<span className="text-sm">
									Joined{" "}
									{format(new Date(user.createdAt || Date.now()), "MMMM yyyy")}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs Section */}
			<div className="space-y-6">
				<div className="flex items-center gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 w-fit mx-auto md:mx-0">
					<button
						onClick={() => setActiveTab("posts")}
						className={cn(
							"px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all duration-300 flex items-center gap-3",
							activeTab === "posts"
								? "bg-white dark:bg-gray-900 text-primary shadow-sm"
								: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
						)}
					>
						<span>Posts</span>
						<span
							className={cn(
								"px-2 py-0.5 rounded-lg text-[10px]",
								activeTab === "posts"
									? "bg-primary/10"
									: "bg-gray-200 dark:bg-gray-700"
							)}
						>
							{userPosts.length}
						</span>
					</button>
					<button
						onClick={() => handleFollowsClick("followers")}
						className="px-8 py-3 rounded-[1.5rem] text-sm font-black text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-300 flex items-center gap-3"
					>
						<span>Followers</span>
						<span className="px-2 py-0.5 rounded-lg text-[10px] bg-gray-200 dark:bg-gray-700">
							{user.followers?.length || 0}
						</span>
					</button>
					<button
						onClick={() => handleFollowsClick("following")}
						className="px-8 py-3 rounded-[1.5rem] text-sm font-black text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-300 flex items-center gap-3"
					>
						<span>Following</span>
						<span className="px-2 py-0.5 rounded-lg text-[10px] bg-gray-200 dark:bg-gray-700">
							{user.following?.length || 0}
						</span>
					</button>
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
									<div className="py-24 text-center">
										<div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
											<HiDotsHorizontal size={48} className="text-primary/20" />
										</div>
										<h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">
											No posts yet
										</h4>
										<p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto">
											{isCurrentUser
												? "You haven't posted anything yet. Start sharing your thoughts with the community!"
												: "This user hasn't posted anything yet."}
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
