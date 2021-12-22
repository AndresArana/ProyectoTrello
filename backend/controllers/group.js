import group from "../models/group.js";
import user from "../models/user.js";
import workBoard from "../models/workBoard.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import moment from "moment";
import transporter from "../middlewares/mailer.js";

const listGroup = async(req, res) => {
    const groupList = await group.find({ userId: req.user._id }).populate("workBoardId").exec();

    console.log({ groupList });

    return groupList.length === 0 ?
        res.status(400).send({ message: "You have no assigned group" }) :
        res.status(200).send({ groupList });
};

const sendInvitation = async(req, res) => {

    const workId = await workBoard.findById({ _id: req.params["_id"] });
    if (!workId)
        return res.status(400).send({ message: "Work board not found" });

    if (!req.body.email)
        return res.status(400).send({ message: "Incomplete data" });

    const searchUser = await user.findOne({ email: req.body.email });
    if (!searchUser)
        return res.status(400).send({ message: "email does not exist" });

    try {
        const token = jwt.sign({
                _id: searchUser._id,
                name: searchUser.name,
                roleId: searchUser.roleId,
                iat: moment().unix(),
            },
            process.env.SK_JWT, {
                expiresIn: "10m",
            }
        );
        let verificationLink = "http://localhost:4200/aceptedInvitation/" + searchUser.email + "/" + workId._id;
        const info = await transporter.sendMail({
            from: '"Debbel" <joya1028@gmail.com>',
            to: searchUser.email,
            subject: "Invitation work board",
            html: `
      <p>Hello ${searchUser.name} </p>
      <p>${req.body.name} wants to invite you to join his work board: ${workId.name}</p>
      <p>Please enter on the follow link to join</p>
      <br>
      <a href="${verificationLink}">${verificationLink}</a>
      `,
        });
        return !info ?
            res.status(400).send({ message: "error sending mail" }) :
            res.status(200).send({ message: "email sent", token });
    } catch (e) {
        return res.status(400).send({ message: "Token error " + e });
    }
};

const aceptInvitation = async(req, res) => {

    const userId = await user.findOne({ email: req.params["email"] });
    if (!userId)
        return res.status(400).send({ message: "User not found" });

    const workList = await workBoard.findById({ _id: req.params["_id"] });

    if (!workList)
        return res.status(400).send({ message: "Work board not found" });


    console.log({ workList });

    const groupSchema = new group({
        workBoardId: workList._id,
        userId: userId._id,
    });

    const result = await groupSchema.save();
    return !result ?
        res.status(400).send({ message: "Error registering work board" }) :
        res.status(200).send({ result });
};


export default {
    sendInvitation,
    aceptInvitation,
    listGroup,
};