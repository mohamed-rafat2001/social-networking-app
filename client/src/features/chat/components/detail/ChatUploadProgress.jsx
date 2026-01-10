import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatUploadProgress = ({ uploadProgress }) => {
    return (
        <AnimatePresence>
            {uploadProgress > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                {uploadProgress === 100 ? "Processing..." : "Uploading..."}
                            </span>
                            <span className="text-[10px] font-bold text-primary">
                                {uploadProgress}%
                            </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatUploadProgress;
