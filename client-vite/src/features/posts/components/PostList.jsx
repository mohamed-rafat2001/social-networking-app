import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useUser } from "../../../shared/hooks/useUser.js";
import { usePosts } from "../hooks/usePostQueries.js";
import { useSocket } from "../../../shared/hooks/useSocket";
import { usePostListScroll } from "../hooks/usePostListScroll";

// Sub-components
import FeedTabs from "./FeedTabs";
import CreatePost from "./CreatePost";
import PostFeed from "./PostFeed";
import ScrollToTopButton from "./ScrollToTopButton";

function PostList() {
	const [feedType, setFeedType] = useState("for-you");
	const { user } = useUser();
	useSocket();

	const {
		data: postsData,
		isLoading: isPostsLoading,
		error: postsError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = usePosts(feedType);

	const posts = postsData?.pages.flatMap((page) => page.data) || [];

	// Infinite Scroll
	const { ref, inView } = useInView({
		threshold: 0,
		rootMargin: "100px",
	});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Scroll and New Content Logic
	const { showScrollTop, hasNewContent, scrollToTop } =
		usePostListScroll(posts);

	if (postsError) {
		console.error(`PostList [${feedType}] fetch error:`, postsError);
	}

	return (
		<div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
			<FeedTabs feedType={feedType} setFeedType={setFeedType} />

			<CreatePost user={user} />

			<PostFeed
				ref={ref}
				posts={posts}
				isPostsLoading={isPostsLoading}
				isFetchingNextPage={isFetchingNextPage}
				hasNextPage={hasNextPage}
				feedType={feedType}
			/>

			<ScrollToTopButton
				show={showScrollTop}
				hasNewContent={hasNewContent}
				onClick={scrollToTop}
			/>
		</div>
	);
}

export default PostList;
