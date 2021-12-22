import express from "express";
import group from "../controllers/group.js";
import auth from "../middlewares/auth.js";
import validId from "../middlewares/validId.js";
import formatFile from "../middlewares/formatFile.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
const router = express.Router();

router.post("/invitation/:_id", auth, group.sendInvitation);
router.post("/aceptInv/:email/:_id", group.aceptInvitation);
router.get("/listGroup", auth, group.listGroup);

export default router;