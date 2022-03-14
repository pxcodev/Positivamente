<template>
  <div>
    <Header />
    <div
      class="et_pb_section et_pb_section_3 et_pb_with_background et_section_regular"
      style="padding: 130px 0px 0px 0px;"
    >
      <v-container>
        <v-row>
          <v-col>
            <v-container>
              <div class="dark white--text">
                <p class="display-3 text-center font-weight-bold">
                  {{ this.noticia.titulo }}
                </p>
              </div>
            </v-container>
          </v-col>
        </v-row>
        <v-row class>
          <v-col cols="3">
            <div class="author-avatar">
              <a href="#">
                <v-img
                  width="80"
                  height="80"
                  :src="
                    this.noticia.img_autor ? this.noticia.img_autor : img_pred
                  "
                  class="avatar avatar-80 photo avatar-default"
                ></v-img>
              </a>
              <svg class="half-circle" width="80px" height="80px">
                <use xlink:href="#half-circle" />
              </svg>
            </div>
          </v-col>
          <v-col cols="3" class="my-auto">
            <div class="author-name-area text-left">
              <div class="author-name-prefix">Autor</div>
              <a class="author-name" href="#">{{ this.noticia.autor }}</a>
            </div>
          </v-col>
          <v-col cols="3" class="my-auto">
            <div class="created text-left">
              <div class="created-prefix">Publicado</div>
              <div class style="color: white;">
                {{ $store.getters.FechaFormateada(this.noticia.fecha) }}
              </div>
            </div>
          </v-col>
          <v-col cols="4"></v-col>
        </v-row>
      </v-container>
    </div>
    <div
      class="et_pb_section et_pb_section_2 et_pb_fullwidth_section et_section_regular"
    >
      <div class="et_pb_module et_pb_fullwidth_image et_pb_fullwidth_image_0">
        <v-img src="@/assets/imagenes/divider1.png"></v-img>
      </div>
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" class="centrar">
          <img :src="this.noticia.img_principal" alt="" />
        </v-col>
      </v-row>
      <br />
      <v-container>
        <div class="container">
          <p class="text-justify title" v-html="this.noticia.contenido"></p>
        </div>
      </v-container>
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
  name: "Noticia",
  components: { Footer, Header, BtnPanel },
  data() {
    return {
      noticia: [],
      isActive: false,
      img_pred: require("@/assets/imagenes/perfil.png"),
    };
  },
  created() {
    let IdNoticia = this.$route.params.id;
    this.$store
      .dispatch("GeneralGet", { EndPoint: `/noticia/${IdNoticia}` })
      .then((resp) => {
        this.noticia = resp;
        console.log(this.noticia);
      });
  },
};
</script>

<style lang="scss" scoped>
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  border-radius: 16px;
  border: 5px solid #31456a;
}
.author-avatar {
  grid-area: avatar;
  align-self: start;
  position: relative;
}
.author-avatar .v-image {
  border-radius: 50%;
  width: 100px;
  height: 90px !important;
  display: block;
  overflow: hidden;
  margin: 16px 10px;
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
.author-avatar .half-circle {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 56px;
  fill: none;
  stroke: red;
  stroke-width: 8;
  stroke-linecap: round;
  pointer-events: none;
}
.author-name-prefix,
.comments-prefix,
.created-prefix,
.updated-prefix {
  color: #7a7a8c;
}
.author-name,
.comments-link {
  font-weight: 500;
}
a {
  text-decoration: none;
  color: white;
}
</style>
