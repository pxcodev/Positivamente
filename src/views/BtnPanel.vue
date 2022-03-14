<template>
  <div>
    <v-tooltip left v-if="DataUser">
      <template v-slot:activator="{ on }">
        <v-btn dark large bottom right fab fixed color="green accent-3" v-on="on" to="/panel">
          <v-icon>$barspro</v-icon>
        </v-btn>
      </template>
      <span>Panel de control</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: ["myMessage", "tiempo", "showAlert"],
  data() {
    return {
      DataUser: JSON.parse(localStorage.getItem("DataUser")) || false
    };
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>