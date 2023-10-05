import { Router } from "express";

const router = Router();

import {
  createBranch,
  deleteBranch,
  getAllBranch,
  getOneBranch,
  updateBranch,
} from "../controllers/branchController.js";

router.route("/create").post(createBranch);
router.route("/all/list").get(getAllBranch);
router.route("/update").put(updateBranch);
router.route("/get/one").get(getOneBranch);
router.route("/delete/one").delete(deleteBranch);
export default router;
