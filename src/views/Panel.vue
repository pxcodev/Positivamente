<template>
  <div>
    <Drawer />
    <v-content>
      <AppBar />
      <v-container :fluid="true" color="red">
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </v-container>
    </v-content>
    <!-- <Chat /> -->
  </div>
</template>

<script>
import AppBar from "../components/Panel/AppBar.vue";
import Drawer from "../components/Panel/Drawer.vue";
import Chat from "../components/Panel/Chat.vue";
export default {
  data() {
    return {
      sheet: false,
    };
  },
  components: { AppBar, Drawer, Chat },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
