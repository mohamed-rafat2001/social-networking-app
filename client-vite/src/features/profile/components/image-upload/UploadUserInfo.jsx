import React from "react";
import { Avatar } from "../../../shared/components/ui";

const UploadUserInfo = ({ user }) => {
	return (
		<div className="flex items-center gap-3 px-1">
			<Avatar src={user?.image?.secure_url} size="md" />
			<div>
				<h3 className="font-bold text-slate-900 dark:text-white leading-tight">
					{user?.firstName} {user?.lastName}
				</h3>
				<p className="text-xs text-slate-500 dark:text-slate-400">
					Updating profile...
				</p>
			</div>
		</div>
	);
};

export default UploadUserInfo;
