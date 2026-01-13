import React from "react";
import InputEmoji from "react-input-emoji";

const BioInput = ({ value, onChange, darkMode }) => {
	return (
		<div className="px-1 profile-emoji-input emoji-input-container relative z-[60]">
			<style>
				{`
					.profile-emoji-input .react-input-emoji--container {
						background: transparent !important;
						border: none !important;
						margin-bottom: 0 !important;
					}
					.profile-emoji-input .react-input-emoji--wrapper {
						background: transparent !important;
						border: none !important;
						padding: 0 !important;
					}
					.profile-emoji-input .react-input-emoji--input {
						background: transparent !important;
						padding: 8px 0 !important;
						color: ${darkMode ? "white" : "#334155"} !important;
						min-height: 40px !important;
						max-height: 120px !important;
						overflow-y: auto !important;
					}
					.profile-emoji-input .react-input-emoji--button {
						padding: 8px !important;
						z-index: 100 !important;
					}
					.profile-emoji-input .react-input-emoji--picker-wrapper {
						z-index: 1000 !important;
						position: absolute !important;
						bottom: 100% !important;
						right: 0 !important;
					}
				`}
			</style>
			<InputEmoji
				value={value}
				onChange={onChange}
				cleanOnEnter={false}
				placeholder={`Say something about your new profile picture...`}
				theme={darkMode ? "dark" : "light"}
				fontSize={15}
				fontFamily="inherit"
				borderColor="transparent"
				background="transparent"
				placeholderColor={darkMode ? "#94a3b8" : "#64748b"}
				color={darkMode ? "#ffffff" : "#334155"}
			/>
		</div>
	);
};

export default BioInput;
