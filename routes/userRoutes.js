import { Router } from "express";

const router = Router();

import {
    login,
    userRegistration,
} from "../controllers/userController.js";

router.route("/register").post(userRegistration)
router.route("/login").post(login);

export default router;
