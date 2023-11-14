import { Router } from "express";

const router = Router();

import {
  createLoan,
  deleteLoan,
  getAllLoan,
  getOneLoan,
  updateLoan,
} from "../controllers/loanController.js";

router.route("/create").post(createLoan);
router.route("/all/list").get(getAllLoan);
router.route("/update").put(updateLoan);
router.route("/get/one").get(getOneLoan);
router.route("/delete/one").delete(deleteLoan);

export default router;
