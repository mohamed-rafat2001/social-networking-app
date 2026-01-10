import React from "react";
import { HiArrowLeft } from "react-icons/hi";

const PostDetailHeader = ({ onBack }) => {
    return (
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-[60] px-4 py-3 flex items-center gap-8">
            <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-900 dark:text-white"
            >
                <HiArrowLeft className="text-xl" />
            </button>
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Post
                </h1>
                <p className="text-xs text-gray-500">Thread</p>
            </div>
        </div>
    );
};

export default PostDetailHeader;
