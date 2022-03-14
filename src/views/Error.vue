<template>
  <div class="err">
    <Header />
    <v-container>
      <v-row style="margin-top: 100px;">
        <v-col cols="12">
          <v-lazy
            v-model="isActive"
            :options="{
              threshold: 0.5,
            }"
            transition="slide-x-transition"
          >
            <v-container fill-height>
              <v-row>
                <v-col cols="12">
                  <div
                    class="dark white--text mx-auto"
                    align-center
                    style="width: 400px;"
                  >
                    <!-- <object type="image/svg+xml" :data="this.img"></object> -->
                    <img
                      :src="this.img"
                      alt=""
                      aspect-ratio="1.7"
                      width="100%"
                    />
                  </div>
                </v-col>
                <v-col cols="12">
                  <div
                    class="dark white--text mx-auto text-center"
                    align-center
                  >
                    <p class="display-1 text-center font-weight-black">
                      Ooops! {{ error }}
                    </p>
                    <p class="display-1 text-center font-weight-black">
                      Lo sentimos
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-lazy>
        </v-col>
        <!-- <v-col cols="12" md="6" class="centrarv">
            <v-lazy
              v-model="isActive"
              :options="{
                threshold: 0.5
              }"
              transition="slide-x-reverse-transition"
            >
              <div class="dark white--text my-auto text-center" align-center>
                <p class="display-3 text-center font-weight-black">
                  Ooops! {{ error }}
                </p>
                <p class="display-1 text-center font-weight-black">
                  Lo sentimos
                </p>
              </div>
            </v-lazy>
          </v-col> -->
      </v-row>
    </v-container>
    <Footer />
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
export default {
  data() {
    return {
      isActive: false,
      error: null,
      cod: null,
      img: null,
    };
  },
  components: { Footer, Header },
  mounted() {
    this.error = this.$route.params.err;
    this.img = require(`@/assets/imagenes/Errores/${this.error}.svg`);
    // @/assets/imagenes/mantenimiento.png
  },
};
</script>

<style lang="scss" scoped>
.err {
  background: rgba(147, 206, 222, 1);
  background: -moz-linear-gradient(
    left,
    rgba(147, 206, 222, 1) 0%,
    rgba(117, 189, 209, 1) 41%,
    rgba(73, 165, 191, 1) 100%
  );
  background: -webkit-gradient(
    left top,
    right top,
    color-stop(0%, rgba(147, 206, 222, 1)),
    color-stop(41%, rgba(117, 189, 209, 1)),
    color-stop(100%, rgba(73, 165, 191, 1))
  );
  background: -webkit-linear-gradient(
    left,
    rgba(147, 206, 222, 1) 0%,
    rgba(117, 189, 209, 1) 41%,
    rgba(73, 165, 191, 1) 100%
  );
  background: -o-linear-gradient(
    left,
    rgba(147, 206, 222, 1) 0%,
    rgba(117, 189, 209, 1) 41%,
    rgba(73, 165, 191, 1) 100%
  );
  background: -ms-linear-gradient(
    left,
    rgba(147, 206, 222, 1) 0%,
    rgba(117, 189, 209, 1) 41%,
    rgba(73, 165, 191, 1) 100%
  );
  background: linear-gradient(
    to right,
    rgba(147, 206, 222, 1) 0%,
    rgba(117, 189, 209, 1) 41%,
    rgba(73, 165, 191, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#93cede', endColorstr='#49a5bf', GradientType=1 );
}
</style>
