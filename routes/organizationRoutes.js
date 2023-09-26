import { Router } from "express";

const router = Router();

import {
  createOrganization,
  getAllOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organizationController.js";

router.route("/create").post(createOrganization);
router.route("/all/list").get(getAllOrganization);
router.route(":/id").get(getOrganization).put(updateOrganization).delete(deleteOrganization);
export default router;
