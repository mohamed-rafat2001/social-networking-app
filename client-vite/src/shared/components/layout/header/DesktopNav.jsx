import React from "react";

const DesktopNav = ({ navLinks }) => {
	return (
		<nav className="hidden lg:flex items-center gap-8">
			{navLinks.map((link) => (
				<a
					key={link.name}
					href={link.href}
					className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
				>
					{link.name}
				</a>
			))}
		</nav>
	);
};

export default DesktopNav;
