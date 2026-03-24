import { Router } from "express";
import {
	createEventDetails,
	getApprovedEventFilterOptionsForAdmin,
	getApprovedEventsForAdmin,
	getEventById,
	getMyEventsForFaculty,
	getReviewQueueForAdmin,
	reviewEventByAdmin,
} from "../controllers/eventDetailsController.js";
import { uploadEventDetails } from "../middleware/uploadEventDetails.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, uploadEventDetails, createEventDetails);
router.get(
	"/admin/approved",
	authenticateToken,
	requireRole(["admin"]),
	getApprovedEventsForAdmin
);
router.get(
	"/admin/approved/filter-options",
	authenticateToken,
	requireRole(["admin"]),
	getApprovedEventFilterOptionsForAdmin
);
router.get("/faculty/mine", authenticateToken, requireRole(["faculty"]), getMyEventsForFaculty);
router.get(
	"/admin/review-queue",
	authenticateToken,
	requireRole(["admin"]),
	getReviewQueueForAdmin
);
router.patch(
	"/admin/:eventId/review",
	authenticateToken,
	requireRole(["admin"]),
	reviewEventByAdmin
);
router.get("/:eventId", authenticateToken, requireRole(["admin", "faculty"]), getEventById);

export default router;
