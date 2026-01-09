import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { useState } from "react";
import { Avatar, Button } from "../../../shared/components/UI";
import { useNavigate } from "react-router-dom";

const FollowsModal = ({ isOpen, onClose, title, users = [], currentUser }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	const filteredUsers = users.filter((user) => {
		const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
		const username = user.username?.toLowerCase() || "";
		return (
			fullName.includes(searchTerm.toLowerCase()) ||
			username.includes(searchTerm.toLowerCase())
		);
	});

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
				>
					{/* Header */}
					<div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
						<h3 className="text-xl font-black text-gray-900 dark:text-white">
							{title}
						</h3>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
						>
							<HiOutlineX size={20} />
						</button>
					</div>

					{/* Search */}
					<div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
						<div className="relative">
							<HiOutlineSearch
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								size={18}
							/>
							<input
								type="text"
								placeholder={`Search ${title.toLowerCase()}...`}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm dark:text-white"
							/>
						</div>
					</div>

					{/* User List */}
					<div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<div
									key={user._id}
									className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all group"
								>
									<div
										className="flex items-center gap-3 cursor-pointer flex-1"
										onClick={() => {
											navigate(`/profile/${user._id}`);
											onClose();
										}}
									>
										<Avatar src={user.image?.secure_url} size="md" />
										<div className="min-w-0">
											<p className="font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
												{user.firstName} {user.lastName}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
												@{user.username}
											</p>
										</div>
									</div>
									{currentUser?._id !== user._id && (
										<Button
											variant="secondary"
											size="sm"
											className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={() => {
												navigate(`/profile/${user._id}`);
												onClose();
											}}
										>
											View
										</Button>
									)}
								</div>
							))
						) : (
							<div className="py-12 text-center">
								<p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
									{searchTerm ? "No users found" : "No users yet"}
								</p>
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
};

export default FollowsModal;
