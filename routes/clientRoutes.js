import { Router } from "express";

const router = Router();

import {
  createClient,
  updateClient,
  getOneClient,
  getAllClient,
  deleteOneClient,
} from "../controllers/clientController.js";

router.route("/create").post(createClient);
router.route("/all/list").get(getAllClient);
router.route("/update").put(updateClient);
router.route("/get/one").get(getOneClient);
router.route("/delete/one").delete(deleteOneClient);
export default router;
