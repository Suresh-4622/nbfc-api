import { Router } from "express";

const router = Router();

import {
  createBranch,
  deleteBranch,
  getAllBranch,
  getBranch,
  updateBranch,
} from "../controllers/branchController.js";

router.route("/create").post(createBranch);
router.route("/all/list").get(getAllBranch);
router.route(":/id").get(getBranch).put(updateBranch).delete(deleteBranch);
export default router;
