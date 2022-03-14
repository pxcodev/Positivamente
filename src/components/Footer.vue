<template>
  <v-footer dark padless>
    <v-card flat tile color="principal" class="white--text text-center" style="width:100%">
      <v-card-text>
        <v-btn
          class="mx-4 white--text"
          icon
          href="https://www.facebook.com/positivamenteac/"
          target="_blank"
        >
          <v-icon size="24px">$facebook</v-icon>
        </v-btn>
        <v-btn
          class="mx-4 white--text"
          icon
          href="https://twitter.com/positivamenteac"
          target="_blank"
        >
          <v-icon size="24px">$twitter</v-icon>
        </v-btn>
        <v-btn
          class="mx-4 white--text"
          icon
          href="https://www.instagram.com/positivamenteac/"
          target="_blank"
        >
          <v-icon size="24px">$instagram</v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text pt-0"></v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} —
        <strong>A.C. Proyecto Positivamente - R.I.F: J-40967984-9</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<style scoped></style>
