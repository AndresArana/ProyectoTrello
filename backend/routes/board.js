import express from "express";
import board from "../controllers/board.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/validId.js";
import formatFile from "../middlewares/formatFile.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
const router = express.Router();

router.get("/listTask", auth, board.listTask);
router.get("/findTask/:_id", auth, validId, board.findTask);
router.get("/listTaskByIdW/:_id", auth, board.listBoardByIdWork);
router.post("/saveTask", mult, formatFile, auth, board.saveTask);
router.put("/updateTask", auth, board.updateTask);
router.put("/editTask", mult, formatFile, auth, board.editTask);
router.delete("/deleteTask/:_id", auth, validId, board.deleteTask);


export default router;