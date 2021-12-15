import workBoard from "../models/workBoard.js";
import board from "../models/board.js";
import moment from "moment";

const saveWorkB = async(req, res) => {
    if (!req.body.name || !req.body.description)
        return res.status(400).send({ message: "Incomplete data" });

    const workBoardSchema = new workBoard({
        userId: req.user._id,
        name: req.body.name,
        description: req.body.description,
    });

    const result = await workBoardSchema.save();
    return !result ?
        res.status(400).send({ message: "Error registering work board" }) :
        res.status(200).send({ result });
};

const listWorkB = async(req, res) => {
    const workList = await workBoard.find({ userId: req.user._id });

    return workList.length === 0 ? res.status(400).send({ message: "You have no assigned works board" }) : res.status(200).send({ workList });
};

const updateWorkB = async(req, res) => {

    if (!req.body._id || !req.body.name || !req.body.description)
        return res.status(400).send({ message: "Incomplete data" });

    const workUpdate = await workBoard.findByIdAndUpdate(req.body._id, {
        name: req.body.name,
        description: req.body.description,
    });

    return !workUpdate ? res.status(400).send({ message: "Error editing work" }) : res.status(200).send({ message: "Work update" });
};

export default { saveWorkB, listWorkB, updateWorkB };