<template>
  <div>
    <Header />
    <div
      class="et_pb_section et_pb_section_3 et_pb_with_background et_section_regular"
    >
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="centrar">
            <p class="font-weight-black display-2 text-center white--text">
              ¡Contactanos!
            </p>
            <v-img src="@/assets/imagenes/Contacto/contacto.png"></v-img>
          </v-col>
          <v-col cols="12" md="6">
            <div>
              <template>
                <v-card
                  class="mx-auto"
                  max-width="400"
                  outlined
                  style="padding: 40px;"
                >
                  <v-card-title>
                    <p class="mx-auto headline principal--text">
                      ¡Envianos tu mensaje!
                    </p>
                  </v-card-title>
                  <form>
                    <v-text-field
                      color="principal"
                      v-model="Sms.correo"
                      label="Correo"
                      :error-messages="correoErrors"
                      required
                      @input="$v.Sms.correo.$touch()"
                      @blur="$v.Sms.correo.$touch()"
                    ></v-text-field>
                    <v-text-field
                      color="principal"
                      v-model="Sms.nombre"
                      :error-messages="nombreErrors"
                      label="Nombre"
                      required
                      @input="$v.Sms.nombre.$touch()"
                      @blur="$v.Sms.nombre.$touch()"
                    ></v-text-field>
                    <v-text-field
                      color="principal"
                      v-model="Sms.apellido"
                      label="Apellido"
                      :error-messages="apellidoErrors"
                      required
                      @input="$v.Sms.apellido.$touch()"
                      @blur="$v.Sms.apellido.$touch()"
                    ></v-text-field>
                    <v-textarea
                      color="principal"
                      clearable
                      v-model="Sms.mensaje"
                      :error-messages="mensajeErrors"
                      :counter="30"
                      clear-icon="$cancel"
                      label="Mensaje"
                      required
                      @input="$v.Sms.mensaje.$touch()"
                      @blur="$v.Sms.mensaje.$touch()"
                    ></v-textarea>
                    <div class="text-center">
                      <v-btn
                        @click="enviar()"
                        class="ma-2"
                        tile
                        outlined
                        color="success"
                      >
                        <v-icon left>fas fa-paper-plane</v-icon>Enviar
                      </v-btn>
                    </div>
                  </form>
                </v-card>
              </template>
            </div>
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
    <div class="my-10">
      <v-container>
        <div
          data-aos="zoom-in"
          data-aos-easing="linear"
          data-aos-duration="1500"
          data-aos-offset="500"
        >
          <p class="text-center display-1">
            Tienes una pregunta? Nosotros tenemos la respuesta
          </p>
          <!-- <p class="text-center mx-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit.
          </p>-->
        </div>
        <div>
          <v-row>
            <v-col cols="12" md="6" class="centrar">
              <v-img src="@/assets/imagenes/logo.png"></v-img>
            </v-col>
            <v-col cols="12" md="6">
              <v-row>
                <v-col v-for="(valor, i) in valores" :key="i" cols="6">
                  <v-card
                    class="mx-auto"
                    max-width="300"
                    outlined
                    color="principal"
                  >
                    <v-card-title>
                      <img class="mx-auto" :src="valor.img" alt />
                    </v-card-title>
                    <v-card-text>
                      <p class="title text-center black--text">
                        {{ valor.titulo }}
                      </p>
                      <p class="subtitle-1 text-center black--text">
                        {{ valor.contenido }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div
            data-aos="zoom-in"
            data-aos-easing="linear"
            data-aos-duration="1500"
            data-aos-offset="300"
          >
            <p class="text-center display-1">Preguntas frecuentes</p>
          </div>
          <div
            data-aos="zoom-in"
            data-aos-easing="linear"
            data-aos-duration="1500"
            data-aos-offset="300"
          >
            <!-- <v-col cols="12"
                    ><p class="title text-left">
                      Lorem ipsum dolor sit amet consectetur ?
                    </p>
                    <p class="subtitle-1 text-left">
                      Lorem ipsum dolor sit amet, consectetur adipiscingelit.
                      Integer et fringilla orci. Maecenas convallis nisl et
                      massa consequat pellentesque. Vivamus sed condimentum enim
            </p></v-col>-->
            <v-row>
              <v-col v-for="(pregunta, i) in preguntasfrec" :key="i" cols="6">
                <p class="title text-left">{{ pregunta.titulo }}</p>
                <p class="subtitle-1 text-left">{{ pregunta.contenido }}</p>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-container>
    </div>
    <Footer />
    <BtnPanel />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BtnPanel from "@/views/BtnPanel.vue";
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import moment from "moment";
export default {
  data: () => ({
    Sms: {
      correo: "",
      nombre: "",
      apellido: "",
      mensaje: "",
      estado: "no leido",
      fecha: moment().format("YYYY-MM-DD"),
    },
    defaultSms: {
      correo: "",
      nombre: "",
      apellido: "",
      mensaje: "",
      estado: "no leido",
      fecha: moment().format("YYYY-MM-DD"),
    },
    isActive: false,
    valores: [
      {
        img: require("@/assets/imagenes/Contacto/respeto.png"),
        titulo: "Respeto",
        contenido: `El respeto es la capacidad de reconocer, apreciar y valorar a los otros teniendo en cuenta que todos somos válidos.`,
      },
      {
        img: require("@/assets/imagenes/Contacto/amor.png"),
        titulo: "Amor",
        contenido: `El amor es uno de los valores fundamentales de la sociedad porque nos empuja a velar por la felicidad del otro.`,
      },
      {
        img: require("@/assets/imagenes/Contacto/libertad.png"),
        titulo: "Libertad",
        contenido: `La libertad es un valor que nos ayuda a realizarnos como personas. La libertad individual se enmarca dentro de lo social.`,
      },
      {
        img: require("@/assets/imagenes/Contacto/justicia.png"),
        titulo: "Justicia",
        contenido: `La justicia es un valor importante porque busca el equilibrio entre el propio bien y el de la sociedad.`,
      },
    ],
    preguntasfrec: [
      {
        titulo: "¿Son una fundación?",
        contenido: `Legalmente somos una Asociacion Civil, pero trabajamos como una fundación,
        realizando diversas actividades que beneficien a la comunidad.`,
      },
      {
        titulo: "¿Cualquiera puede ser voluntario?",
        contenido: `Si, cualquier persona mayor de edad puede ser voluntario, y de esta manera
        apoyarnos en la realización de actividades dentro de la organización.`,
      },
      {
        titulo: "¿Reciben donaciones?",
        contenido: `Si, recibimos cualquier tipo de donación que esté a su alzance, de esta manera
        colabora con la realización de muchas mas actividades en pro de mejorar la calidad de vida
        del Venezolano.`,
      },
      {
        titulo: "¿Cuáles son nuestros valores?",
        contenido: `Solidaridad, compromiso, excelencia, participación, transparencia y unidad.`,
      },
      {
        titulo: "¿Cuál es el fin social de Proyecto Positivamente A.C?",
        contenido: `Educación, salud, agua y saneamiento e inclusión social.`,
      },
      {
        titulo:
          "¿Qué significa hacerse voluntario de Proyecto Positivamente A.C?",
        contenido: `Ser voluntario de Proyecto Positivamente implica colaborar con la Fundación, realizando alguno de los servicios que necesiten (gestión de eventos, administración, logística, proyectos, comunicación, diseño gráfico, entre otros.).`,
      },
    ],
  }),
  components: { Header, Footer, BtnPanel },
  mixins: [validationMixin],
  validations: {
    Sms: {
      correo: { required, email },
      nombre: { required },
      apellido: { required },
      mensaje: { required, minLength: minLength(30) },
    },
  },
  methods: {
    enviar() {
      this.$v.$touch();
      if (!this.$v.$error) {
        this.$socket.client.emit("Mensajes", {
          sms: this.Sms,
        });
        this.$v.$reset();
        /*this.$store
          .dispatch("GeneralPost", {
            Datos: {
              correo: this.correo,
              nombre: this.nombre,
              apellido: this.apellido,
              mensaje: this.mensaje,
            },
            EndPoint: "/FormContacto",
          })
          .then((res) => {
            if (res.cod >= 0) {
              this.$swal.fire({
                icon: "success",
                title: "Genial",
                text:
                  "Ha sido enviado tu mensaje en breve le responderán al correo ingresado.",
              });
              this.mensaje = "";
              this.nombre = "";
              this.apellido = "";
              this.correo = "";
              this.$v.$reset();
            }
          })
          .catch((e) => {
            console.log(e.response);
          });*/
      } else {
      }
    },
  },
  sockets: {
    Aviso(data) {
      if (data.tipo !== "error") {
        this.$swal.fire({
          icon: "success",
          title: "Genial",
          text:
            "Ha sido enviado tu mensaje en breve le responderán al correo ingresado.",
        });
        this.Sms = Object.assign({}, this.defaultSms);
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Oh no",
          text:
            "No se ha podido enviar tu mensaje, verifique la conexión e intente nuevamente.",
        });
      }
      console.log(data);
    },
  },
  computed: {
    nombreErrors() {
      const errors = [];
      if (!this.$v.Sms.nombre.$dirty) return errors;
      !this.$v.Sms.nombre.required && errors.push("Nombre es requerido.");
      return errors;
    },
    apellidoErrors() {
      const errors = [];
      if (!this.$v.Sms.apellido.$dirty) return errors;
      !this.$v.Sms.apellido.required && errors.push("Apellido es requerido.");
      return errors;
    },
    correoErrors() {
      const errors = [];
      if (!this.$v.Sms.correo.$dirty) return errors;
      !this.$v.Sms.correo.email && errors.push("Escribe un correo valido");
      !this.$v.Sms.correo.required && errors.push("Correo es requerido");
      return errors;
    },
    mensajeErrors() {
      const errors = [];
      if (!this.$v.Sms.mensaje.$dirty) return errors;
      console.log(!this.$v.Sms.mensaje.minLength);
      !this.$v.Sms.mensaje.minLength &&
        errors.push("El mensaje debe contener mas de 30 caracteres.");
      !this.$v.Sms.mensaje.required && errors.push("Mensaje es requerido.");
      return errors;
    },
  },
};
</script>

<style lang="scss" scoped></style>
