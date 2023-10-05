import { Router } from "express";

const router = Router();

import {
  createOrganization,
  getAllOrganization,
  getOneOrganization,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organizationController.js";

router.route("/create").post(createOrganization);
router.route("/all/list").get(getAllOrganization);
router.route("/update").put(updateOrganization);
router.route("/get/one").get(getOneOrganization);
router.route("/delete/one").delete(deleteOrganization);
export default router;
