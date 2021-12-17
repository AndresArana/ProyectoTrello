import express from "express";
import user from "../controllers/user.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/validId.js";
const router = express.Router();

router.post("/registerUser", user.registerUser);
router.post("/registerAdminUser", auth, admin, user.registerAdminUser);
router.post("/login", user.login);
router.get("/listUsers/:name?", auth, admin, user.listAllUser);
router.get("/getRole/:email", auth, user.getUserRole);
router.get("/findUser/:_id", auth, validId, admin, user.findUser);
router.put("/updateUser", auth, admin, user.updateUser);
router.put("/forgotPassword",auth, user.forgotPassword);
router.post("/sendPassword", user.sendPassword);
router.delete("/deleteUser/:_id", auth,validId , admin, user.deleteUser);
router.get("/findUserPass/:_id", auth, validId, user.findUserPass);

export default router;
