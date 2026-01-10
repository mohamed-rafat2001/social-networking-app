import React from "react";
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineCalendar } from "react-icons/hi";
import { format } from "date-fns";

const ProfileBio = ({ user }) => {
    return (
        <div className="space-y-6 px-8 pb-8">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl text-lg text-center md:text-left">
                {user.bio || "Engineering student at the university. Interested in collaboration and sharing resources."}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-y-4 gap-x-8 py-4 border-y border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold">
                    <HiOutlineAcademicCap size={22} className="text-primary" />
                    <span className="text-sm uppercase tracking-wider">
                        Engineering Student
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold">
                    <HiOutlineMail size={22} className="text-primary" />
                    <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold">
                    <HiOutlineCalendar size={22} className="text-primary" />
                    <span className="text-sm">
                        Joined {format(new Date(user.createdAt || Date.now()), "MMMM yyyy")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileBio;
