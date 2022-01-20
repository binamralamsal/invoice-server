import express from "express";
import {
  getCustomer,
  createCustomer,
} from "../controllers/customerController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getCustomer)
  .post(protect, admin, createCustomer);
// router.post("/login", authUser);
// router.route("/:id").delete(protect, admin, deleteUser);

export default router;
