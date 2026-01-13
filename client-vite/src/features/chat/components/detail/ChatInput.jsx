import React from "react";
import { HiOutlinePaperClip, HiOutlinePaperAirplane } from "react-icons/hi";
import InputEmoji from "react-input-emoji";
import { motion } from "framer-motion";
import { Button, Spinner, cn } from "../../../../shared/components/ui";

const ChatInput = ({
	text,
	setText,
	handleSend,
	handleFileSelect,
	fileInputRef,
	isSending,
	selectedFiles,
	darkMode,
}) => {
	const isDisabled = isSending || (!text.trim() && selectedFiles.length === 0);

	return (
		<div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
			<div className="flex items-end gap-3 max-w-7xl mx-auto">
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="p-3 text-slate-500 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-2xl transition-all shrink-0 mb-0.5"
				>
					<HiOutlinePaperClip size={22} />
				</motion.button>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileSelect}
					multiple
					accept="image/*"
					className="hidden"
				/>

				<div className="flex-1 min-h-[46px] emoji-input-container relative z-[60]">
					<style>
						{`
							.emoji-input-container .react-input-emoji--container {
								margin: 0 !important;
								border: 1px solid transparent !important;
								background: ${darkMode ? "#0f172a" : "#f1f5f9"} !important;
								transition: all 0.2s ease !important;
							}
							.emoji-input-container .react-input-emoji--container:focus-within {
								border-color: #3b82f640 !important;
								background: ${darkMode ? "#1e293b" : "#f8fafc"} !important;
								box-shadow: 0 0 0 4px #3b82f610 !important;
							}
							.emoji-input-container .react-input-emoji--input {
								padding: 10px 12px !important;
								min-height: 44px !important;
							}
							.emoji-input-container .react-input-emoji--picker-wrapper {
								z-index: 1000 !important;
								position: absolute !important;
								bottom: 100% !important;
								right: 0 !important;
								margin-bottom: 10px !important;
							}
							.emoji-input-container .react-input-emoji--button {
								padding: 10px !important;
								color: #64748b !important;
							}
							.emoji-input-container .react-input-emoji--button:hover {
								color: #3b82f6 !important;
							}
						`}
					</style>
					<InputEmoji
						value={text}
						onChange={setText}
						cleanOnEnter
						onEnter={handleSend}
						placeholder="Type a message..."
						theme={darkMode ? "dark" : "light"}
						background="transparent"
						color={darkMode ? "#f1f5f9" : "#1e293b"}
						placeholderColor={darkMode ? "#475569" : "#94a3b8"}
						borderRadius={16}
						fontSize={15}
						fontFamily="inherit"
					/>
				</div>

				<motion.div
					whileHover={!isDisabled ? { scale: 1.05 } : {}}
					whileTap={!isDisabled ? { scale: 0.95 } : {}}
					className="shrink-0 mb-0.5"
				>
					<Button
						onClick={handleSend}
						disabled={isDisabled}
						className={cn(
							"p-3 rounded-2xl h-[46px] w-[46px] flex items-center justify-center transition-all duration-300",
							!isDisabled
								? "bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/20 hover:shadow-primary/30"
								: "bg-slate-200 dark:bg-slate-800 text-slate-400"
						)}
					>
						{isSending ? (
							<Spinner size="sm" color="white" />
						) : (
							<HiOutlinePaperAirplane className="rotate-90" size={20} />
						)}
					</Button>
				</motion.div>
			</div>
		</div>
	);
};

export default ChatInput;
