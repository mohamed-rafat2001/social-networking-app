import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import { Button } from "../../ui";

const MobileMenuOverlay = ({
	showMobileMenu,
	setShowMobileMenu,
	user,
	navLinks,
	navigate,
}) => {
	if (!showMobileMenu) return null;

	return (
		<motion.div
			initial={{ opacity: 0, x: "100%" }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: "100%" }}
			className="fixed inset-0 z-[200] bg-white dark:bg-slate-950 flex flex-col p-6 lg:hidden"
		>
			<div className="flex items-center justify-between mb-8">
				<Link
					to="/"
					className="flex items-center gap-2"
					onClick={() => setShowMobileMenu(false)}
				>
					<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-xl">S</span>
					</div>
					<span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
						SocialApp
					</span>
				</Link>
				<button
					onClick={() => setShowMobileMenu(false)}
					className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
				>
					<HiX size={24} />
				</button>
			</div>
			<nav className="flex flex-col gap-4">
				{navLinks.map((link) => (
					<a
						key={link.name}
						href={link.href}
						onClick={() => setShowMobileMenu(false)}
						className="text-lg font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800"
					>
						{link.name}
					</a>
				))}
			</nav>
			<div className="mt-auto flex flex-col gap-3">
				{user ? (
					<Button
						onClick={() => {
							setShowMobileMenu(false);
							navigate("/feed");
						}}
						className="w-full py-4 rounded-xl font-bold"
					>
						Go to Feed
					</Button>
				) : (
					<>
						<Button
							variant="outline"
							onClick={() => {
								setShowMobileMenu(false);
								navigate("/welcome", { state: { mode: "login" } });
							}}
							className="w-full py-4 rounded-xl font-bold"
						>
							Log In
						</Button>
						<Button
							onClick={() => {
								setShowMobileMenu(false);
								navigate("/welcome", { state: { mode: "signup" } });
							}}
							className="w-full py-4 rounded-xl font-bold"
						>
							Join Now
						</Button>
					</>
				)}
			</div>
		</motion.div>
	);
};

export default MobileMenuOverlay;
