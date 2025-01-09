import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
