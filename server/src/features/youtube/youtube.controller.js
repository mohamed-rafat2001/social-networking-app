import Youtube from "./youtube.model.js";
import { catchAsync } from "../../shared/middlewares/errorHandler.js";

export const getChannelPlaylists = catchAsync(async (req, res) => {
	try {
		const params = new URLSearchParams({
			channelId: req.params.id,
			part: "snippet",
			maxResults: "50",
		});

		const response = await fetch(
			`https://youtube-v31.p.rapidapi.com/playlists?${params}`,
			{
				method: "GET",
				headers: {
					"X-RapidAPI-Key":
						"8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954",
					"X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const playList = data.items.map((el) => ({
			id: el.id,
			title: el.snippet.title,
			img: el.snippet.thumbnails.default.url,
		}));

		res.send(playList);
	} catch (err) {
		res.send(err.message);
	}
});

export const getPlaylistItems = catchAsync(async (req, res) => {
	try {
		const params = new URLSearchParams({
			playlistId: req.params.id,
			part: "snippet",
			maxResults: "50",
		});

		const response = await fetch(
			`https://youtube-v31.p.rapidapi.com/playlistItems?${params}`,
			{
				method: "GET",
				headers: {
					"X-RapidAPI-Key":
						"8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954",
					"X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const videos = data.items.map((ele) => ({
			videoUrl: `https://www.youtube.com/watch?v=${ele.snippet.resourceId.videoId}&list=${ele.snippet.playlistId}`,
			title: ele.snippet.title,
			img: ele.snippet.thumbnails.default.url,
		}));

		res.send(videos);
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

export const addChannel = catchAsync(async (req, res) => {
	try {
		const link = req.body.url;
		const ind = link.indexOf("list=");
		const playListId = link.slice(ind + 5);

		const params = new URLSearchParams({
			playlistId: playListId,
			part: "snippet",
		});

		const response = await fetch(
			`https://youtube-v31.p.rapidapi.com/playlistItems?${params}`,
			{
				method: "GET",
				headers: {
					"X-RapidAPI-Key":
						"8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954",
					"X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const channelId = data.items[0].snippet.channelId;
		const channelTitle = data.items[0].snippet.channelTitle;
		const channelExist = await Youtube.findOne({ userId: req.user._id });

		if (!channelExist) {
			const addChannel = new Youtube({ userId: req.user._id });
			await addChannel.save();
		}

		const channel = await Youtube.findOneAndUpdate(
			{ userId: req.user._id },
			{ $addToSet: { youtubeId: { _id: channelId, name: channelTitle } } },
			{ new: true }
		);
		res.status(200).send(channel);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export const getMyChannels = catchAsync(async (req, res) => {
	try {
		const channels = await Youtube.findOne({ userId: req.user._id });
		res.status(200).send(channels);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export const deleteChannel = catchAsync(async (req, res) => {
	try {
		const channel = await Youtube.findOneAndUpdate(
			{ userId: req.user._id },
			{ $pull: { youtubeId: { _id: req.params.id } } },
			{ new: true }
		);
		res.status(200).send(channel);
	} catch (error) {
		res.status(500).send(error.message);
	}
});
