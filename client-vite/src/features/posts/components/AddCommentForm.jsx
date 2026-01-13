import React from "react";
import { Controller } from "react-hook-form";
import InputEmoji from "react-input-emoji";
import { Avatar, Button, Spinner } from "../../../shared/components/ui";
import { useAddCommentForm } from "../hooks/useAddCommentForm";

function AddCommentForm({ user, darkMode, postId, recipientId }) {
	const { control, handleSubmit, isLoading, text, errors } = useAddCommentForm(
		postId,
		recipientId
	);

	return (
		<div className="p-4 border-b dark:border-slate-800">
			<div className="flex gap-4">
				<Avatar src={user?.image?.secure_url} size="md" />
				<div className="flex-1 min-w-0">
					<form onSubmit={handleSubmit}>
						<div className="emoji-input-container relative z-[60]">
							<style>
								{`
									.emoji-input-container .react-input-emoji--container {
										background: transparent !important;
										border: none !important;
										margin-bottom: 0 !important;
									}
									.emoji-input-container .react-input-emoji--wrapper {
										background: transparent !important;
										border: none !important;
										padding: 0 !important;
									}
									.emoji-input-container .react-input-emoji--input {
										background: transparent !important;
										padding: 8px 0 !important;
										color: ${darkMode ? "white" : "#1f2937"} !important;
										min-height: 40px !important;
										max-height: 120px !important;
										overflow-y: auto !important;
									}
									.emoji-input-container .react-input-emoji--button {
										padding: 8px !important;
										z-index: 100 !important;
									}
									.emoji-input-container .react-input-emoji--picker-wrapper {
										z-index: 1000 !important;
										position: absolute !important;
										bottom: 100% !important;
										right: 0 !important;
									}
								`}
							</style>
							<Controller
								name="text"
								control={control}
								render={({ field }) => (
									<InputEmoji
										value={field.value}
										onChange={field.onChange}
										cleanOnEnter
										onEnter={() => handleSubmit()}
										placeholder="Post your reply"
										fontSize={15}
										fontFamily="inherit"
										borderColor="transparent"
										theme={darkMode ? "dark" : "light"}
										background="transparent"
										color={darkMode ? "#ffffff" : "#1f2937"}
										placeholderColor={darkMode ? "#9ca3af" : "#6b7280"}
									/>
								)}
							/>
						</div>
						{errors.text && (
							<p className="text-xs text-red-500 mt-1 px-2">
								{errors.text.message}
							</p>
						)}
						<div className="flex justify-end mt-3">
							<button
								type="submit"
								disabled={!text?.trim() || isLoading}
								className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-bold transition-all
									${
										!text?.trim() || isLoading
											? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
											: "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/10"
									}`}
							>
								{isLoading ? <Spinner size="xs" variant="white" /> : "Reply"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default AddCommentForm;
