<template>
  <v-container fluid>
    <div class="text-center">
      <v-bottom-sheet origin v-model="sheet" inset>
        <template v-slot:activator="{ on }">
          <v-btn color="principal" dark large bottom right fab v-on="on" fixed>
            <v-icon>$comments</v-icon>
          </v-btn>
        </template>
        <v-sheet class="text-center" height="500px">
          <!-- <h1>ChatRooms</h1>
        <p class="username">Username: {{username}}</p>
          <p class="online">Online:{{ users.length}}</p>-->
          <!-- <v-btn
          class="mt-6"
          text
          color="error"
          @click="sheet = !sheet"
          >close</v-btn>-->
          <ChatRoom v-bind:messages="messages" v-on:sendMessage="this.sendMessage" />
        </v-sheet>
      </v-bottom-sheet>
    </div>
  </v-container>
</template>

<script>
import io from "socket.io-client";
import ChatRoom from "@/components/Panel/ChatRoom";
export default {
  data() {
    return {
      fab: false,
      sheet: false,
      username: "",
      socket: io(process.env.VUE_APP_RUTA_API),
      messages: [],
      users: []
    };
  },
  components: {
    ChatRoom
  },
  methods: {
    joinServer: function() {
      this.socket.on("LoggedIn", data => {
        this.messages = data.messages;
        this.users = data.users;
        this.socket.emit("newuser", this.username);
      });
      this.listen();
    },
    listen: function() {
      this.socket.on("userOnline", user => {
        this.users.push(user);
      });
      this.socket.on("userLeft", user => {
        this.users.splice(this.users.indexOf(user), 1);
      });
      this.socket.on("msg", message => {
        this.messages.push(message);
      });
    },
    sendMessage: function(message) {
      this.socket.emit("msg", message);
    }
  },
  mounted: function() {
    // this.username = prompt("Cual es tu usuario", "Anonimo");
    if (!this.username) {
      this.username = "Anonimo";
    }
    this.joinServer();
  },
  computed: {}
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
</style>