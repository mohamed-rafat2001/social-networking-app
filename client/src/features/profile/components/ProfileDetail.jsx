import { useParams } from "react-router-dom";
import { useUserProfile } from "../../auth/hooks/useUserQueries";
import { Avatar, Button } from "../../../ui";
import {
	HiOutlineMail,
	HiOutlineAcademicCap,
	HiOutlineCalendar,
} from "react-icons/hi";
import { format } from "date-fns";

const ProfileDetail = () => {
	const { userId } = useParams();
	const { data: profile, isLoading } = useUserProfile(userId);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
							<p className="text-gray-500 dark:text-gray-400 font-medium">
								@{user.firstName.toLowerCase()}
								{user.lastName.toLowerCase()}
							</p>
						</div>

						<p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
							{user.bio ||
								"Engineering student at the university. Interested in collaboration and sharing resources."}
						</p>

						<div className="flex flex-wrap gap-6 pt-2">
							<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
								<HiOutlineAcademicCap size={18} className="text-primary" />
								<span>Student ID: {user.idNumber}</span>
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
									{user.posts?.length || 0}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
									Posts
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileDetail;
