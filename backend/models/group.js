import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    workBoardId: { type: mongoose.Schema.ObjectId, ref: "workboards" },
    userId: { type: mongoose.Schema.ObjectId, ref: "users" },
    registerDate: { type: Date, default: Date.now },
});

const group = mongoose.model("groups", groupSchema);
export default group;