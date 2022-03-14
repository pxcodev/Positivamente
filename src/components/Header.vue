<template>
  <div>
    <v-app-bar
      class="appbar"
      color="rgba(255, 255, 255, 0.8)"
      light
      shrink-on-scroll
      prominent
      fixed
      scroll-threshold="200"
    >
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="d-md-none navicon"
      ></v-app-bar-nav-icon>
      <v-toolbar-items class="d-md-none mx-auto my-auto">
        <v-btn @click.prevent="ir('/')" text>
          <img class="mt-auto mb-auto logo" :src="img" />
        </v-btn>
      </v-toolbar-items>

      <v-toolbar-items class="mx-auto my-auto d-none d-md-flex">
        <v-btn
          class="btnn"
          @click.prevent="ir(item.title)"
          v-for="(item, index) in items"
          :key="item.title"
          text
        >
          {{ item.title }}
          <img v-if="index == 3" class="mt-auto mb-auto logo" :src="img" />
        </v-btn>

        <v-menu transition="slide-y-reverse-transition">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text class="btnn">PROYECTOS</v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="proyecto in Proyectos"
              :key="proyecto.index"
              :to="'/proyecto/' + proyecto.id_p"
            >
              <v-list-item-title v-text="proyecto.titulo_p"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" fixed bottom temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <span v-for="item in items" :key="item.index">
            <v-list-item v-if="item.title">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title
                @click.prevent="ir(item.title)"
                style="text-transform: uppercase;"
                >{{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </span>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      drawer: false,
      group: null,
      img: require("../assets/imagenes/logo.png"),
      items: [
        { title: "inicio", icon: "$home" },
        { title: "voluntariado", icon: "$user" },
        { title: "nosotros", icon: "$users" },
        { title: null, icon: null },
        { title: "contacto", icon: "$phone" },
        { title: "noticias", icon: "$newpaper" },
      ],
      Proyectos: [],
    };
  },
  methods: {
    ir(route) {
      if (route == "inicio") {
        this.$router.push("/");
      } else {
        this.$router.push("/" + route);
      }
    },
  },
  created() {
    var ng = this;
    window.addEventListener("scroll", function () {
      let Y = window.scrollY;
      if (Y >= 100) {
        ng.img = require("@/assets/imagenes/logosolo.png");
      } else {
        ng.img = require("@/assets/imagenes/logo.png");
      }
      if (Y <= 200) {
        $(".logo").css("height", 100 - Y / 4);
        $(".appbar").css(
          "background-color",
          `rgba(${250 - (Y + 1)}, ${250 - (Y + 1)}, ${250 - (Y + 1)}, 0.5)`
        );
        $(".btnn").css("color", `black`);
        $(".navicon").css("color", "black");
      } else {
        $(".logo").css("height", 50);
        $(".btnn").css("color", `white`);
        $(".navicon").css("color", "white");
      }
    });
  },
  mounted() {
    this.$store
      .dispatch("GeneralGet", { EndPoint: "/proyectos" })
      .then((resp) => {
        this.Proyectos = resp;
      });
  },
  destroyed() {},
  computed: {},
  watch: {
    group() {
      this.drawer = false;
    },
  },
});
</script>

<style scoped>
.logo {
  height: 100px;
}
.v-application .deep-purple--text.text--accent-4 {
  color: #2697af !important;
  caret-color: #2697af !important;
}
</style>
