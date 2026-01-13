import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
	return (
		<Link to="/" className="flex items-center gap-2.5 group">
			<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
				<svg
					className="w-5 h-5 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2.5"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					></path>
				</svg>
			</div>
			<span className="hidden sm:block text-xl font-black tracking-tight text-slate-900 dark:text-white">
				Engi<span className="text-primary">Connect</span>
			</span>
		</Link>
	);
};

export default Logo;
