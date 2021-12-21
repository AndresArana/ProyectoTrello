import express from "express";
import workBoard from "../controllers/workBoard.js";
import auth from "../middlewares/auth.js";
import validId from "../middlewares/validId.js";
const router = express.Router();

router.get("/listWorkB", auth, workBoard.listWorkB);
router.post("/saveWorkB", auth, workBoard.saveWorkB);
router.put("/updateWorkB", auth, workBoard.updateWorkB);
router.delete("/deleteWorkB/:_id", auth, workBoard.deleteWorkB);
router.get("/findWork/:_id", auth, workBoard.findWork);

export default router;
