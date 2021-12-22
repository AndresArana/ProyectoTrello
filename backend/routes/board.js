import express from "express";
import board from "../controllers/board.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/validId.js";
import formatFile from "../middlewares/formatFile.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
const router = express.Router();

router.post("/saveTaskImg/:_id", mult, formatFile, auth, board.saveTaskImg); // FUNCIONA CON EL ID
router.post("/saveTaskWork/:_id", auth, board.saveTaskWork);
router.get("/listTask", auth, board.listTask);
router.get("/listTaskByIdW/:_id", auth, board.listBoardByIdWork);
router.put("/updateTask", auth, board.updateTask);
router.put("/editTaskImg", auth, mult, formatFile, board.editTaskImg);
router.delete("/deleteTask/:_id", auth, validId, board.deleteTask);
router.get("/findTask/:_id", auth, board.findTask);


export default router;