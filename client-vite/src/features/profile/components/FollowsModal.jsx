import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import FollowsUserItem from "./FollowsUserItem";
import { useFollowsModalLogic } from "../hooks/useFollowsModalLogic";

const FollowsModal = ({ isOpen, onClose, title, users = [], currentUser }) => {
	const {
		searchTerm,
		setSearchTerm,
		filteredUsers,
		isFollowing,
		handleUserClick,
		handleFollowToggle,
	} = useFollowsModalLogic(users, currentUser, onClose);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					className="bg-white dark:bg-slate-950 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
				>
					{/* Header */}
					<div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
						<h3 className="text-xl font-black text-slate-900 dark:text-white">
							{title}
						</h3>
						<button
							onClick={onClose}
							className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
						>
							<HiOutlineX size={20} />
						</button>
					</div>

					{/* Search */}
					<div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
						<div className="relative">
							<HiOutlineSearch
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								size={18}
							/>
							<input
								type="text"
								placeholder={`Search ${title.toLowerCase()}...`}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm dark:text-white"
							/>
						</div>
					</div>

					{/* User List */}
					<div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<FollowsUserItem
									key={user._id}
									user={user}
									isMe={currentUser?._id === user._id}
									following={isFollowing(user._id)}
									onUserClick={handleUserClick}
									onFollowToggle={handleFollowToggle}
								/>
							))
						) : (
							<div className="py-12 text-center">
								<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
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
