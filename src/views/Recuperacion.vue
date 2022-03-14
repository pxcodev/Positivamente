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
            <v-col cols="12">
              <p
                class="font-weight-black text-center display-1"
                style="color:white"
              >
                Restablecer contraseña
              </p>
              <div>
                <template>
                  <v-card
                    class="mx-auto"
                    max-width="400"
                    outlined
                    style="padding:40px"
                  >
                    <form>
                      <v-text-field
                        v-model="correo"
                        label="Correo"
                        disabled
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
                          v-on:click.prevent="restablecer()"
                          class="ma-2"
                          outlined
                          color="success"
                          type="submit"
                        >
                          <v-icon left>$shield</v-icon>Restablecer
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
  sameAs
} from "vuelidate/lib/validators";
export default {
  data() {
    return {
      correo: "",
      pass: "",
      confirmpass: "",
      loader: false
    };
  },
  components: { Header, Footer },
  computed: {
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
    }
  },
  mixins: [validationMixin],
  validations: {
    pass: { required, minLength: minLength(8) },
    confirmpass: { sameAsPassword: sameAs("pass") }
  },
  mounted() {
    var token = this.$route.params.token;
    this.$store
      .dispatch("GeneralGet", { EndPoint: `/val-token-rec/${token}` })
      .then(res => {
        console.log(res);
        if (res.cod >= 0) {
          this.correo = res.datos.correo;
          console.log(res);
        } else {
          this.$router.push(`/error/${res.msg}`);
        }
      })
      .catch(e => {
        console.log(e.response);
      });
  },
  methods: {
    restablecer() {
      this.loader = true;
      this.$v.$touch();
      if (!this.$v.$error) {
        this.$store
          .dispatch("GeneralPost", {
            Datos: { pass: this.pass, correo: this.correo },
            EndPoint: "/recuperar"
          })
          .then(resp => {
            if (resp.cod >= 0) {
              this.$swal.fire({
                icon: "success",
                title: "Genial",
                text: "Ha sido cambiada su contraseña"
              });
              this.loader = false;
              this.$router.push(`/`);
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrio un error, vuelva a intentarlo"
              });
              this.loader = false;
            }
          });
      } else {
        this.loader = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
