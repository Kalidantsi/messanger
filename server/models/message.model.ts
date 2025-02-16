import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    text: String,
    sender: String,
    receiver: String,
});

export const Message = model('messages', messageSchema);