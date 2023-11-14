import { Router } from "express";

const router = Router();

import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
} from "../controllers/productController.js";

router.route("/create").post(createProduct);
router.route("/all/list").get(getAllProduct);
router.route("/update").put(updateProduct);
router.route("/get/one").get(getOneProduct);
router.route("/delete/one").delete(deleteProduct);

export default router;
