import axios from "axios";
import Youtube from "./youtube.model.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";

export const getChannelPlaylists = errorHandler(async (req, res) => {
	try {
		const options = {
			method: "GET",
			url: "https://youtube-v31.p.rapidapi.com/playlists",
			params: {
				channelId: req.params.id,
				part: "snippet",
				maxResults: "50",
			},
			headers: {
				"X-RapidAPI-Key": "8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954",
				"X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
			},
		};
		const playList = [];
		const response = await axios.request(options);
		response.data.items.map((el) => {
			playList.push({
				id: el.id,
				title: el.snippet.title,
				img: el.snippet.thumbnails.default.url,
			});
		});
		res.send(playList);
	} catch (err) {
		res.send(err.message);
	}
});

export const getPlaylistItems = errorHandler(async (req, res) => {
	try {
		const options = {
			method: "GET",
			url: "https://youtube-v31.p.rapidapi.com/playlistItems",
			params: {
				playlistId: req.params.id,
				part: "snippet",
				maxResults: "50",
			},
			headers: {
				"X-RapidAPI-Key": "8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954",
				"X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
			},
		};
		const response = await axios.request(options);
		const videos = [];
		response.data.items.map((ele) => {
			videos.push({
				videoUrl: `https://www.youtube.com/watch?v=${ele.snippet.resourceId.videoId}&list=${ele.snippet.playlistId}`,
				title: ele.snippet.title,
				img: ele.snippet.thumbnails.default.url,
			});
		});
		res.send(videos);
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

export const addChannel = errorHandler(async (req, res) => {
	try {
		const link = req.body.url;
		const ind = link.indexOf("list=");
		const playListId = link.slice(ind + 5);
		const options = {
			method: "GET",
			url: "https://youtube-v31.p.rapidapi.com/playlistItems",
			params: {
				playlistId: playListId,
				part: "snippet",
			},
			headers: {
				"X-RapidAPI-Key": "8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954",
				"X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
			},
		};
		const response = await axios.request(options);
		const channelId = response.data.items[0].snippet.channelId;
		const channelTitle = response.data.items[0].snippet.channelTitle;
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

export const getMyChannels = errorHandler(async (req, res) => {
	try {
		const channels = await Youtube.findOne({ userId: req.user._id });
		res.status(200).send(channels);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export const deleteChannel = errorHandler(async (req, res) => {
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
