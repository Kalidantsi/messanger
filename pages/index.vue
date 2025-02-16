<template>
    <div class="app">
      <Sidebar />
      <div class="content">
        <ChatList :chats="chats" @chat-selected="setSelectedChat" />
        <ChatWindow v-if="selectedChat" :chat="selectedChat"/>
        <Notification />
      </div>
    </div>
</template>
  
<script>
import Notification from '~/components/Notification.vue';
import { io } from 'socket.io-client';
console.log("git");
console.log('new branch')

  export default {
    name: "Chats",
    components: {
      Notification
    },
    data() {
      return {
        chats: [
          { id: 1, name: "I", messages: []},
          { id: 2, name: "Friend", messages: []},
        ],
        messages: [],
        selectedChat: null,
        username: 'Abunga',
        connect: false,
        socket: io('ws://localhost:3000')
      };
    },
    methods: {
      setSelectedChat(chat) {
        this.selectedChat = chat;
        this.loadMessages();
      },
      async loadMessages() {
       let {data} = await $fetch(`/api/messages/${this.username}?sender=${this.selectedChat.name}`)
       this.messages = data
    },
    },
  }
</script>
  
<style>
  .app {
    display: flex;
  }
  .content {
    flex: 1;
    display: flex;
  }
</style>