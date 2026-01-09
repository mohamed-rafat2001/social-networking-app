import express from "express";
import * as youtubeController from "./youtube.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/channelPlaylists/:id", youtubeController.getChannelPlaylists);
router.get("/playlistItems/:id", youtubeController.getPlaylistItems);
router.post("/addChannel", youtubeController.addChannel);
router.get("/myChannels", youtubeController.getMyChannels);
router.delete("/deleteChannel/:id", youtubeController.deleteChannel);

export default router;
