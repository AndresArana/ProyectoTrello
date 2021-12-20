import board from "../models/board.js";
import workBoard from "../models/workBoard.js";
import fs from "fs";
import path from "path";
import moment from "moment";

const saveTaskImg = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Incomplete data" });

  const workFind = await workBoard.findById({ _id: req.params["_id"] });
  if (!workFind) res.status(400).send({ message: "work not found" });

  let imageUrl = "";
  if (Object.keys(req.files).length === 0) {
    imageUrl = "";
  } else {
    if (req.files.image) {
      if (req.files.image.type != null) {
        const url = req.protocol + "://" + req.get("host") + "/";
        const serverImg =
          "./uploads/" + moment().unix() + path.extname(req.files.image.path);
        fs.createReadStream(req.files.image.path).pipe(
          fs.createWriteStream(serverImg)
        );
        imageUrl =
          url +
          "uploads/" +
          moment().unix() +
          path.extname(req.files.image.path);
      }
    }
  }

  const boardSchema = new board({
    workBoardId: workFind._id,
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
    taskStatus: "to-do",
    imageUrl: imageUrl,
  });

  const result = await boardSchema.save();
  if (!result)
    return res.status(400).send({ message: "Error registering task" });
  return res.status(200).send({ result });
};

const listTask = async (req, res) => {
  const taskList = await board.find({ userId: req.user._id });
  return taskList.length === 0
    ? res.status(400).send({ message: "You have no assigned tasks" })
    : res.status(200).send({ taskList });
};

const listBoardByIdWork = async (req, res) => {
  const boardList = await board.find({
    workBoardId: req.params["_id"],
  });

  return boardList.length === 0
    ? res.status(400).send({ message: "You no have work board assigned" })
    : res.status(200).send({ boardList });
};

const updateTask = async (req, res) => {
  if (!req.body._id || !req.body.taskStatus)
    return res.status(400).send({ message: "Incomplete data" });

  const taskUpdate = await board.findByIdAndUpdate(req.body._id, {
    taskStatus: req.body.taskStatus,
  });

  return !taskUpdate
    ? res.status(400).send({ message: "Task not found" })
    : res.status(200).send({ message: "Task updated" });
};

const deleteTask = async (req, res) => {
  let taskImg = await board.findById({ _id: req.params["_id"] });

  taskImg = taskImg.imageUrl;
  taskImg = taskImg.split("/")[4];
  let serverImg = "./uploads/" + taskImg;

  const taskDelete = await board.findByIdAndDelete({ _id: req.params["_id"] });
  if (!taskDelete) return res.status(400).send({ message: "Task not found" });

  try {
    if (taskImg) fs.unlinkSync(serverImg);
    return res.status(200).send({ message: "Task deleted" });
  } catch (e) {
    console.log("Image no found in server");
  }

  // const taskDelete = await board.findByIdAndDelete({ _id: req.params["_id"] });
  // return !taskDelete ?
  //     res.status(400).send({ message: "Task no found" }) :
  //     res.status(200).send({ message: "Task deleted" });
};

const editTask = async (req, res) => {
  if (
    !req.body._id ||
    (!req.body.name && !req.body.description && !req.body.imageUrl)
  )
    return res.status(400).send({ message: "Incomplete data" });

  let imageUrl = "";
  if (Object.keys(req.files).length === 0) {
    imageUrl = "";
  } else {
    if (req.files.image) {
      if (req.files.image.type != null) {
        const url = req.protocol + "://" + req.get("host") + "/";
        const serverImg =
          "./uploads/" + moment().unix() + path.extname(req.files.image.path);
        fs.createReadStream(req.files.image.path).pipe(
          fs.createWriteStream(serverImg)
        );
        imageUrl =
          url +
          "uploads/" +
          moment().unix() +
          path.extname(req.files.image.path);
      }
    }
  }

  const taskEdit = await board.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    imageUrl: imageUrl,
  });

  return !taskEdit
    ? res.status(400).send({ message: "Task not found" })
    : res.status(200).send({ message: "edited task" });
};

const saveTaskWork = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Incomplete data" });

  const workFind = await workBoard.findById({ _id: req.params["_id"] });
  if (!workFind) res.status(400).send({ message: "work not found" });

  const boardSchema = new board({
    workBoardId: workFind._id,
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
    taskStatus: "to-do",
    imageUrl: "",
  });

  const result = await boardSchema.save();
  if (!result)
    return res.status(400).send({ message: "Error registering task" });
  return res.status(200).send({ result });
};

export default {
  saveTaskImg,
  listTask,
  updateTask,
  deleteTask,
  editTask,
  listBoardByIdWork,
  saveTaskWork,
};
