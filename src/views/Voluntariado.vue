<template>
  <div>
    <Header />
    <div
      style="padding-bottom: 0px; padding-top: 50px;"
      class="et_pb_section et_pb_section_3 et_pb_with_background et_section_regular"
    >
      <v-container>
        <v-row class="align-items-center text-left">
          <v-col cols="12" sm="12" md="6" class="centrarv">
            <v-row>
              <v-col cols="12">
                <h1 class="display-1 font-weight-black" color="white">
                  Registrate
                </h1>
                <h2 style="color: white;" class="title">
                  Forma parte de Proyecto Positivamente
                </h2>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  color="principal"
                  v-model="email"
                  label="Correo"
                  required
                  :error-messages="emailErrors"
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                ></v-text-field
              ></v-col>
              <v-col cols="12" md="4"
                ><div class="text-center">
                  <v-btn
                    type="submit"
                    :loading="loader"
                    :disabled="loader"
                    large
                    v-on:click.prevent="enviar()"
                    class="ma-2"
                    outlined
                    color="white"
                  >
                    Enviar
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon light>$sync</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </div></v-col
              >
            </v-row>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <figure class="ie-non-standard-hero-shape">
              <svg
                class="injected-svg js-svg-injector"
                data-img-paths="[{&amp;quot;targetId&amp;quot;: &amp;quot;#imageShape1&amp;quot;, &amp;quot;newPath&amp;quot;: &amp;quot;/blk-design-system-pro-react/static/media/painter.1cc4a965.png&amp;quot;},{&amp;quot;targetId&amp;quot;: &amp;quot;#imageShape2&amp;quot;, &amp;quot;newPath&amp;quot;: &amp;quot;/blk-design-system-pro-react/static/media/painter.1cc4a965.png&amp;quot;}]"
                data-parent="#SVGNonStandardHeroShape"
                viewBox="10 12 878.9 907"
                x="0px"
                y="0px"
                xml:space="preserve"
              >
                <g>
                  <defs>
                    <path
                      d="M299.27,772.72s-24.67-76.08-131.42-51.33C62.82,745.74,81.48,563.56,92,495.71S193.94,92.18,454.77,76.46,658.58,250.62,632.75,306s-78.37,115.53,16.76,295.77-89.33,258.1-129.36,265.84S375.3,912.41,299.27,772.72Z"
                      id="firstShape"
                    ></path>
                  </defs>
                  <clipPath id="secondShape">
                    <use
                      xlink:href="#firstShape"
                      style="overflow: visible;"
                    ></use>
                  </clipPath>
                  <g clip-path="url(#secondShape)">
                    <image
                      height="1000"
                      id="imageShape1"
                      transform="matrix(0.9488 0 0 0.9488 25 53.1187)"
                      width="1000"
                      :xlink:href="img"
                      style="overflow: visible;"
                    ></image>
                  </g>
                </g>
                <g>
                  <defs>
                    <path
                      d="M741.49,643q-2.58-.31-5.17-.4c-12-.45-46.58-14.37-79.24-71.85-17.81-31.35-47.32-96.41-37.88-167.21,7.84-58.79,38.38-97.1,48.34-130.64,24.82-83.61,66.62-77.07,98-77.07,15.93,0,31.1,14.82,39.21,26.39,11.55,16.48,19.72,46.24-9.1,93.32-60.66,99.07,14.09,139.33-.93,239.68C781.72,641.8,750,644,741.49,643Z"
                      id="thirdShape"
                    ></path>
                  </defs>
                  <clipPath id="fourthShape">
                    <use
                      xlink:href="#thirdShape"
                      style="overflow: visible;"
                    ></use>
                  </clipPath>
                  <g
                    clip-path="url(#fourthShape)"
                    transform="matrix(1 0 0 1 0 0)"
                  >
                    <image
                      height="1000"
                      id="imageShape2"
                      transform="matrix(0.9488 0 0 0.9488 25 53.1187)"
                      width="1000"
                      :xlink:href="img"
                      style="overflow: visible;"
                    ></image>
                  </g>
                </g>
              </svg>
            </figure>
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

    <div class="mb-10">
      <h1 class="text-center">Que te hace un voluntario</h1>
    </div>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12" md="4" sm="12">
          <v-img
            src="@/assets/imagenes/Voluntariado/love.png"
            aspect-ratio="1.7"
            width="50"
            height="50"
            class="centrar mb-5"
          ></v-img>
          <h3 class="mb-5">Eres participativo</h3>
          <p>
            Te gusta participar activamente en actividades que beneficien a
            otras personas.
          </p></v-col
        >
        <v-col cols="12" md="4" sm="12"
          ><v-img
            src="@/assets/imagenes/Voluntariado/workout.png"
            aspect-ratio="1.7"
            width="50"
            height="50"
            class="centrar mb-5"
          ></v-img>
          <h3 class="mb-5">Te gusta ayudar a los demas</h3>
          <p>
            Te gusta ayudar sin lugar a dudas, ver a otras personas felices por
            tus actos es una de tus bondades.
          </p></v-col
        >
        <v-col cols="12" md="4" sm="12"
          ><v-img
            src="@/assets/imagenes/Voluntariado/friendship.png"
            aspect-ratio="1.7"
            width="50"
            height="50"
            class="centrar mb-5"
          ></v-img>
          <h3 class="mb-5">Te gusta trabajar en equipo</h3>
          <p>
            El trabajo en equipo es una de tus mejores cualidades, apoyarse con
            otras personas fortalece y mejora el rendimiento.
          </p></v-col
        >
      </v-row>
    </v-container>
    <div class="mb-10 mt-10"></div>
    <v-container>
      <h1 class="text-center">Beneficios de ser un voluntario</h1>
      <div class="subheading pt-4 text-center container">
        <p class="container">
          Ayudar a otros es el mayor beneficio que podemos tener. La
          satisfacción de que otros estan mejor gracias a ti es la mayor alegria
          que nos pueden ofrecer. Ayudar al prójimo te hace sentir bien contigo
          mismo, lo que hace que generes felicidad y bienestar.
        </p>
      </div>
      <v-img
        src="@/assets/imagenes/ayudar.jpg"
        aspect-ratio="1.4"
        contain
        width="700"
        class="centrar"
      ></v-img>
    </v-container>
    <BtnPanel />
    <Footer />
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import BtnPanel from "@/views/BtnPanel.vue";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      img: require("@/assets/imagenes/Voluntariado/vol.png"),
      email: "",
    };
  },
  components: { Footer, Header, BtnPanel },
  mixins: [validationMixin],
  validations: {
    email: { required, email },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Ingrese un email valido");
      !this.$v.email.required && errors.push("Correo es requerido");
      return errors;
    },
  },
  methods: {
    enviar() {
      this.loader = true;
      this.$v.$touch();
      console.log(this.$v);
      if (!this.$v.$error) {
        this.$store
          .dispatch("GeneralPost", {
            Datos: { correo: this.email.toLowerCase(), nivel: 3 },
            EndPoint: "/solicitar",
          })
          .then((resp) => {
            if (resp.cod >= 0) {
              this.$swal.fire({
                icon: "success",
                title: "Solicitud enviada",
                text: "Verifique su correo",
              });
              this.email = "";
              this.loader = false;
              this.$v.$reset();
            } else if (resp.cod == -1) {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text: "Usted ya esta registrado",
              });
              this.email = "";
              this.$v.$reset();
              this.loader = false;
            } else if (resp.cod == -5) {
              this.$swal
                .fire({
                  title: "Solicitud no enviada",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Volver a enviar!",
                  cancelButtonText: "No",
                })
                .then((result) => {
                  if (result.value) {
                    this.enviar();
                    this.loader = true;
                  } else if (result.dismiss === "cancel") {
                    this.email = "";
                    this.loader = false;
                    this.$v.$reset();
                  }
                });
            } else {
              this.$swal
                .fire({
                  title: "Usted ya posee una solicitud",
                  text: "Por favor revise su correo o cancele su solicitud",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Revisare correo!",
                  cancelButtonText: "Cancelar solicitud",
                })
                .then((result) => {
                  if (result.value) {
                    this.email = "";
                    this.$v.$reset();
                  } else if (result.dismiss === "cancel") {
                    this.$store
                      .dispatch("GeneralGet", {
                        EndPoint: `/CancelarSolicitud/${this.email}`,
                      })
                      .then((resp) => {
                        if (resp.cod >= 0) {
                          this.$swal.fire(
                            "Cancelada!",
                            "La solicitud ha sido cancelada.",
                            "success"
                          );
                        } else {
                          console.log(resp);
                        }
                      })
                      .catch((error) => {});
                  }
                  this.loader = false;
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.loader = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
