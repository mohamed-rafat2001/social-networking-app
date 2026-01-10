import React from "react";
import { HiOutlinePaperClip, HiOutlinePaperAirplane } from "react-icons/hi";
import InputEmoji from "react-input-emoji";
import { Button, Spinner } from "../../../../shared/components/ui";

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
	return (
		<div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
			<div className="flex items-end gap-2">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="p-3 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
				>
					<HiOutlinePaperClip size={22} />
				</button>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileSelect}
					multiple
					accept="image/*"
					className="hidden"
				/>

				<div className="flex-1 min-h-[46px] emoji-input-container">
					<InputEmoji
						value={text}
						onChange={setText}
						cleanOnEnter
						onEnter={handleSend}
						placeholder="Type a message..."
						theme={darkMode ? "dark" : "light"}
						background={darkMode ? "#1f2937" : "#f9fafb"}
						color={darkMode ? "#f3f4f6" : "#1f2937"}
						placeholderColor={darkMode ? "#9ca3af" : "#6b7280"}
						borderRadius={12}
						fontSize={14}
						fontFamily="inherit"
					/>
				</div>

				<Button
					onClick={handleSend}
					disabled={isSending || (!text.trim() && selectedFiles.length === 0)}
					className="shrink-0 p-3 rounded-xl h-[46px] w-[46px] flex items-center justify-center"
				>
					{isSending ? (
						<Spinner size="sm" color="white" />
					) : (
						<HiOutlinePaperAirplane className="rotate-90" size={20} />
					)}
				</Button>
			</div>
		</div>
	);
};

export default ChatInput;
