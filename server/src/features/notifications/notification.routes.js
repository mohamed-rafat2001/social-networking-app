import express from "express";
import * as notificationController from "./notification.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", notificationController.getNotifications);
router.patch("/mark-all-read", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

export { router as notificationRouter };
