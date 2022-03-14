<template>
  <div>
    <Header />
    <div
      class="et_pb_section et_pb_section_0 et_pb_with_background et_section_regular"
    >
      <v-container style="margin-top: 20px;">
        <v-row>
          <v-col cols="12" md="6" class="centrarv">
            <div class="light text-center">
              <p class="display-2">{{ proyecto.titulo_p }}</p>
              <p class="title font-weight-light">
                Un proyecto más de Positivamente
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-img
              class="nosotrosimg img"
              :src="proyecto.img_principal"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container>
      <div class="container">
        <p class="text-justify title" v-html="proyecto.descripcion_p"></p>
      </div>
    </v-container>
    <v-parallax height="300" src="@/assets/imagenes/parallax.png">
      <v-row align="center" justify="center">
        <v-col color="principal" class="text-center" cols="12">
          <h1 style="color: #515455;" class="display-2 font-weight-thin mb-4">
            Proyecto Positivamente
          </h1>
          <h4 style="color: #0096b1;" class="display-1 font-weight-black">
            Jornadas
          </h4>
        </v-col>
      </v-row>
    </v-parallax>
    <div class="text-center">
      <div v-for="jor in VisiblesJornadas" :key="jor">
        <v-container>
          <h2 class="display-1">{{ jor.titulo }}</h2>
          <h3 class="title">{{ jor.extracto }}...</h3>
          <h3>{{ $store.getters.FechaFormateada(jor.fecha) }}</h3>
          <v-img
            :src="require('../assets/ilustraciones/noimage.svg')"
            alt=""
            v-if="!jor.imag[0].src"
            width="350"
            class="centrar"
          ></v-img>
          <lingallery
            v-if="jor.imag[0].src"
            :addons="{ enableLargeView: true }"
            :width="width"
            :height="height"
            :iid.sync="currentId"
            :items="jor.imag"
          />
        </v-container>
      </div>
      <v-pagination
        v-model="pagina"
        :length="Math.ceil(jornadas.length / porPagina)"
      ></v-pagination>
    </div>
    <Footer />
    <BtnPanel />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import BtnPanel from "@/views/BtnPanel.vue";
import Lingallery from "lingallery";

export default {
  data() {
    return {
      IdProyecto: 0,
      proyecto: [],
      jornadas: [],
      pagina: 1,
      porPagina: 1,
      width: 600,
      height: 400,
      currentId: null,
    };
  },
  computed: {
    VisiblesJornadas() {
      $(document).ready(function () {
        $(".lingallery").addClass("centrar");
      });
      return this.jornadas.slice(
        (this.pagina - 1) * this.porPagina,
        this.pagina * this.porPagina
      );
    },
  },
  name: "Proyecto",
  components: { Header, Footer, BtnPanel, Lingallery },
  created() {
    this.IdProyecto = this.$route.params.id;
    this.$store
      .dispatch("GeneralGet", { EndPoint: `/proyecto/${this.IdProyecto}` })
      .then((resp) => {
        this.proyecto = resp;
      });
    this.$store
      .dispatch("GeneralGet", { EndPoint: `/jornadas/${this.IdProyecto}` })
      .then((resp) => {
        var aux = resp;
        for (let i = 0; i < resp.length; i++) {
          aux[i].imag = [];
          for (let j = 0; j < aux[i].imagenes.split(",").length; j++) {
            aux[i].imag.push({
              src: aux[i].imagenes.split(",")[j],
              thumbnail: aux[i].imagenes.split(",")[j],
              caption: "",
            });
          }
        }
        this.jornadas = aux;
      });
  },
  methods: {
    test() {
      console.log("object");
    },
  },
};
</script>

<style lang="scss" scoped>
.img {
  max-width: 100%;
  border-radius: 16px;
  border: 5px solid #31456a;
}
.container .lingallery {
  display: block !important;
  margin: auto !important;
}
div.et_pb_section.et_pb_section_0 {
  background-position: bottom center;
  background-image: url("../assets/imagenes/img02.png");
}
.et_pb_all_tabs,
.et_pb_column,
.et_pb_counters .et_pb_counter_container,
.et_pb_module,
.et_pb_portfolio_item,
.et_pb_posts_nav a,
.et_pb_pricing_table,
.et_pb_row,
.et_pb_row_inner,
.et_pb_slide,
.et_pb_tab,
.et_pb_with_background {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.et_pb_section_0.et_pb_section {
  padding-top: 100px;
  padding-right: 0px;
  padding-bottom: 100px;
  padding-left: 0px;
}
@media only screen and (min-width: 1350px) {
  .et_pb_section {
    padding: 54px 0;
  }
}

@media (min-width: 981px) {
  .et_pb_section {
    padding: 4% 0;
  }
}
.et_pb_section {
  position: relative;
  background-color: #fff;
}
.et_pb_section,
.et_pb_slider .et_pb_slide {
  background-position: center;
  -webkit-background-size: 100%;
  -webkit-background-size: cover;
  -moz-background-size: 100%;
  -moz-background-size: cover;
  background-size: 100%;
  background-size: cover;
}
</style>
