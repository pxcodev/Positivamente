<template>
  <div>
    <Header />
    <div
      class="et_pb_section et_pb_section_3 et_pb_with_background et_section_regular"
      style="padding: 130px 0px 0px 0px;"
    >
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="centrarv">
            <div class="light text-center white--text">
              <p class="display-2">Noticias Positivamente</p>
              <p class="title font-weight-light">
                En esta sección podras encontrar noticias relevantes sobre la
                asociación de ayuda humanitaria
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-img src="@/assets/imagenes/finance.png"></v-img>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div
      class="et_pb_section et_pb_section_2 et_pb_fullwidth_section et_section_regular"
    >
      <div class="et_pb_module et_pb_fullwidth_image et_pb_fullwidth_image_0">
        <img
          src="@/assets/imagenes/divider1.png"
          alt
          title
          sizes="(max-width: 3000px) 100vw, 3000px"
        />
      </div>
    </div>
    <v-container>
      <v-row no-gutters>
        <v-col
          v-for="(noticia, index) in noticias"
          :key="index"
          lg="4"
          md="6"
          sm="6"
          xs="12"
        >
          <v-card class="mt-10 white--text mx-10" color="terceario">
            <v-img
              class="white--text align-end"
              height="200px"
              :src="noticia.img_principal"
              gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
            >
              <v-card-title class="font-weight-bold">{{
                noticia.titulo
              }}</v-card-title>
            </v-img>

            <v-card-subtitle class="pb-0 white--text">
              {{ noticia.fecha }}
            </v-card-subtitle>

            <v-card-text class="white--text">
              <div>{{ noticia.extracto }}...</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="orange" text :to="`/noticia/${noticia.id}`"
                >Mas Info</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
    <BtnPanel />
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import BtnPanel from "@/views/BtnPanel.vue";
export default {
  name: "Noticias",
  components: { Footer, Header, BtnPanel },
  data() {
    return {
      noticias: [],
      isActive: false,
    };
  },
  created() {
    this.ObtenerNoticias();
  },
  methods: {
    ObtenerNoticias() {
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/noticias" })
        .then((resp) => {
          resp.forEach((element) => {
            element.estado ? this.noticias.push(element) : null;
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border-radius: 20px;
}
</style>
