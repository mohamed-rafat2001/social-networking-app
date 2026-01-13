import React from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Avatar, Dropdown, DropdownItem } from "../../../../shared/components/ui";

const ProfileAvatar = ({
	user,
	isCurrentUser,
	onlineUsers,
	setIsUploadModalOpen,
	setIsDeleteModalOpen,
}) => {
	const isActive = onlineUsers?.some((u) => String(u.userId) === String(user._id));

	if (isCurrentUser) {
		return (
			<div className="relative group">
				<Dropdown
					trigger={
						<div className="cursor-pointer relative">
							<Avatar
								src={user.image?.secure_url}
								size="2xl"
								className="ring-[6px] ring-white dark:ring-slate-900 shadow-2xl transition-transform duration-300 group-hover:scale-105"
								isActive={isActive}
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ring-[6px] ring-white dark:ring-slate-900">
								<HiOutlinePencil className="text-white" size={28} />
							</div>
						</div>
					}
					align="left"
				>
					<DropdownItem
						icon={HiOutlinePencil}
						onClick={() => setIsUploadModalOpen(true)}
					>
						Upload Photo
					</DropdownItem>
					{user.image?.secure_url && (
						<DropdownItem
							icon={HiOutlineTrash}
							variant="danger"
							onClick={() => setIsDeleteModalOpen(true)}
						>
							Delete Photo
						</DropdownItem>
					)}
				</Dropdown>
			</div>
		);
	}

	return (
		<Avatar
			src={user.image?.secure_url}
			size="2xl"
			className="ring-[6px] ring-white dark:ring-slate-900 shadow-2xl transition-transform duration-300 group-hover:scale-105"
			isActive={isActive}
		/>
	);
};

export default ProfileAvatar;
