import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import { Avatar } from "../../ui";

const MobileSearchOverlay = ({
	showMobileSearch,
	setShowMobileSearch,
	searchTerm,
	setSearchTerm,
	isSearching,
	searchResults,
}) => {
	if (!showMobileSearch) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="fixed inset-0 bg-white dark:bg-slate-900 z-[120] flex flex-col"
		>
			<div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
				<div className="flex-1 relative">
					<HiSearch
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						size={20}
					/>
					<input
						type="text"
						autoFocus
						className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-800 border-none rounded-xl text-[15px] focus:ring-2 focus:ring-primary/20 dark:text-white"
						placeholder="Search about users groups..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<button
					onClick={() => {
						setShowMobileSearch(false);
						setSearchTerm("");
					}}
					className="p-2 text-slate-500 font-bold text-sm"
				>
					Cancel
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-4">
				{isSearching ? (
					<div className="p-8 text-center">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
						<p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
							Searching profiles...
						</p>
					</div>
				) : searchTerm.trim().length >= 2 && searchResults?.data?.length > 0 ? (
					<div className="space-y-2">
						{searchResults.data.map((u) => (
							<Link
								key={u._id}
								to={`/profile/${u._id}`}
								className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => {
									setShowMobileSearch(false);
									setSearchTerm("");
								}}
							>
								<Avatar src={u.image?.secure_url} size="md" />
								<div className="min-w-0">
									<p className="font-bold text-slate-900 dark:text-white truncate">
										{u.firstName} {u.lastName}
									</p>
									<p className="text-sm text-slate-500 dark:text-gray-400 truncate">
										@{u.username || u.firstName.toLowerCase()}
									</p>
								</div>
							</Link>
						))}
					</div>
				) : searchTerm.trim().length >= 2 ? (
					<div className="p-8 text-center">
						<div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
							<HiSearch size={24} className="text-slate-400" />
						</div>
						<p className="text-slate-500 dark:text-slate-400 font-medium">
							No engineers found matching "{searchTerm}"
						</p>
					</div>
				) : null}
			</div>
		</motion.div>
	);
};

export default MobileSearchOverlay;
