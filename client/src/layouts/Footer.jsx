import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from "react-icons/fa";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8">
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
				{/* Logo Left */}
				<Link to="/" className="flex items-center gap-2">
					<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none">
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
					<span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
						Engi<span className="text-primary">Connect</span>
					</span>
				</Link>

				{/* Copyright Middle */}
				<div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
					&copy; {currentYear} EngiConnect. All rights reserved by{" "}
					<span className="text-gray-900 dark:text-white font-bold">
						Mohamed Rafat
					</span>
				</div>

				{/* Social Links Right */}
				<div className="flex gap-4">
					{[
						{
							icon: FaGithub,
							href: "https://github.com/mohamed-rafat2001",
						},
						{
							icon: FaLinkedin,
							href: "https://www.linkedin.com/in/mohamed-rafat-19046b229/",
						},
					].map((social, idx) => (
						<a
							key={idx}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-primary transition-colors"
						>
							<social.icon size={20} />
						</a>
					))}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
