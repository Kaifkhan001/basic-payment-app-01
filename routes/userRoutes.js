import {Router} from 'express';
import { logoutUser, registerUser, signinUser, transferMoney, findUser } from '../controllers/User.controllers.js';
import userAuth from "../middlewares/userAuthentication.js";

const router = Router();

router.post("/signup",  registerUser);
router.post("/signin", signinUser);
router.get("/userAuth", userAuth);
router.post("/logout", logoutUser);
router.post("/transferMoney", transferMoney);
router.post("/findUser", findUser);

export default router;
