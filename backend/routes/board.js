import express from "express";
import board from "../controllers/board.js";
import auth from "../middlewares/auth.js";
import validId from "../middlewares/validId.js";
import formatFile from "../middlewares/formatFile.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
const router = express.Router();

router.get("/listTask", auth, board.listTask);
router.get("/listTaskByIdW/:_id", auth, board.listBoardByIdWork);
router.post("/saveTask", mult, formatFile, auth, board.saveTask);
router.post("/saveTaskWork/:_id", mult, auth, board.saveTaskWork);
router.put("/updateTask", auth, board.updateTask);
router.delete("/deleteTask/:_id", auth, validId, board.deleteTask);
router.put("/editTask", auth, board.editTask);

export default router;