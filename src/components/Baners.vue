<template>
  <div class="full-width index-banner js-promotion-banner" v-if="!DataUser">
    <div
      class="index-banner-home-bg clearfixed"
      :style="{
        'background-image': 'url(' + banersimg[0] + ')',
      }"
    >
      <div class="index-banner-item index-banner-home js-move-controler">
        <div class="index-banner-control home-control">
          <div class="summary home">
            <h2>Voluntario Nuevo</h2>
            <div class="des subtitle-1">
              Registrate como voluntario en Proyecto Positivamente.
              <br />Así tendrás la posibilidad de colaborar &amp; apoyarnos
            </div>
          </div>

          <ul
            class="index-banner-products home-products"
            style="display: none;"
          >
            <li v-for="vol in volnuevo" :key="vol.id" :class="vol.clase">
              <a class="js-product-control">{{ vol.opcion }}</a>
            </li>
          </ul>
          <div class="text-center">
            <v-btn
              @click="$vuetify.goTo('#solicitar', options)"
              rounded
              dark
              color="principal"
            >
              <v-icon left>fas fa-sign-in-alt</v-icon>Registrarse
            </v-btn>
          </div>
          <!-- <div class="text-center">
            <v-btn class="ma-2" tile rounded dark color="principal">
              <v-icon left>fad fa-sign-in</v-icon> Registrarse
            </v-btn>
          </div>-->
        </div>
        <div class="index-banner-show home-show">
          <div
            v-for="vol in volnuevo"
            :key="vol.id"
            :class="vol.clase"
            class="product-content"
            id="free"
          >
            {{ vol.contenido }}
          </div>
        </div>
      </div>
      <div
        class="index-banner-item index-banner-bus-bg js-move-controler"
        :style="{
          'background-image': 'url(' + banersimg[1] + ')',
        }"
      >
        <div class="index-banner-bus">
          <div class="index-banner-control bus-control">
            <div class="summary bus">
              <h2>Voluntario Registrado</h2>
              <div class="des subtitle-1">
                Si eres voluntario y estas registrado ¡Ingresa ya!.
                <br />No te pierdas de nuestras próximas actividades.
              </div>
            </div>
            <ul
              class="index-banner-products bus-products"
              style="display: none;"
            >
              <li v-for="vol in volregistrado" :key="vol.id" :class="vol.clase">
                <a class="js-product-control">{{ vol.opcion }}</a>
              </li>
            </ul>

            <Login2 />
          </div>
          <div class="index-banner-show bus-show">
            <div
              v-for="vol in volregistrado"
              :key="vol.id"
              :class="vol.clase"
              class="product-content"
              id="free"
            >
              {{ vol.contenido }}
            </div>
          </div>
        </div>
        <div class="boundary">
          <div class="line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Login2 from "@/components/Login2.vue";
import Vue from "vue";
export default {
  data() {
    return {
      DataUser: JSON.parse(localStorage.getItem("DataUser")) || false,
      banersimg: [
        require("@/assets/imagenes/baners/hero.jpg"),
        require("@/assets/imagenes/baners/voluntario.png"),
      ],
      volnuevo: [
        {
          opcion: "El voluntariado aumenta la confianza",
          contenido: `Hacer algo bueno por los demás te hará sentirte realizado y orgulloso de ti mismo, de esa manera será que tengas una visión más positiva de la vida y del futuro.`,
          clase: "active",
        },
        {
          opcion: "El voluntariado ayuda a mantenerse físicamente saludable",
          contenido: `Apoyar como voluntario es bueno para la salud a cualquier edad, pero es especialmente beneficioso en las personas mayores, porque los mantiene activo, entre otros muchos factores.`,
          clase: "",
        },
      ],
      volregistrado: [
        {
          opcion: "Visualizar jornadas",
          contenido: `Podrás visualizar jornadas recientes.`,
          clase: "active",
        },
        {
          opcion: "Participar en jornadas",
          contenido: `Podrás participar en jornadas recientes.`,
          clase: "",
        },
      ],
      duration: 900,
      offset: 0,
      easing: "easeInOutCubic",
    };
  },
  components: {
    Login,
    Login2,
  },
  mounted() {
    if ($(document).width()) {
    }
    $(function () {
      let width = $(document).width() || 0;
      if (width > 1023) {
        $(".js-move-controler").on("mouseover", function (event) {
          $(this)
            .addClass("openbanner")
            .removeClass("closebanner")
            .siblings(".js-move-controler")
            .addClass("closebanner")
            .removeClass("openbanner");
        });
        $(".js-move-controler")
          .parent()
          .on("mouseleave", function (event) {
            $(".js-move-controler").removeClass("openbanner closebanner");
          });

        $(".js-product-control").on("mouseover", function (event) {
          var index = $(this).parent().index();
          $(this)
            .parent()
            .addClass("active")
            .siblings("li")
            .removeClass("active");
          $(this)
            .parents(".js-move-controler")
            .find(".product-content")
            .eq(index)
            .addClass("active")
            .siblings(".product-content")
            .removeClass("active");
        });
      }
    });
  },
  computed: {
    target() {
      const value = this[this.type];
      if (!isNaN(value)) return Number(value);
      else return value;
    },
    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing,
      };
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.openbanner div .index-banner-control .index-banner-products,
.openbanner div .index-banner-products {
  display: block !important;
}
.openbanner div .index-banner-control .summary,
.openbanner div .summary {
  margin-bottom: 2.5em;
}
/* //Banner General */
ol,
ul {
  list-style: none;
}
.index-banner {
  height: 700px;
  font-size: 1.125rem;
  text-align: center;
  color: #fff !important;
  overflow: hidden;
}
.full-width {
  position: relative;
  width: 100%;
}
.index-banner-control .summary:before {
  position: absolute;
  display: block;
  content: "";
  width: 5rem;
  height: 2px;
  background-color: rgb(255, 255, 255);
  top: 50%;
  transition: all 0.3s;
}
::before,
::after {
  color: inherit;
}
*,
::before,
::after {
  background-repeat: no-repeat;
  box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.index-banner-control h2 {
  position: relative;
  text-transform: uppercase;
  padding-bottom: 1.5rem;
  transition: all 0.5s;
}
h2 {
  font-size: 2.25rem;
  margin-bottom: 2.5rem;
}
.index-banner-control .des {
  font-size: 1.125rem;
}
.index-banner-home-bg,
.index-banner-bus-bg {
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}
.index-banner-home,
.index-banner-bus {
  position: relative;
  height: 100%;
}
.index-banner-item {
  position: relative;
  width: 50%;
  float: left;
  transition: all 0.5s;
}
.index-banner-control {
  position: absolute;
  display: inline-block;
  z-index: 2;
  bottom: -2.5rem;
  transition: all 0.5s;
  transform: translate(0, 0);
}
.index-banner-control .summary {
  position: relative;
  margin-bottom: 200px;
  transition: all 0.5s;
}
/* // ICON next y after */
.index-banner-item .boundary:before,
.index-banner-item .boundary:after {
  position: absolute;
  display: block;
  top: 50%;
  left: 0;
  color: #bcbcbc;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
/* // @import "@/../node_modules/fortawesome/fontawesome/css/all.css"; */
.index-banner-item .boundary:before {
  content: "\f104";
  font-family: "Font Awesome 5 free";
  font-weight: 900;
  transform: translate(-20px, -50%);
}
.index-banner-item .boundary:after {
  content: "\f105";
  font-family: "Font Awesome 5 free";
  font-weight: 900;
  transform: translate(17px, -50%);
}
/* // fin

//opcional */
.index-banner-products {
  display: inline-block;
  opacity: 0;
  transition: all 0.5s;
}

.index-banner-products li {
  border-radius: 15px;
  border: 1px solid #fff;
  margin-bottom: 0.625rem;
  background: inherit;
}
.index-banner-products li.active a {
  color: #333;
}
.index-banner-products li.active {
  color: #333;
  background-color: #fff;
}
.index-banner-products li a {
  display: inline-block;
  width: 22.5rem;
  color: #fff;
  padding: 0.5rem 0rem;
  transition: all 0.3s;
}
/* //mostrar lista de productos */
.index-banner-show {
  position: absolute;
  width: 20.625rem;
  height: 20.625rem;
  text-align: left;
  color: #e2e2e2;
  border-radius: 50%;
  background: radial-gradient(
    rgba(255, 255, 255, 0),
    80%,
    rgba(255, 255, 255, 0.9)
  );
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s;
}
.index-banner-show .product-content.active {
  z-index: 1;
  opacity: 1;
}
.index-banner-show .product-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  opacity: 0;
  transition: all 0.3s;
}
.index-banner-item.openbanner .index-banner-show {
  transition-delay: 0.5s;
  opacity: 1;
}
.index-banner-item.openbanner .index-banner-products {
  opacity: 1;
}
/* //fin */
.index-banner-home,
.index-banner-bus {
  position: relative;
  height: 100%;
}
.openbanner {
  width: 70%;
}
.closebanner {
  width: 30%;
}
.index-banner-item.openbanner .index-banner-control .summary h2 {
  font-size: 1.5rem;
  margin-bottom: 0rem;
}
.index-banner-item.openbanner .index-banner-control .summary .des {
  font-size: 0.875rem;
}
.index-banner-item.closebanner .index-banner-control .summary h2 {
  font-size: 1.125rem;
}
.index-banner-item.closebanner .index-banner-control .summary .des {
  font-size: 0.625rem;
  line-height: 1rem;
}
/* //animacion barrita */
.index-banner-item.openbanner .home-control .summary:before {
  animation: changehomeline 0.5s alternate forwards;
}
@keyframes changehomeline {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  50% {
    transform: translateX(-100%) rotate(0deg);
  }
  100% {
    transform: translateX(-100%) rotate(90deg);
  }
}
.index-banner-item.openbanner .bus-control .summary:before {
  animation: changebusline 0.5s alternate forwards;
}
@keyframes changebusline {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  50% {
    transform: translateX(100%) rotate(0deg);
  }
  100% {
    transform: translateX(100%) rotate(90deg);
  }
}
.index-banner-item.openbanner .index-banner-control {
  top: 50%;
  transform: translateY(-50%);
}
/* //Banner HOME */
.index-banner-home-bg {
  background-position: center;
}
.index-banner-control.home-control .summary:before {
  left: 0;
}
.index-banner-control.home-control {
  right: 20%;
}
.index-banner-control.home-control .summary {
  text-align: left;
  /* padding-left: 2.5rem; */
}
.index-banner-show.home-show {
  right: 10%;
}
.index-banner-item.openbanner .home-control {
  right: 50%;
}
.index-banner-item.closebanner .home-control {
  right: 10%;
}
/* //Banner BUS */
.index-banner-bus-bg {
  background-position: 90%;
}
.index-banner-control.bus-control {
  left: 20%;
}
.index-banner-control.bus-control .summary {
  text-align: right;
  /* padding-right: 2.5rem; */
}
.index-banner-control.bus-control .summary:before {
  right: 0;
}
.index-banner-show.bus-show {
  left: 10%;
}
.index-banner-item.openbanner .bus-control {
  left: 50%;
}
.index-banner-item.closebanner .bus-control {
  left: 10%;
}
/* //adicional code banner */
.index-banner-item .boundary {
  position: absolute;
  width: 10px;
  height: 100%;
  line-height: 100%;
  top: 0;
  left: -5px;
  background-color: #9a9a9a;
}
.index-banner-item .boundary .line {
  position: relative;
  width: 100%;
  height: 100%;
}
.index-banner-item .boundary .line:before {
  transform: translate(-3px, -50%);
}
.index-banner-item .boundary .line:before,
.index-banner-item .boundary .line:after {
  position: absolute;
  display: block;
  content: "";
  width: 2px;
  height: 20px;
  top: 50%;
  left: 50%;
  background-color: #fff;
}
.index-banner-item .boundary .line:after {
  transform: translate(1px, -50%);
}
.inner-full-width:after,
.clearfixed:after {
  content: "";
  display: block;
  clear: both;
}

@media screen and (max-width: 1599px) {
  .index-banner-control.home-control {
    right: 10%;
  }
  .index-banner-control.bus-control {
    left: 10%;
  }
  .index-banner-control h2 {
    font-size: 1.625rem;
    padding-bottom: 1.5rem;
  }
  .index-banner-control .des {
    font-size: 1.125rem;
  }
  .index-banner-show {
    width: 17.5rem;
    height: 17.5rem;
  }
  .index-banner-item.closebanner .index-banner-control .summary h2 {
    font-size: 1.125rem;
  }
  .index-banner-item.closebanner .index-banner-control .summary .des {
    font-size: 0.625rem;
    line-height: 1rem;
  }
}
@media screen and (min-width: 1024px) and (max-width: 1366px) {
  .index-banner-control h2 {
    font-size: 1.375rem;
    padding-bottom: 1.5rem;
  }
  .index-banner-control .des {
    font-size: 0.875rem;
  }
  .index-banner-products li a {
    width: 17.5rem;
    font-size: 1rem;
  }
  .index-banner-item.openbanner .home-control {
    right: 45%;
  }
  .index-banner-item.openbanner .bus-control {
    left: 45%;
  }
  .index-banner-item.closebanner .home-control {
    right: 5%;
  }
  .index-banner-item.closebanner .bus-control {
    left: 5%;
  }
  .index-banner-show.home-show {
    right: 5%;
  }
  .index-banner-show.bus-show {
    left: 5%;
  }
}
@media screen and (max-width: 1023px) {
  .index-banner {
    height: auto;
  }
  .index-banner-item {
    width: 100%;
    float: none;
  }
  .index-banner-control {
    position: static;
    display: inline-block;
    margin: 3.75rem 0rem;
  }
  .index-banner-control h2 {
    text-align: center;
  }
  .index-banner-control .des {
    text-align: center;
  }
  .index-banner-control .summary:before {
    top: 45%;
    left: 50% !important;
    transform: translateX(-50%);
  }
  .index-banner-show {
    display: none;
  }
  .index-banner-item .boundary {
    display: none;
  }
  .index-banner-products {
    opacity: 1;
  }
  .index-banner-show {
    opacity: 1;
  }
}
</style>
