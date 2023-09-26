import { Router } from "express";

const router = Router();

import {
  createClient,
  updateClient,
  getClientDetail,
  getAllClientDetails,
  deleteClientDetails,
} from "../controllers/clientController.js";

router.route("/create").post(createClient);
router.route("/all/list").get(getAllClientDetails);
router.route(":/id").get(getClientDetail).put(updateClient).delete(deleteClientDetails);
export default router;
