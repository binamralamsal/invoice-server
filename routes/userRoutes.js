import express from "express";
import {
  registerUser,
  authUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/:id").delete(protect, admin, deleteUser);

export default router;
