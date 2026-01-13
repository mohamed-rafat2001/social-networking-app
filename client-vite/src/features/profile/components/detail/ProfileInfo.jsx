import React from "react";

const ProfileInfo = ({ user }) => {
	return (
		<div className="text-center md:text-left">
			<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
				<h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
					{user.firstName} {user.lastName}
				</h1>
				<span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-600 uppercase tracking-widest w-fit">
					{user.userType}
				</span>
			</div>
			<p className="text-xl text-blue-600 font-black tracking-tight">
				@{user.username}
			</p>
		</div>
	);
};

export default ProfileInfo;
