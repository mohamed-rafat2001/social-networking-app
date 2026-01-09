import { useParams } from "react-router-dom";
import { useUserProfile } from "../../auth/hooks/useUserQueries";
import { useSocket } from "../../../providers/SocketProvider";
import { usePosts } from "../../posts/hooks/usePostQueries";
import { Avatar, Button, Spinner } from "../../../shared/components/UI";
import {
	HiOutlineMail,
	HiOutlineAcademicCap,
	HiOutlineCalendar,
	HiOutlineChatAlt2,
	HiRefresh,
	HiHeart,
	HiDotsHorizontal,
} from "react-icons/hi";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const ProfileDetail = () => {
	const { userId } = useParams();
	const { onlineUsers } = useSocket();
	const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
	const { data: postsResponse, isLoading: postsLoading } = usePosts();

	const allPosts = postsResponse?.data || [];
	const userPosts = Array.isArray(allPosts)
		? allPosts.filter((post) => post.userId?._id === userId)
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

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-8">
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
						<div className="flex gap-3">
							<Button variant="secondary" className="rounded-xl">
								Message
							</Button>
							<Button className="rounded-xl">Follow</Button>
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
							<div className="text-center">
								<p className="text-xl font-black text-gray-900 dark:text-white">
									{user.followers?.length || 0}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
									Followers
								</p>
							</div>
							<div className="text-center">
								<p className="text-xl font-black text-gray-900 dark:text-white">
									{user.following?.length || 0}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
									Following
								</p>
							</div>
							<div className="text-center">
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

			{/* User Posts Section */}
			<div className="space-y-4">
				<h3 className="text-xl font-black text-gray-900 dark:text-white px-4">
					Posts
				</h3>
				<div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
					<AnimatePresence initial={false}>
						{userPosts.length > 0 ? (
							userPosts.map((post, index) => (
								<motion.div
									key={post._id}
									className="border-b dark:border-gray-800 p-6 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.3,
										delay: Math.min(index * 0.05, 0.5),
									}}
									layout
								>
									<div className="flex gap-4">
										<Avatar
											src={user.image?.secure_url}
											isActive={onlineUsers?.some(
												(u) => String(u.userId) === String(user._id)
											)}
										/>
										<div className="flex-1">
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-2 flex-wrap">
													<span className="font-bold text-gray-900 dark:text-white">
														{user.firstName} {user.lastName}
													</span>
													<span className="text-gray-500 dark:text-gray-400 text-sm">
														·{" "}
														{formatDistanceToNow(new Date(post.createdAt), {
															addSuffix: true,
														})}
													</span>
												</div>
												<button className="text-gray-400 hover:text-primary p-2 rounded-full transition-colors">
													<HiDotsHorizontal />
												</button>
											</div>

											<p className="mt-2 mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
												{post.text}
											</p>

											{post.fileUp?.[0] && (
												<div className="rounded-2xl overflow-hidden border dark:border-gray-800 mb-4 bg-gray-50 dark:bg-gray-800/50">
													<img
														className="w-full h-auto max-h-[600px] object-contain block mx-auto"
														src={post.fileUp[0].secure_url}
														alt="Post content"
													/>
												</div>
											)}

											<div className="flex justify-between text-gray-500 dark:text-gray-400 max-w-md">
												<button className="flex items-center gap-2 hover:text-primary transition-colors group">
													<div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
														<HiOutlineChatAlt2 size={20} />
													</div>
													<span className="text-sm font-medium">0</span>
												</button>
												<button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
													<div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
														<HiRefresh size={20} />
													</div>
													<span className="text-sm font-medium">
														{post.shares?.length || 0}
													</span>
												</button>
												<button className="flex items-center gap-2 hover:text-pink-500 transition-colors group">
													<div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
														<HiHeart size={20} />
													</div>
													<span className="text-sm font-medium">
														{post.likes?.length || 0}
													</span>
												</button>
											</div>
										</div>
									</div>
								</motion.div>
							))
						) : (
							<div className="py-20 text-center">
								<div className="bg-gray-50 dark:bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
									<HiOutlineChatAlt2
										size={40}
										className="text-gray-300 dark:text-gray-600"
									/>
								</div>
								<p className="text-gray-500 dark:text-gray-400 font-medium">
									No posts yet
								</p>
							</div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default ProfileDetail;
