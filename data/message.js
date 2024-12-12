import Message from '../models/Message.js';
import Room from '../models/Room.js';
import getCurrentTimeMillis from '../middlewares/dateHandler.js';

export async function addTextMessageToRoom(message, roomID) {
  const newMessage = new Message({
    type: message.type,
    content: message.content,
    sender: message.sender,
    time: getCurrentTimeMillis(),
  });

  await newMessage.save();
  await newMessage.populate({
    path: 'sender',
    select: '_id username',
  });

  await Room.findOneAndUpdate(
    { _id: roomID }, // Find room by ID
    { $push: { messages: newMessage._id } } // Add the new message ID to the messages array
  );

  return newMessage;
}
