import React from "react";
import { Modal, Button } from "../../../../shared/components/ui";

const EditMessageModal = ({
	editingMessage,
	setEditingMessage,
	editContent,
	setEditContent,
	handleUpdateMessage,
}) => {
	return (
		<Modal
			isOpen={!!editingMessage}
			onClose={() => setEditingMessage(null)}
			title="Edit Message"
		>
			<div className="space-y-4">
				<textarea
					className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
					placeholder="Edit your message..."
					value={editContent}
					onChange={(e) => setEditContent(e.target.value)}
				/>
				<div className="flex justify-end gap-3">
					<Button variant="secondary" onClick={() => setEditingMessage(null)}>
						Cancel
					</Button>
					<Button onClick={handleUpdateMessage}>Update Message</Button>
				</div>
			</div>
		</Modal>
	);
};

export default EditMessageModal;
