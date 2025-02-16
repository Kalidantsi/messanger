import type { NitroApp } from "nitropack/types";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { Message } from "~/server/models/message.model";
import mongoose from "mongoose";


export default defineNitroPlugin(async (nitroApp: NitroApp) => {
  //запускаем движок socketa
  const engine = new Engine();
  const io = new Server();
  
  try {
    await mongoose.connect("mongodb://localhost:27017/messanger");
  } catch (e) {
    console.error(e);
  }

  let clients =  new Map(); // коллекция ключ-значение

  io.bind(engine);

  io.on('connection', function (socket) { //socket.id = RFKrgRGCtT89M3AAAAB
    socket.on('logged_in', function(data) {
      clients.set(data.username, socket.id); // [[ivan, RFKrgRGCtT89M3AAAAB]]
      console.log(socket.id)
      console.log(clients)
    })

    socket.on('chat message', async function (data) {
      const message = new Message({
        text: data.text,
        receiver: data.receiver,
        sender: data.sender
      });
      await message.save();
      console.log(message)

      io.to(clients.get(data.receiver)).emit('chat message', { // RFKrgRGCtT89M3AAAAB
        text: data.text,
        receiver: data.receiver,
        sender: data.sender,
      });
    })
    socket.on('proverka', (data) => {
      console.log(data.log)
    })
  })

  

  nitroApp.router.use("/messages", defineEventHandler({
    async handler(event) {
      let result = [await Message.find({'sender': getRouterParam(event, 'username')})]
      result.push(await Message.find({'receiver': getRouterParam(event, 'username')}))
      return result
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq);
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
      }
    }
  }));
});