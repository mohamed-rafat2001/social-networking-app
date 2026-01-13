import React from "react";

const HeroDecorations = () => {
	return (
		<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
			<div className="absolute top-24 left-10 w-72 h-72 bg-blue-100 dark:bg-primary/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
			<div
				className="absolute bottom-24 right-10 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-40 animate-pulse"
				style={{ animationDelay: "2s" }}
			></div>
		</div>
	);
};

export default HeroDecorations;
