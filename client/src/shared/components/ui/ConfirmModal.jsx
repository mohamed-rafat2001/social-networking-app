import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

/**
 * ConfirmModal Component
 */
export const ConfirmModal = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Are you sure?",
	message = "This action cannot be undone.",
	confirmText = "Delete",
	cancelText = "Cancel",
	variant = "danger",
	isLoading = false,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<div className="space-y-4">
				<p className="text-gray-600 dark:text-gray-400">{message}</p>
				<div className="flex justify-end gap-3 pt-2">
					<Button variant="secondary" onClick={onClose} disabled={isLoading}>
						{cancelText}
					</Button>
					<Button
						variant={variant}
						onClick={() => {
							onConfirm();
							onClose();
						}}
						disabled={isLoading}
					>
						{isLoading ? <Spinner size="sm" variant="white" /> : confirmText}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
