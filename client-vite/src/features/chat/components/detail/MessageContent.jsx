import React from "react";
import { ImageGallery, cn } from "../../../../shared/components/ui";

export const MessageContent = ({ msg, isMe }) => {
	return (
		<div
			className={cn(
				"flex flex-col gap-2",
				isMe ? "items-end" : "items-start"
			)}
		>
			{msg.file && msg.file.length > 0 && (
				<div
					className={cn(
						"w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] overflow-hidden rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800",
						isMe ? "rounded-tr-none" : "rounded-tl-none"
					)}
				>
					<ImageGallery images={msg.file} />
				</div>
			)}
			{msg.content && (
				<div
					className={cn(
						"px-4 py-2.5 rounded-2xl text-[14.5px] leading-relaxed shadow-sm",
						isMe
							? "bg-gradient-to-br from-primary to-blue-600 text-white rounded-tr-none"
							: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50"
					)}
				>
					{msg.content}
				</div>
			)}
		</div>
	);
};
