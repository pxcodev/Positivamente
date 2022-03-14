<template>
  <v-overlay :value="true" :light="false" :opacity="0.2">
    <div class="hello load">
      <object data="" type="">
        <embed :src="svg" type="" />
      </object>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: "HelloWorld",
  data: () => ({
    svg: require("./../assets/logosvg.svg"),
  }),
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.load object embed {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  animation-iteration-count: infinite;
}
</style>
