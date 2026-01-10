import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiDotsHorizontal } from "react-icons/hi";
import { PostItem } from "../../../posts";

const ProfileContent = ({ activeTab, userPosts, isCurrentUser }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
            <AnimatePresence mode="wait">
                {activeTab === "posts" && (
                    <motion.div
                        key="posts"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {userPosts.length > 0 ? (
                            userPosts.map((post, index) => (
                                <PostItem key={post._id} post={post} index={index} />
                            ))
                        ) : (
                            <div className="py-24 text-center">
                                <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <HiDotsHorizontal size={48} className="text-primary/20" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                                    No posts yet
                                </h4>
                                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto">
                                    {isCurrentUser
                                        ? "You haven't posted anything yet. Start sharing your thoughts with the community!"
                                        : "This user hasn't posted anything yet."}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileContent;
