<template>
    <div class="chat-window">
      <h3>{{ chat.name }}</h3>
      <div class="messages">
        <div v-for="message in chat.messages" :key="message.id">
          <strong>{{ message.sender }}:</strong> {{ message.text }}
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
    </div>
</template>
  
<script>
import { io } from 'socket.io-client';

  export default {
    name: "ChatWindow",
    props: {
      chat: Object,
    },
    data() {
      return {
        newMessage: "",
        socket: io('ws://localhost:3000'),
        connect: true,
        sender: 'You',
      };
    },
    methods: {
     sendMessage() {
        if (this.newMessage.trim() !== "") {
          this.chat.messages.push({
            id: Date.now(),
            sender: this.sender,
            text: this.newMessage,
          });
          this.newMessage = "";

          this.socket.emit('chat message', {
          text: this.newMessage,
          sender: this.sender,
          receiver: this.chat.name
        })
        }
        
      },
    },
  };
</script>
  
<style scoped>
  .chat-window {
    padding: 15px;
    height: calc(100vh - 60px);
  }
  .chat-window .messages {
    max-height: 300px;
    overflow-y: auto;
  }
  .chat-window input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    margin-top: 10px;
  }
</style>