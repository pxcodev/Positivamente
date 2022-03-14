<template>
  <div id="solicitar">
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
          <v-col cols="12" md="6">
            <div
              class="white--text"
              data-aos="fade-right"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              data-aos-offset="300"
            >
              <p class="font-weight-black display-2">
                Unete a nosotros, forma parte de Proyecto Positivamente
              </p>
              <p class="headline font-weight-light">
                <v-icon>fas fa-chevron-circle-down</v-icon>Participación en
                actividades
              </p>
              <p class="headline font-weight-light">
                <v-icon>fas fa-chevron-circle-down</v-icon>Obtenga acceso
                instantáneo a las noticias
              </p>
              <p class="headline font-weight-light">
                <v-icon>fas fa-chevron-circle-down</v-icon>Contacto directo con
                nosotros
              </p>
              <p class="headline font-weight-light">
                <v-icon>fas fa-chevron-circle-down</v-icon>Acceso al calendario
                de actividades
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div
              class="white--text"
              data-aos="fade-left"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              data-aos-offset="300"
            >
              <template>
                <v-card
                  class="mx-auto"
                  max-width="400"
                  outlined
                  style="padding:40px"
                >
                  <v-card-title>
                    <p class="mx-auto headline principal--text">
                      ¡Registrate Ahora!
                    </p>
                  </v-card-title>
                  <form>
                    <v-text-field
                      color="principal"
                      v-model="email"
                      label="Correo"
                      required
                      :error-messages="emailErrors"
                      @input="$v.email.$touch()"
                      @blur="$v.email.$touch()"
                    ></v-text-field>

                    <div class="text-center">
                      <v-btn
                        type="submit"
                        :loading="loader"
                        :disabled="loader"
                        large
                        v-on:click.prevent="enviar()"
                        class="ma-2"
                        outlined
                        color="principal"
                      >
                        Enviar
                        <template v-slot:loader>
                          <span class="custom-loader">
                            <v-icon light>$sync</v-icon>
                          </span>
                        </template>
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
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
export default {
  data: () => ({
    email: "",
    isActive: false,
    loader: false
  }),
  mixins: [validationMixin],
  validations: {
    email: { required, email }
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Ingrese un email valido");
      !this.$v.email.required && errors.push("Correo es requerido");
      return errors;
    }
  },
  methods: {
    enviar() {
      this.loader = true;
      this.$v.$touch();
      if (!this.$v.$error) {
        this.$store
          .dispatch("GeneralPost", {
            Datos: { correo: this.email.toLowerCase(), nivel: 3 },
            EndPoint: "/solicitar"
          })
          .then(resp => {
            if (resp.cod >= 0) {
              this.$swal.fire({
                icon: "success",
                title: "Solicitud enviada",
                text: "Verifique su correo"
              });
              this.email = "";
              this.loader = false;
              this.$v.$reset();
            } else if (resp.cod == -1) {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text: "Usted ya esta registrado"
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
                  cancelButtonText: "No"
                })
                .then(result => {
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
                  cancelButtonText: "Cancelar solicitud"
                })
                .then(result => {
                  if (result.value) {
                    this.email = "";
                    this.$v.$reset();
                  } else if (result.dismiss === "cancel") {
                    this.$store
                      .dispatch("GeneralGet", {
                        EndPoint: `/CancelarSolicitud/${this.email}`
                      })
                      .then(resp => {
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
                      .catch(error => {});
                  }
                  this.loader = false;
                });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.loader = false;
      }
    }
  }
};
</script>

<style scoped>
.theme--light.v-card.v-card--outlined {
  border-radius: 15px;
}
</style>
