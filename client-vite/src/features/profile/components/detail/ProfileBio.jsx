import React from "react";
import {
	HiOutlineAcademicCap,
	HiOutlineMail,
	HiOutlineCalendar,
} from "react-icons/hi";
import { format } from "date-fns";

const ProfileBio = ({ user }) => {
	return (
		<div className="space-y-6 px-6 md:px-8 pb-8">
			<p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl text-[17px] text-center md:text-left font-medium">
				{user.bio ||
					"Engineering student at the university. Interested in collaboration and sharing resources."}
			</p>

			<div className="flex flex-wrap justify-center md:justify-start gap-y-4 gap-x-8 py-5 border-y border-slate-100 dark:border-slate-800">
				<div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-bold group">
					<div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
						<HiOutlineAcademicCap size={20} className="text-primary" />
					</div>
					<span className="text-[13px] uppercase tracking-widest">
						{user.major
							? `${user.major} - ${user.userType || "Engineering Student"}`
							: user.userType || "Engineering Student"}
					</span>
				</div>
				<div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-bold group">
					<div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
						<HiOutlineMail size={20} className="text-primary" />
					</div>
					<span className="text-[14px]">{user.email}</span>
				</div>
				<div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-bold group">
					<div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
						<HiOutlineCalendar size={20} className="text-primary" />
					</div>
					<span className="text-[14px]">
						Joined {format(new Date(user.createdAt || Date.now()), "MMMM yyyy")}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ProfileBio;
