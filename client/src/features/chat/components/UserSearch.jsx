import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Input } from "../../../shared/components/ui";
import { useQuery } from "@tanstack/react-query";
import { HiSearch, HiChatAlt } from "react-icons/hi";
import * as userService from "../../../features/profile/services/userService";
import { useCreateChat } from "../hooks/useChatQueries";

const UserSearch = ({ onClose }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const { mutate: createChat } = useCreateChat();

	const { data: searchResults, isLoading } = useQuery({
		queryKey: ["users", searchTerm],
		queryFn: () => userService.searchUsers(searchTerm),
		enabled: searchTerm.length > 2,
	});

	const handleUserClick = (userId) => {
		createChat(userId, {
			onSuccess: (data) => {
				if (onClose) onClose();
			},
		});
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto">
			<div className="p-4 border-b border-gray-100 dark:border-gray-700">
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
					New Conversation
				</h3>
				<Input
					placeholder="Search for people..."
					icon={HiSearch}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					autoFocus
				/>
			</div>

			<div className="max-h-96 overflow-y-auto p-2">
				{isLoading ? (
					<div className="text-center py-4 text-gray-500">Searching...</div>
				) : searchResults?.data?.length > 0 ? (
					searchResults.data.map((user) => (
						<div
							key={user._id}
							className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer group"
							onClick={() => handleUserClick(user._id)}
						>
							<Link
								to={`/profile/${user._id}`}
								onClick={(e) => e.stopPropagation()}
								className="shrink-0"
							>
								<Avatar src={user.image?.secure_url} size="md" />
							</Link>
							<div className="flex-1 min-w-0">
								<Link
									to={`/profile/${user._id}`}
									onClick={(e) => e.stopPropagation()}
									className="font-bold text-gray-900 dark:text-white hover:text-primary transition-colors block truncate"
								>
									{user.firstName} {user.lastName}
								</Link>
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									@{user.username}
								</p>
							</div>
							<HiChatAlt
								className="text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors"
								size={20}
							/>
						</div>
					))
				) : searchTerm.length > 2 ? (
					<div className="text-center py-8 text-gray-500 dark:text-gray-400">
						No users found
					</div>
				) : (
					<div className="text-center py-12 text-gray-400 dark:text-gray-500">
						<HiChatAlt size={48} className="mx-auto mb-2 opacity-20" />
						<p>Type a name to search</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserSearch;
