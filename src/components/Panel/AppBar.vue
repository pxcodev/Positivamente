<template>
  <v-toolbar>
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <v-btn class="mx-2" fab dark small color="principal" @click.stop="draw()">
      <v-icon v-text="drawer ? '$barspro' : '$menupts'"></v-icon>
    </v-btn>
    <v-toolbar-title>Panel de control</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- <v-badge icon :content="messages" :value="messages" color="green" overlap>
      <v-icon>$mail_solid</v-icon>
    </v-badge>-->

    <!-- <Mantenimiento v-if="$store.state.dialogmant" /> -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          :href="
            $store.state.DataUserStore.nivel == 1
              ? manuales[0]
              : $store.state.DataUserStore.nivel == 2
              ? manuales[1]
              : manuales[2]
          "
          target="_blank"
        >
          <v-icon>$pdf</v-icon>
        </v-btn>
      </template>
      <span>Manual de uso</span>
    </v-tooltip>
    <v-tooltip bottom v-if="$store.state.DataUserStore.nivel == 1">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="dialogBd = true">
          <v-icon>$rev</v-icon>
        </v-btn>
      </template>
      <span>Restaurar Base de Datos</span>
    </v-tooltip>
    <v-tooltip bottom v-if="$store.state.DataUserStore.nivel == 1">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="RespaldarBd">
          <v-icon>$db</v-icon>
        </v-btn>
      </template>
      <span>Respaldo Base de Datos</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="dialogPass = true">
          <v-icon>$shield</v-icon>
        </v-btn>
      </template>
      <span>Cambiar contraseña</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" to="/">
          <v-icon>$home</v-icon>
        </v-btn>
      </template>
      <span>Pagina principal</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <router-link to="/panel/perfil">
          <v-btn icon v-on="on">
            <v-icon>$user</v-icon>
          </v-btn>
        </router-link>
      </template>
      <span>Perfil</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="logout()">
          <v-icon>$logout</v-icon>
        </v-btn>
      </template>
      <span>Cerrar Sesión</span>
    </v-tooltip>
    <!-- Dialog seguridad -->
    <v-dialog v-model="dialogPass" persistent max-width="300px">
      <v-card>
        <v-icon
          v-on="on"
          class="float-right mr-2 mt-2"
          color="red"
          @click="close"
          >$cancel</v-icon
        >
        <v-card-title class="">
          <span class="headline text-center mx-auto">Seguridad</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  color="principal"
                  v-model="contras.contravieja"
                  label="Contraseña antigua"
                  type="password"
                  required
                  :error-messages="contraviejaErrors"
                  @input="$v.contras.contravieja.$touch()"
                  @blur="$v.contras.contravieja.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  color="principal"
                  v-model="contras.contranueva"
                  label="Nueva contraseña"
                  type="password"
                  required
                  :error-messages="contranuevaErrors"
                  @input="$v.contras.contranueva.$touch()"
                  @blur="$v.contras.contranueva.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  color="principal"
                  v-model="contras.confirmpassnueva"
                  label="Confirme nueva contraseña"
                  type="password"
                  required
                  :error-messages="confirmpassnuevaErrors"
                  @input="$v.contras.confirmpassnueva.$touch()"
                  @blur="$v.contras.confirmpassnueva.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="loader"
            :disabled="loader"
            large
            @click="CambiarPass"
            class="ma-2"
            outlined
            color="activo"
          >
            <v-icon left>$save</v-icon>Guardar
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>$sync</v-icon>
              </span>
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog mantenimiento -->
    <v-dialog v-model="dialogBd" persistent max-width="600px">
      <Loader v-if="$store.state.loaderpp" />
      <v-card>
        <v-icon
          v-on="on"
          class="float-right mr-2 mt-2"
          color="red"
          @click="close"
          >$cancel</v-icon
        >
        <v-card-title class="">
          <span class="headline text-center mx-auto">Mantenimiento</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="respaldos"
            sort-by="fecha"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Respaldos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                color="success"
                small
                class="mr-2"
                content="Restaurar"
                v-tippy
                @click="RestaurarBd(item)"
              >
                $rev
              </v-icon>
              <v-icon
                small
                color="cancelado"
                content="Eliminar"
                v-tippy
                class="mr-2"
                @click="EliminarRespaldoBd(item)"
              >
                $delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <h1>No hay respaldos</h1>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  sameAs,
} from "vuelidate/lib/validators";
import Mantenimiento from "@/components/Panel/Mantenimiento.vue";
import Loader from "@/components/Loader.vue";
export default {
  data: () => ({
    manuales: [
      process.env.VUE_APP_RUTA_API + "/manuales/Manualdeusuarioadmin.pdf",
      process.env.VUE_APP_RUTA_API +
        "/manuales/Manualdeusuariogestordecontenido.pdf",
      process.env.VUE_APP_RUTA_API + "/manuales/Manualdeusuariovoluntario.pdf",
    ],
    messages: 0,
    show: false,
    dialogPass: false,
    dialogBd: false,
    loader: false,
    contras: {
      contravieja: "",
      contranueva: "",
      confirmpassnueva: "",
    },
    contrasPred: {
      contravieja: "",
      contranueva: "",
      confirmpassnueva: "",
    },
    headers: [
      { text: "Fecha", value: "fecha" },
      { text: "Hora", value: "hora" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    respaldos: [],
  }),
  components: {
    Mantenimiento,
    Loader,
  },
  mixins: [validationMixin],
  validations: {
    contras: {
      contravieja: { required, minLength: minLength(8) },
      contranueva: { required, minLength: minLength(8) },
      confirmpassnueva: { sameAsPassword: sameAs("contranueva") },
    },
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapState(["drawer"]),
    contraviejaErrors() {
      const errors = [];
      if (!this.$v.contras.contravieja.$dirty) return errors;
      !this.$v.contras.contravieja.minLength &&
        errors.push("Contraseña antigua debe tener mas de 8 caracteres");
      !this.$v.contras.contravieja.required &&
        errors.push("Contraseña antigua es requerida.");
      return errors;
    },
    contranuevaErrors() {
      const errors = [];
      if (!this.$v.contras.contranueva.$dirty) return errors;
      !this.$v.contras.contranueva.minLength &&
        errors.push("Contraseña nueva debe tener más de 8 caracteres");
      !this.$v.contras.contranueva.required &&
        errors.push("Contraseña es requerida.");
      return errors;
    },
    confirmpassnuevaErrors() {
      const errors = [];
      if (!this.$v.contras.confirmpassnueva.$dirty) return errors;
      !this.$v.contras.confirmpassnueva.sameAsPassword &&
        errors.push(
          "Debe coincidir con la nueva contraseña, deben ser iguales"
        );
      return errors;
    },
  },
  methods: {
    ...mapMutations(["drawerState"]),
    draw() {
      this.drawerState();
    },
    logout() {
      this.$swal
        .fire({
          title: "¡Atencion!",
          text: "¿Estas seguro de cerrar sesión?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si",
        })
        .then((result) => {
          if (result.value) {
            var cor = this.$store.state.DataUserStore.correo;
            this.$store
              .dispatch("GeneralGet", { EndPoint: `/logout/${cor}` })
              .then((resp) => {
                if (resp.cod >= 0) {
                  localStorage.clear();
                  this.$swal.fire("¡Bien!", "Sesión finalizada.", "success");
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
        });
    },
    CambiarPass() {
      this.$v.contras.$touch();
      this.loader = true;
      if (!this.$v.contras.$error) {
        this.$store
          .dispatch("GeneralPost", {
            Datos: {
              contras: this.contras,
              correo: this.$store.state.DataUserStore.correo,
            },
            EndPoint: "/CambiarPass",
          })
          .then((resp) => {
            this.loader = false;
            if (resp.cod >= 0) {
              this.$swal.fire({
                icon: "success",
                title: "¡Woohoo!",
                text: "La contraseña ha sido cambiada exitosamente",
              });
              this.$v.$reset();
              this.close();
            } else if (resp.cod == -1) {
              this.$swal.fire({
                icon: "error",
                title: "Contraseñas no coinciden",
                text:
                  "La contraseña anterior que ingresaste no coincide con la registrada",
              });
            }
          })
          .catch((error) => {});
      } else {
        this.loader = false;
      }
    },
    close() {
      this.dialogPass = false;
      this.loader = false;
      this.contras = Object.assign({}, this.contrasPred);
      this.dialogBd = false;
    },
    initialize() {
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/respaldos" })
        .then((resp) => {
          this.respaldos = resp.datos;
        })
        .catch((error) => {});
    },
    EliminarRespaldoBd(item) {
      this.$swal
        .fire({
          title: "Estas seguro de esto?",
          text: "No podras revertir!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, borralo ya!",
        })
        .then((result) => {
          if (result.value) {
            this.$store.state.loaderpp = true;
            this.$store
              .dispatch("GeneralGet", {
                EndPoint: `/EliminarRespaldo/${item.nombre}`,
              })
              .then((resp) => {
                setTimeout((a) => {
                  this.$store.state.loaderpp = false;
                  if (resp.cod >= 0) {
                    this.$swal.fire(
                      "Borrado!",
                      "El respaldo ha sido borrado.",
                      "success"
                    );
                    const index = this.respaldos.indexOf(item);
                    this.respaldos.splice(index, 1);
                  } else {
                    this.$swal.fire(
                      "¡Oh no!",
                      "Ha ocurrido un error, intentelo nuevamente",
                      "error"
                    );
                  }
                }, 3000);
              })
              .catch((error) => {
                this.$store.state.loaderpp = false;
              });
          }
        });
    },
    RestaurarBd(item) {
      console.log(item.nombre);
      this.$swal
        .fire({
          title: "Estas seguro de esto?",
          text: "No podras revertir!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, restauralo ya!",
        })
        .then((result) => {
          if (result.value) {
            this.$store.state.loaderpp = true;
            this.$store
              .dispatch("GeneralGet", {
                EndPoint: `/restaurar/${item.nombre}`,
              })
              .then((resp) => {
                setTimeout((a) => {
                  this.$store.state.loaderpp = false;
                  if (resp.cod >= 0) {
                    this.$swal.fire(
                      "Genial!",
                      "Ha sido restaurada la base de datos.",
                      "success"
                    );
                  } else {
                    this.$swal.fire(
                      "¡Oh no!",
                      "Ha ocurrido un error, intentelo nuevamente",
                      "error"
                    );
                  }
                }, 3000);
              })
              .catch((error) => {
                this.$store.state.loaderpp = false;
              });
          }
        });
    },
    RespaldarBd() {
      this.$store.state.loaderpp = true;
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/respaldar" })
        .then((resp) => {
          if (resp.cod >= 0) {
            setTimeout((a) => {
              this.$store.state.loaderpp = false;
              this.$swal.fire({
                icon: "success",
                title: "¡Woohoo!",
                text: "Se ha realizado el respaldo exitosamente",
              });
              this.respaldos.push(resp.datos.archivo);
            }, 3000);
          } else {
            this.$store.state.loaderpp = false;
            this.$swal.fire({
              icon: "error",
              title: "¡Oh no!",
              text:
                "Ha ocurrido un error al realizar el respaldo, intentelo nuevamente",
            });
          }
        })
        .catch((error) => {
          this.$store.state.loaderpp = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
