<template>
  <v-app>
    <Loader v-if="$store.state.loaderpp" />
    <router-view></router-view>
  </v-app>
</template>

<script>
import Loader from "@/components/Loader.vue";
export default {
  name: "App",
  components: { Loader },
  data: () => ({
    Tiempo: 30000,
    Sesion: false,
    DangerAlert: false,
    SuccesAlert: false,
  }),
  onIdle() {
    if (localStorage.getItem("DataUser")) {
      // this.DangerAlert = true;
      this.Sesion = false;
      this.Tiempo = 30000;
      this.$store.getters.Toast(30000).fire({
        icon: "warning",
        title:
          "¡Ey! Regresa" +
          "\n" +
          "Su sesión finalizará por inactividad en " +
          this.Tiempo / 1000 +
          " s",
      });
      let timerId = setInterval(() => {
        if (this.Sesion) {
          clearInterval(timerId);
        }
        this.Tiempo -= 1000;
        if (this.Tiempo < 0) {
          clearInterval(timerId);
          // Funcion para cerrar Sesion
          this.$store
            .dispatch("Logout", {
              correo: this.$store.state.DataUserStore.correo,
            })
            .then((resp) => {
              if (resp.cod >= 0) {
                this.$swal.fire(
                  "¡Oh no :(!",
                  "Sesión finalizada por Inactividad.",
                  "success"
                );
              } else {
                this.$swal.fire(
                  "Espera!",
                  "Ha ocurrido un error al cerrar sesión.",
                  "warning"
                );
              }
              this.$router.push(`/`);
            });
        }
      }, 1000);
    }
  },
  onActive() {
    if (localStorage.getItem("DataUser")) {
      this.Sesion = true;
      // this.DangerAlert = false;
      // this.SuccesAlert = true;
      this.$store.getters.Toast(3000).fire({
        icon: "success",
        title: "¡Genial! Bienvenido",
      });
    }
  },
  methods: {},
  mounted() {},
  created() {},
};
</script>
<style lang="scss">
@import "@/styles/index.scss";
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>
