import React from "react";
import { Button } from "../../../shared/components/ui";

const UploadActions = ({ onCancel, onUpload, isLoading, hasFile }) => {
	return (
		<div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
			<div className="flex gap-2">
				<Button
					variant="secondary"
					size="sm"
					className="rounded-xl px-4 font-bold"
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button
					variant="primary"
					size="sm"
					className="rounded-xl px-6 font-bold shadow-md shadow-primary/20"
					onClick={onUpload}
					disabled={!hasFile || isLoading}
				>
					{isLoading ? "Saving..." : "Post Update"}
				</Button>
			</div>
		</div>
	);
};

export default UploadActions;
