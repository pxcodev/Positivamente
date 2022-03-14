<template>
  <div>
    <Header />
    <!-- <div style="margin-top:128px"></div> -->
    <div>
      <div
        class="et_pb_section et_pb_section_2 et_pb_fullwidth_section et_section_regular"
      >
        <div class="et_pb_module et_pb_fullwidth_image et_pb_fullwidth_image_0">
          <img
            src="@/assets/imagenes/divider2.png"
            alt
            title
            sizes="(max-width: 3000px) 100vw, 3000px"
          />
        </div>
      </div>
      <div
        class="et_pb_section et_pb_section_3 et_pb_with_background et_section_regular"
      >
        <v-container>
          <v-row>
            <v-col md="6">
              <div>
                <p class="font-weight-black display-2">Completa tu registro</p>
                <v-img src="@/assets/imagenes/te necesitamos.png"></v-img>
              </div>
            </v-col>
            <v-col md="6">
              <div>
                <template>
                  <v-card
                    class="mx-auto"
                    max-width="400"
                    outlined
                    style="padding: 40px;"
                  >
                    <form>
                      <v-text-field
                        v-model="email"
                        label="Correo"
                        disabled
                      ></v-text-field>
                      <v-text-field
                        color="principal"
                        v-capitalize
                        v-model="name"
                        :error-messages="nameErrors"
                        label="Nombres"
                        required
                        @input="$v.name.$touch()"
                        @blur="$v.name.$touch()"
                      ></v-text-field>
                      <v-text-field
                        color="principal"
                        v-capitalize
                        v-model="lastname"
                        :error-messages="lastnameErrors"
                        label="Apellidos"
                        required
                        @input="$v.lastname.$touch()"
                        @blur="$v.lastname.$touch()"
                      ></v-text-field>
                      <v-text-field
                        color="principal"
                        v-model="pass"
                        :error-messages="passErrors"
                        label="Contraseña"
                        required
                        type="password"
                        @input="$v.pass.$touch()"
                        @blur="$v.pass.$touch()"
                      ></v-text-field>
                      <v-text-field
                        color="principal"
                        v-model="confirmpass"
                        :error-messages="confirmpassErrors"
                        label="Confirme contraseña"
                        type="password"
                        required
                        @input="$v.confirmpass.$touch()"
                        @blur="$v.confirmpass.$touch()"
                      ></v-text-field>
                      <div class="text-center">
                        <v-btn
                          :loading="loader"
                          :disabled="loader"
                          large
                          v-on:click.prevent="enviar()"
                          class="ma-2"
                          outlined
                          color="success"
                          type="submit"
                        >
                          <v-icon left>$paper_plane</v-icon>
                          Registrar
                          <template v-slot:loader>
                            <span class="custom-loader">
                              <v-icon light>$sync</v-icon>
                            </span>
                          </template>
                        </v-btn>

                        <!-- <v-btn @click="enviar()" class="ma-2" tile outlined color="success">
                                                  <v-icon left>$paper_plane</v-icon>Registrar
                                                </v-btn>-->
                      </div>
                    </form>
                  </v-card>
                </template>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  email,
  sameAs,
} from "vuelidate/lib/validators";

export default {
  name: "registro",
  components: { Header, Footer },
  data: () => ({
    loader: false,
    email: "",
    name: "",
    lastname: "",
    pass: "",
    confirmpass: "",
    nivel: 0,
    token: null,
  }),
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    name: { required },
    lastname: { required },
    pass: { required, minLength: minLength(8) },
    confirmpass: { sameAsPassword: sameAs("pass") },
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;

      !this.$v.name.required && errors.push("Nombre es requerido.");
      return errors;
    },
    lastnameErrors() {
      const errors = [];
      if (!this.$v.lastname.$dirty) return errors;

      !this.$v.lastname.required && errors.push("Apellido es requerido.");
      return errors;
    },
    passErrors() {
      const errors = [];
      if (!this.$v.pass.$dirty) return errors;
      !this.$v.pass.minLength &&
        errors.push("Contraseña debe tener mas de 8 caracteres");
      !this.$v.pass.required && errors.push("Contraseña es requerida.");
      return errors;
    },
    confirmpassErrors() {
      const errors = [];
      if (!this.$v.confirmpass.$dirty) return errors;
      !this.$v.confirmpass.sameAsPassword &&
        errors.push("Contraseñas deben ser iguales");
      return errors;
    },
  },
  mounted() {
    this.token = this.$route.params.token;
    this.$store
      .dispatch("GeneralGet", { EndPoint: `/val-token/${this.token}` })
      .then((resp) => {
        if (resp.cod >= 0) {
          this.email = resp.datos.correo;
          this.nivel = resp.datos.nivel;
        } else {
          this.$router.push(`/error/${resp.msg}`);
        }
      });
  },
  methods: {
    enviar() {
      this.loader = true;
      this.$v.$touch();
      if (!this.$v.$error) {
        this.$store
          .dispatch("GeneralPost", {
            Datos: {
              correo: this.email,
              nombres: this.name,
              apellidos: this.lastname,
              pass: this.pass,
              nivel: this.nivel,
              token: this.token,
            },
            EndPoint: "/registro",
          })
          .then((resp) => {
            if (resp.cod >= 0) {
              let timerInterval;
              this.$swal
                .fire({
                  icon: "success",
                  title: "Exito",
                  html: "Ha sido registrado <b></b> sera redirigido al panel.",
                  timer: 2000,
                  timerProgressBar: true,
                  onBeforeOpen: () => {
                    this.$swal.showLoading();
                    timerInterval = setInterval(() => {
                      this.$swal
                        .getContent()
                        .querySelector(
                          "b"
                        ).textContent = this.$swal.getTimerLeft();
                    }, 100);
                  },
                  onClose: () => {
                    clearInterval(timerInterval);
                  },
                })
                .then((result) => {
                  if (result.dismiss === "timer") {
                    this.$store
                      .dispatch("GeneralPost", {
                        Datos: {
                          correo: this.email,
                          pass: this.pass,
                        },
                        EndPoint: "/login",
                      })
                      .then((resp) => {
                        if (resp.cod >= 0) {
                          this.$v.$reset();
                          this.email = "";
                          this.name = "";
                          this.lastname = "";
                          this.pass = "";
                          this.confirmpass = "";
                          this.loader = false;
                          localStorage.setItem(
                            "DataUser",
                            JSON.stringify(resp.datos.perfil)
                          );
                          localStorage.setItem(
                            "DataUserMed",
                            JSON.stringify(resp.datos.medico)
                          );
                          this.$router.push(`/panel`);
                        } else {
                        }
                      });
                  }
                });
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrio un error, vuelva a intentarlo",
              });
              this.loader = false;
            }
          });
      } else {
        this.loader = false;
      }
    },
  },
};
</script>

<style scoped></style>
