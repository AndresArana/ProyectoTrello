import mongoose from "mongoose";

const workBoardSchema = new mongoose.Schema({
    boardId: { type: mongoose.Schema.ObjectId, ref: "boards" },
    userId: { type: mongoose.Schema.ObjectId, ref: "users" },
    name: String,
    description: String,
    registerDate: { type: Date, default: Date.now },
});

const board = mongoose.model("workboards", workBoardSchema);
export default board;