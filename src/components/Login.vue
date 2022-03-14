<template>
  <v-row justify="center">
    <!-- Modal login -->
    <v-dialog v-model="dialog" persistent max-width="400px">
      <template v-slot:activator="{ on }">
        <div class="text-center">
          <v-btn v-on="on" rounded dark color="principal">
            <v-icon left>far fa-user</v-icon>Ingresar
          </v-btn>
        </div>
      </template>
      <v-card>
        <v-icon class="float-right mr-2 mt-2" color="red" @click="clear"
          >$cancel</v-icon
        >
        <v-card-title>
          <v-row>
            <v-col cols="12">
              <v-img
                class="mx-auto"
                src="@/assets/imagenes/logo.png"
                width="200"
              ></v-img>
            </v-col>
            <v-col cols="12">
              <p class="headline text-center">Iniciar sesión</p>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <template>
              <form v-on:submit.prevent="submit()">
                <v-text-field
                  color="principal"
                  v-model="login.email"
                  :error-messages="emailErrors"
                  label="Correo"
                  required
                  @input="$v.login.email.$touch()"
                  @blur="$v.login.email.$touch()"
                ></v-text-field>
                <v-text-field
                  color="principal"
                  v-model="login.pass"
                  :error-messages="passErrors"
                  label="Contraseña"
                  type="password"
                  required
                  @input="$v.login.pass.$touch()"
                  @blur="$v.login.pass.$touch()"
                ></v-text-field>
                <div class="caption">
                  <a
                    href=""
                    color="principal"
                    @click.prevent="
                      dialog = false;
                      dialogrec = true;
                    "
                    >Recuperar contraseña</a
                  >
                </div>
                <div class="text-center">
                  <v-btn
                    :loading="loader"
                    :disabled="loader"
                    type="submit"
                    v-on:click.prevent="submit()"
                    class="ma-2"
                    tile
                    outlined
                    color="success"
                  >
                    Ingresar
                    <v-icon>far fa-paper-plane</v-icon>
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon light>$sync</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </div>
              </form>
            </template>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Modal recuperacion -->
    <v-dialog v-model="dialogrec" persistent max-width="400px">
      <template> </template>
      <v-card>
        <v-icon
          class="float-right mr-2 mt-2"
          color="red"
          @click="closerecuperacion"
          >$cancel</v-icon
        >
        <v-card-title>
          <v-row>
            <v-col cols="12">
              <v-img
                class="mx-auto"
                src="@/assets/imagenes/securidadpp.png"
                width="200"
              ></v-img>
            </v-col>
            <v-col cols="12">
              <p class="headline text-center">Recuperación</p>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <template>
              <form v-on:submit.prevent="recuperar()">
                <v-text-field
                  color="principal"
                  v-model="recu.correo"
                  :error-messages="correorecErrors"
                  label="Correo"
                  required
                  @input="$v.recu.correo.$touch()"
                  @blur="$v.recu.correo.$touch()"
                ></v-text-field>

                <div class="text-center">
                  <v-btn
                    :loading="loaderrec"
                    :disabled="loaderrec"
                    type="submit"
                    v-on:click.prevent="recuperar()"
                    class="ma-2"
                    tile
                    outlined
                    color="success"
                  >
                    Recuperar
                    <v-icon>$shield</v-icon>
                    <template v-slot:loaderrec>
                      <span class="custom-loader">
                        <v-icon light>$sync</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </div>
              </form>
            </template>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
const jwt = require("jwt-simple");
const moment = require("moment");
export default {
  data: () => ({
    login: {
      pass: "",
      email: "",
    },
    recu: {
      correo: "",
    },
    dialog: false,
    dialogrec: false,
    loader: false,
    loaderrec: false,
  }),
  mixins: [validationMixin],
  validations: {
    login: {
      pass: { required },
      email: { required, email },
    },
    recu: {
      correo: { required, email },
    },
  },
  computed: {
    passErrors() {
      const errors = [];
      if (!this.$v.login.pass.$dirty) return errors;
      !this.$v.login.pass.required && errors.push("Contraseña es requerida.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.login.email.$dirty) return errors;
      !this.$v.login.email.email && errors.push("Escribe un correo valido");
      !this.$v.login.email.required && errors.push("Correo es requerido");
      return errors;
    },
    correorecErrors() {
      const errors = [];
      if (!this.$v.recu.correo.$dirty) return errors;
      !this.$v.recu.correo.email && errors.push("Escribe un correo valido");
      !this.$v.recu.correo.required && errors.push("Correo es requerido");
      return errors;
    },
  },

  methods: {
    submit() {
      this.loader = true;
      this.$v.login.$touch();
      if (!this.$v.login.$error) {
        this.$store
          .dispatch("GeneralPost", {
            Datos: {
              correo: this.login.email.toLowerCase(),
              pass: this.login.pass,
            },
            EndPoint: "/login",
          })
          .then((resp) => {
            console.log(resp);
            if (resp.cod >= 0) {
              if (resp.datos.perfil.status == "Deshabilitado") {
                this.$store.getters.Toast(3000).fire({
                  icon: "warning",
                  title:
                    "¡Disculpe! Actualmente usted se encuentra deshabilitado",
                });
                this.loader = false;
              } else {
                localStorage.setItem(
                  "DataUser",
                  JSON.stringify(resp.datos.perfil)
                );
                localStorage.setItem(
                  "DataUserMed",
                  JSON.stringify(resp.datos.medico)
                );
                this.WelcomeAlert = true;
                this.$router.push(`/panel`);
                this.$store.getters.Toast(3000).fire({
                  icon: "success",
                  title: "¡Genial! Bienvenido a Positivamente",
                });
                this.loader = false;
              }
            } else {
              switch (resp.cod) {
                case -1:
                  this.$swal.fire({
                    icon: "error",
                    title: "Contraseña incorrecta",
                    text: "Verifique su contraseña e intentelo nuevamente",
                  });
                  this.loader = false;
                  break;
                case -2:
                  this.$swal.fire({
                    icon: "error",
                    title: "Correo no valido",
                    text: "Verifique su correo e intentelo nuevamente",
                  });
                  this.loader = false;
                  break;
              }
            }
          });
      } else {
        this.loader = false;
      }
    },
    recuperar() {
      this.$v.recu.$touch();
      this.loaderrec = true;
      if (!this.$v.recu.$error) {
        this.$store
          .dispatch("GeneralPost", {
            Datos: { correo: this.recu.correo },
            EndPoint: "solrecuperar",
          })
          .then((resp) => {
            console.log(resp);
            if (resp.cod >= 0) {
              this.$swal.fire({
                icon: "success",
                title: "Correo enviado",
                text: "Por favor revise su correo",
              });
              this.loaderrec = false;
              this.dialogrec = false;
              this.dialog = true;
            } else if (resp.cod >= -1) {
              this.$swal.fire({
                icon: "error",
                title: "¡Oh no!",
                text: "Correo ingresado no se encuentra registrado",
              });
              this.loaderrec = false;
            } else if (resp.cod >= -5) {
              this.$swal.fire({
                icon: "error",
                title: "¡Oh no!",
                text: "Correo no enviado, intentelo nuevamente",
              });
              this.loaderrec = false;
            }
          });
      } else {
        this.loaderrec = false;
      }
    },
    clear() {
      this.$v.$reset();
      this.login.pass = "";
      this.login.email = "";
      this.dialog = false;
    },
    closerecuperacion() {
      this.dialogrec = false;
      this.dialog = true;
    },
  },
  created() {
    this.$v.$reset();
    this.pass = "";
    this.email = "";
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
