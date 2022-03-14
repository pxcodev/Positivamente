<template>
  <div>
    <v-card class="elevation-12" color="principal lighten-4">
      <v-toolbar dark color="principal darken-1">
        <v-toolbar-title>Chat</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-list ref="chat" id="logs">
          <template>
            <!-- <div v-for="message in messages" v-bind:key="message.index">
         
                <div>{{message.username}}</div><br>
                <v-list-item-avatar>
                  <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                </v-list-item-avatar>
            {{message.msg}}-->

            <v-card class="mb-2" v-for="message in messages" v-bind:key="message.index">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div style="background-color:gray">
                  <v-card-title class="headline" v-text="message.username"></v-card-title>

                  <v-card-subtitle v-text="message.msg"></v-card-subtitle>
                </div>

                <v-avatar class="ma-3" size="50">
                  <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                </v-avatar>
              </div>
            </v-card>

            <!-- </div> -->
          </template>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <!-- <v-form @submit.prevent="submit">
              <v-text-field v-model="msg" label="Message" single-line solo-inverted></v-text-field>
              <v-btn fab dark small color="primary" type="submit">
                <v-icon dark>send</v-icon>
              </v-btn>
        </v-form>-->
        <v-flex md8 offset-md2 class="pt-1" @submit.prevent="sendMessage">
          <v-form style="width:100%; bottom:0">
            <v-row>
              <v-col cols="10">
                <v-text-field
                  label="Solo"
                  placeholder="Type Your Message"
                  solo
                  ref="message"
                  v-model="msg"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn small color="primary" v-on:click="sendMessage" v-bind:disabled="!msg">Send</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-flex>
      </v-card-actions>
    </v-card>

    <!-- <div class="messages">
          <div class="message" v-for="message in messages" v-bind:key="message.index">
            <div class="username">{{message.username}}</div>
            <div class="message-text">{{message.msg}}</div>
          </div>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: ""
    };
  },
  props: ["messages"],
  methods: {
    sendMessage: function() {
      if (!this.msg) {
        alert("please enter a message");
        return;
      }
      this.$emit("sendMessage", this.msg);
      this.msg = "";
    }
  }
};
</script>

<style lang="scss" scoped>
#logs {
  height: 300px;
  overflow: auto;
}
</style>