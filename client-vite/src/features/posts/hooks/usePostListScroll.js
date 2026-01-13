import { useState, useEffect, useRef } from "react";

export function usePostListScroll(posts) {
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [hasNewContent, setHasNewContent] = useState(false);
	const lastPostIdRef = useRef(null);

	// Track scroll position for "Back to Top" button
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 500) {
				setShowScrollTop(true);
			} else {
				setShowScrollTop(false);
				setHasNewContent(false); // Reset when user reaches top
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Detect new posts at the top
	useEffect(() => {
		if (posts.length > 0) {
			const newestPostId = posts[0]._id;
			if (lastPostIdRef.current && lastPostIdRef.current !== newestPostId) {
				if (window.scrollY > 300) {
					setHasNewContent(true);
				}
			}
			lastPostIdRef.current = newestPostId;
		}
	}, [posts]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setHasNewContent(false);
	};

	return {
		showScrollTop,
		hasNewContent,
		setHasNewContent,
		scrollToTop,
	};
}
