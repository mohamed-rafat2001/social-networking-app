import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import { Avatar } from "../../ui";

const SearchSection = ({
	searchTerm,
	setSearchTerm,
	showSearchResults,
	setShowSearchResults,
	isSearching,
	searchResults,
	searchRef,
}) => {
	return (
		<div className="flex-1 max-w-xl hidden md:block" ref={searchRef}>
			<div className="relative group">
				<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
					<HiSearch
						size={20}
						className="text-slate-400 dark:text-gray-500 group-focus-within:text-primary transition-colors"
					/>
				</div>
				<input
					type="text"
					className="block w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-gray-900/50 border-none rounded-2xl text-[15px] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-gray-900 transition-all"
					placeholder="Search about users groups..."
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setShowSearchResults(true);
					}}
					onFocus={() => setShowSearchResults(true)}
				/>

				<AnimatePresence>
					{showSearchResults && searchTerm.trim().length >= 2 && (
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[110]"
						>
							{isSearching ? (
								<div className="p-8 text-center">
									<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
									<p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
										Searching profiles...
									</p>
								</div>
							) : searchResults?.data?.length > 0 ? (
								<div className="py-2">
									{searchResults.data.map((u) => (
										<Link
											key={u._id}
											to={`/profile/${u._id}`}
											className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
											onClick={() => {
												setShowSearchResults(false);
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
							) : (
								<div className="p-8 text-center">
									<div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
										<HiSearch size={24} className="text-slate-400" />
									</div>
									<p className="text-slate-500 dark:text-slate-400 font-medium">
										No engineers found matching "{searchTerm}"
									</p>
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default SearchSection;
