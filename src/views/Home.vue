<template>
  <div>
    <div>
      <Header />
      <v-carousel
        cycle
        height="100vh"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(item, i) in items"
          :key="i"
          :src="item.src"
        ></v-carousel-item>
      </v-carousel>
      <Baners />

      <v-container>
        <p
          data-aos="zoom-in"
          data-aos-easing="linear"
          data-aos-duration="1500"
          data-aos-offset="300"
          class="text-center display-1 pt-5 pb-5"
        >
          ¿Qué es exactamente Proyecto Positivamente?
        </p>

        <v-row v-for="(feature, i) in features" :key="feature.id">
          <v-col cols="12" md="6" :class="i % 2 ? 'order-1' : 'order-0'">
            <v-img
              :data-aos="i % 2 ? 'fade-left' : 'fade-right'"
              data-aos-easing="linear"
              data-aos-duration="1500"
              data-aos-offset="300"
              :src="feature.img"
              lazy-src="https://picsum.photos/id/11/10/6"
              width="450"
              class="mx-auto"
            ></v-img>
          </v-col>
          <v-col
            cols="12"
            md="6"
            :class="i % 2 ? 'order-0' : 'order-1'"
            class="d-flex align-content-center flex-wrap"
          >
            <div
              :data-aos="i % 2 ? 'fade-right' : 'fade-left'"
              data-aos-easing="linear"
              data-aos-duration="1500"
              data-aos-offset="300"
            >
              <div style="padding: 0px 0px;">
                <p class="text-center display-1">{{ feature.titulo }}</p>
                <v-divider color="black" inset></v-divider>
                <p class="title justify-start mt-10">{{ feature.contenido }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <Solicitar />
      <BtnPanel />

      <Footer />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Vue from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Baners from "@/components/Baners.vue";
import Solicitar from "@/components/Solicitar.vue";
import BtnPanel from "@/views/BtnPanel.vue";
export default {
  data() {
    return {
      loader: true,
      items: [
        {
          src: require("@/assets/imagenes/slide/slide1.png"),
        },
        {
          src: require("@/assets/imagenes/slide/slide2.png"),
        },
      ],
      features: [
        {
          img: require("@/assets/imagenes/Features/esperanza.png"),
          titulo: "Familia venezolana con esperanza y disposición",
          contenido: `Creemos que la Venezuela que todos queremos es posible dejando a un lado las diferencias y trabajando unidos, como la gran familia que
            siempre hemos sido.`,
        },
        {
          img: require("@/assets/imagenes/Features/ayuda.png"),
          titulo: "Ayudar es nuestra meta principal",
          contenido: `Ayudar a las personas, brindar apoyo, cooperar con los demas, son actos buenos que mejoran la calidad de vida en general, pero mas allá de ser una buena acción, estas gestiones benefician directa e inmediatamente a la persona que los realiza.`,
        },
      ],
    };
  },
  components: {
    Header,
    Baners,
    Solicitar,
    BtnPanel,
    Footer,
  },
  methods: {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
[v-cloak]::before {
  .load {
    display: none;
  }
}
</style>
