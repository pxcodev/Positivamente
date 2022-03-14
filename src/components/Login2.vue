<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-on="on" v-bind="attrs" rounded dark color="principal">
          <v-icon left>$user</v-icon>Ingresar
        </v-btn>
      </template>
      <v-card class="card">
        <!-- <v-toolbar dark color="primary">
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog = false">
              <v-icon>$close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar> -->
        <v-btn
          color="red"
          icon
          light
          @click="
            () => {
              dialog = false;
              show = false;
              clear();
            }
          "
          style="float: right;"
        >
          <v-icon>$close</v-icon>
        </v-btn>
        <!-- <img class="wave" :src="require('../assets/ilustraciones/wave.png')" /> -->
        <v-container fluid="true">
          <transition name="slide-fade">
            <div class="login" v-if="!show">
              <div class="img">
                <img
                  :src="require('../assets/ilustraciones/authentication2.svg')"
                />
              </div>
              <div class="login-content">
                <form v-on:submit.prevent="submit()">
                  <img
                    :src="require('../assets/ilustraciones/helping_hands.svg')"
                  />
                  <h2 class="title">Bienvenido</h2>
                  <v-text-field
                    color="principal"
                    prepend-icon="$user"
                    v-model="login.email"
                    :error-messages="emailErrors"
                    label="Correo"
                    required
                    @input="$v.login.email.$touch()"
                    @blur="$v.login.email.$touch()"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="$lock"
                    color="principal"
                    v-model="login.pass"
                    :error-messages="passErrors"
                    label="Contraseña"
                    type="password"
                    required
                    @input="$v.login.pass.$touch()"
                    @blur="$v.login.pass.$touch()"
                  ></v-text-field>
                  <a @click="show = !show">¿Se te olvidó tu contraseña?</a>
                  <div class="text-center">
                    <v-btn
                      x-large
                      :loading="loader"
                      :disabled="loader"
                      type="submit"
                      v-on:click.prevent="submit()"
                      class="ma-2 btn"
                      outlined
                      color="white"
                    >
                      Ingresar
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon style="color: white !important;" dark
                            >$sync</v-icon
                          >
                        </span>
                      </template>
                    </v-btn>
                  </div>
                </form>
              </div>
            </div>
          </transition>

          <transition name="slide-fade">
            <div class="recovery" v-if="show">
              <div class="img">
                <img
                  :src="require('../assets/ilustraciones/security_ban.svg')"
                />
              </div>
              <div class="login-content">
                <form v-on:submit.prevent="recuperar()">
                  <img :src="require('../assets/ilustraciones/security.svg')" />
                  <h2 class="title">Recuperación de contraseña</h2>
                  <v-text-field
                    color="principal"
                    prepend-icon="$user"
                    v-model="recu.correo"
                    :error-messages="correorecErrors"
                    label="Correo"
                    required
                    @input="$v.recu.correo.$touch()"
                    @blur="$v.recu.correo.$touch()"
                  ></v-text-field>
                  <a @click="show = !show">Iniciar sesión</a>
                  <div class="text-center">
                    <v-btn
                      x-large
                      :loading="loader"
                      :disabled="loader"
                      type="submit"
                      v-on:click.prevent="recuperar()"
                      class="ma-2 btn"
                      outlined
                      color="white"
                    >
                      Recuperar
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon style="color: white !important;" dark
                            >$sync</v-icon
                          >
                        </span>
                      </template>
                    </v-btn>
                  </div>
                </form>
              </div>
            </div>
          </transition>
        </v-container>
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
  components: {},
  data: () => ({
    show: false,
    login: {
      pass: "",
      email: "",
    },
    recu: {
      correo: "",
    },
    dialog: false,
    loader: false,
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
              if (
                resp.datos.perfil.estado == "Deshabilitado" ||
                resp.datos.perfil.status == "Deshabilitado"
              ) {
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
      console.log("object");
      this.$v.recu.$touch();
      this.loader = true;
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
              this.loader = false;
              this.dialogrec = false;
              this.dialog = true;
            } else if (resp.cod >= -1) {
              this.$swal.fire({
                icon: "error",
                title: "¡Oh no!",
                text: "Correo ingresado no se encuentra registrado",
              });
              this.loader = false;
            } else if (resp.cod >= -5) {
              this.$swal.fire({
                icon: "error",
                title: "¡Oh no!",
                text: "Correo no enviado, intentelo nuevamente",
              });
              this.loader = false;
            }
          });
      } else {
        this.loader = false;
      }
    },
    clear() {
      this.$v.$reset();
      this.login.pass = "";
      this.login.email = "";
      this.recu.correo = "";
      this.dialog = false;
    },
  },
  created() {
    this.$v.$reset();
    this.pass = "";
    this.email = "";
  },
};
</script>

<style lang="scss" scoped>
// import fonts from foofle fonts
@import url("https://fonts.googleapis.com/css2?family=Lobster&family=Montserrat:wght@100&display=swap");

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.card {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background-image: url("../assets/ilustraciones/wave.png");
  background-color: #fff;
  height: 400px;
  background-size: 40% 100%;
}

.card {
  font-family: "Poppins", sans-serif;
  overflow: hidden;
}

.wave {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: 1;
}

.login,
.recovery {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 7rem;
  padding: 0 2rem;
}
.login .img,
.login .login-content,
.recovery .img,
.recovery .login-content {
  z-index: 1;
}
.img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.login-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
}

.img img {
  width: 500px;
}

form {
  width: 360px;
}

.login-content img {
  height: 150px;
}

.login-content h2 {
  margin: 15px 0;
  color: #333;
  text-transform: uppercase;
  font-size: 2.9rem;
}

.login-content .input-div {
  position: relative;
  display: grid;
  grid-template-columns: 7% 93%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #d9d9d9;
}

.login-content .input-div.one {
  margin-top: 0;
}

.i {
  color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.i i {
  transition: 0.3s;
}

.input-div > div {
  position: relative;
  height: 45px;
}

.input-div > div > h5 {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
  transition: 0.3s;
}

.input-div:before,
.input-div:after {
  content: "";
  position: absolute;
  bottom: -2px;
  width: 0%;
  height: 2px;
  background-color: #38d39f;
  transition: 0.4s;
}

.input-div:before {
  right: 50%;
}

.input-div:after {
  left: 50%;
}

.input-div.focus:before,
.input-div.focus:after {
  width: 50%;
}

.input-div.focus > div > h5 {
  top: -5px;
  font-size: 15px;
}

.input-div.focus > .i > i {
  color: #2697b0;
}

.input-div > div > input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: none;
  padding: 0.5rem 0.7rem;
  font-size: 1.2rem;
  color: #555;
  font-family: "poppins", sans-serif;
}

.input-div.pass {
  margin-bottom: 4px;
}

a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}

a:hover {
  color: #2697b0;
}

.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #2697b0, #38d39f, #2697b0);
  background-size: 200%;
  font-size: 1.2rem;
  color: #fff;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  margin: 1rem 0;
  cursor: pointer;
  transition: 0.5s;
}
.btn:hover {
  background-position: right;
}

@media screen and (max-width: 1050px) {
  .container {
    grid-gap: 5rem;
  }
}

@media screen and (max-width: 1000px) {
  form {
    width: 290px;
  }

  .login-content h2 {
    font-size: 2.4rem;
    margin: 8px 0;
  }

  .img img {
    width: 400px;
  }
}

@media screen and (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }

  .img {
    display: none;
  }

  .wave {
    display: none;
  }

  .login-content {
    justify-content: center;
  }
  .login,
  .recovery {
    grid-template-columns: none;
  }
}
</style>
