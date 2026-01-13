import React from "react";
import { HiPhotograph } from "react-icons/hi";
import { Button, Spinner, cn } from "../../../../shared/components/ui";

export const PostActions = ({ 
	fileInputRef, 
	text, 
	files, 
	isUploading 
}) => {
	return (
		<div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
			<div className="flex items-center">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="p-2.5 text-primary hover:bg-primary/10 rounded-full transition-all active:scale-95"
					title="Add Media"
				>
					<HiPhotograph size={22} />
				</button>
			</div>

			<div className="flex items-center gap-4">
				{text.length > 0 && (
					<span
						className={cn(
							"text-[13px] font-medium",
							text.length > 1800 ? "text-red-500" : "text-slate-400"
						)}
					>
						{text.length}/2000
					</span>
				)}
				<Button
					type="submit"
					disabled={(!text.trim() && files.length === 0) || isUploading}
					className="rounded-full px-6 py-2 shadow-lg shadow-primary/20"
				>
					{isUploading ? <Spinner size="sm" /> : "Post"}
				</Button>
			</div>
		</div>
	);
};
