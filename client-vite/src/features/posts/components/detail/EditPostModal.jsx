import React from "react";
import { Modal, Button } from "../../../../shared/components/ui";

const EditPostModal = ({
	isOpen,
	onClose,
	content,
	onContentChange,
	onSave,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Edit Post"
		>
			<div className="space-y-4">
				<textarea
					className="w-full min-h-[150px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
					placeholder="What's on your mind?"
					value={content}
					onChange={(e) => onContentChange(e.target.value)}
				/>
				<div className="flex justify-end gap-3">
					<Button
						variant="secondary"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button onClick={onSave}>Save Changes</Button>
				</div>
			</div>
		</Modal>
	);
};

export default EditPostModal;
