import express from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  editCustomer,
  deleteUser,
} from "../controllers/customerController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getCustomers)
  .post(protect, admin, createCustomer)
  .delete(protect, admin, deleteUser);
router
  .route("/:id")
  .get(protect, admin, getCustomer)
  .put(protect, admin, editCustomer);
// router.post("/login", authUser);
// router.route("/:id").delete(protect, admin, deleteUser);

export default router;
