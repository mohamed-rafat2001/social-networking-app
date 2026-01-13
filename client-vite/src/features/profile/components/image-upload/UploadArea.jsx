import React from "react";
import { HiOutlinePhotograph, HiOutlineX } from "react-icons/hi";
import { ProgressBar, cn } from "../../../../shared/components/ui";

const UploadArea = ({
	previewUrl,
	isDragging,
	isLoading,
	uploadProgress,
	onDragOver,
	onDragLeave,
	onDrop,
	onClick,
	onRemove,
}) => {
	return (
		<div className="px-1">
			{!previewUrl ? (
				<div
					onClick={onClick}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}
					onDrop={onDrop}
					className={cn(
						"border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group bg-slate-50/50 dark:bg-slate-800/30",
						isDragging
							? "border-primary bg-primary/10 scale-[1.01]"
							: "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5"
					)}
				>
					<div
						className={cn(
							"w-12 h-12 rounded-full flex items-center justify-center transition-colors",
							isDragging
								? "bg-primary text-white"
								: "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-primary"
						)}
					>
						<HiOutlinePhotograph size={24} />
					</div>
					<div className="text-center">
						<p className="text-sm font-bold text-slate-900 dark:text-white">
							{isDragging ? "Drop photo here" : "Add Profile Photo"}
						</p>
						<p className="text-xs text-slate-500 dark:text-slate-400">
							or drag and drop
						</p>
					</div>
				</div>
			) : (
				<div className="relative rounded-[2rem] overflow-hidden group border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-950">
					<div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 max-h-[400px]">
						<img
							src={previewUrl}
							alt="Preview"
							className={cn(
								"max-w-full max-h-[400px] object-contain transition-all duration-500",
								isLoading && "blur-sm scale-105 brightness-75"
							)}
						/>
					</div>

					{isLoading && (
						<div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-[2px]">
							<div className="w-full max-w-xs space-y-4">
								<div className="flex justify-between items-end text-white">
									<span className="text-xs font-black uppercase tracking-widest drop-shadow-md">
										Uploading
									</span>
									<span className="text-lg font-black drop-shadow-md">
										{uploadProgress}%
									</span>
								</div>
								<ProgressBar
									progress={uploadProgress}
									className="h-2 shadow-xl ring-1 ring-white/20"
								/>
							</div>
						</div>
					)}

					{!isLoading && (
						<button
							onClick={onRemove}
							className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 p-1.5 rounded-full text-white transition-colors backdrop-blur-sm"
						>
							<HiOutlineX size={18} />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default UploadArea;
