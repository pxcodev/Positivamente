<template>
  <div>
    <v-container>
      <!-- info personal -->
      <div class="cont_perfil p">
        <v-sheet
          :elevation="18"
          class="mx-auto profile__person-info md-whiteframe-2dp person-picture"
        >
          <v-btn
            color="principal"
            dark
            fab
            style="z-index: 5; float:right;margin: -20px -40px 0px 0px"
            v-on:click="dialog = !dialog"
            content="Editar Información"
            v-tippy
          >
            <v-icon>$edit</v-icon>
          </v-btn>
          <div
            style="z-index:1"
            class="person-picture profile__avatar profile__avatar--edit"
          >
            <!-- Input file para ser ejecutado mediante jquery -->
            <input
              @change="ImageChange($event.srcElement.files[0])"
              accept="image/*"
              label="File input"
              id="imgprincipal"
              type="file"
            />
            <div
              class="person-picture__hexagon"
              style="margin-top: -80px; display:block"
            >
              <svg
                v-on:click="SubirImgPerfil()"
                style="cursor: pointer;"
                width="156"
                height="166"
                viewBox=" 0 0 150 150"
              >
                <defs>
                  <pattern
                    id="image1"
                    x="-5"
                    y="0"
                    width="156"
                    height="166"
                    patternUnits="userSpaceOnUse"
                  >
                    <image
                      :xlink:href="DataUser.foto ? DataUser.foto : img_pred"
                      x="0"
                      y="0"
                      width="160"
                      height="150"
                    />
                  </pattern>
                  <path
                    id="shape1"
                    fill="url(#image1)"
                    d="M85,5.77350269 L129.951905,31.7264973 C136.139927,35.2991532 139.951905,41.9016936 139.951905,49.0470054 L139.951905,100.952995 C139.951905,108.098306 136.139927,114.700847 129.951905,118.273503 L85,144.226497 C78.8119785,147.799153 71.1880215,147.799153 65,144.226497 L20.0480947,118.273503 C13.8600732,114.700847 10.0480947,108.098306 10.0480947,100.952995 L10.0480947,49.0470054 C10.0480947,41.9016936 13.8600732,35.2991532 20.0480947,31.7264973 L65,5.77350269 C71.1880215,2.20084679 78.8119785,2.20084679 85,5.77350269 Z"
                  />
                  <clipPath id="clip">
                    <use xlink:href="#shape1" />
                  </clipPath>
                </defs>
                <g>
                  <use
                    xlink:href="#shape1"
                    stroke="#2D9EB7"
                    stroke-width="11"
                    fill="#00D2B8"
                    clip-path="url(#clip)"
                  />
                </g>
              </svg>
            </div>
          </div>
          <h1 class="md-headline profile__headline profile__headline--edit">
            Hola, mi nombre es
            <span class="names"
              >{{ DataUser.nombres.split(" ")[0] }}
              {{ DataUser.apellidos.split(" ")[0] }}</span
            >
          </h1>
          <div style="padding: 20px">
            <h2
              class="md-subheading profile__title profile__title--edit"
              v-if="DataUser.edad"
              content="Edad"
              v-tippy
            >
              <v-icon>$party</v-icon>
              {{ DataUser.edad }} años
            </h2>
            <h2
              class="md-subheading profile__title profile__title--edit"
              v-if="DataUser.ocupacion"
              content="Ocupación"
              v-tippy
            >
              <v-icon>$job</v-icon>
              {{ DataUser.ocupacion }}
            </h2>

            <h2
              class="md-subheading profile__title profile__title--edit"
              v-if="DataUser.cedula"
              content="Cedula"
              v-tippy
            >
              <v-icon>$address</v-icon>
              {{ DataUser.cedula }}
            </h2>
            <h2
              class="md-subheading profile__title profile__title--edit"
              v-if="DataUser.correo"
              content="Correo"
              v-tippy
            >
              <v-icon>$mail</v-icon>
              {{ DataUser.correo }}
            </h2>
            <h2
              class="md-subheading profile__title profile__title--edit"
              v-if="DataUser.direccion"
              content="Dirección"
              v-tippy
            >
              <v-icon>$map</v-icon>
              {{ DataUser.direccion }}
            </h2>
            <h2
              class="md-subheading profile__title profile__title--edit"
              v-if="DataUser.tel_movil"
              content="Telefono Movil"
              v-tippy
            >
              <v-icon>$phone</v-icon>
              {{ DataUser.tel_movil }}
            </h2>
            <h2
              class="md-subheading profile__title profile__title--edit"
              v-if="DataUser.tel_casa"
              content="Telefono Casa"
              v-tippy
            >
              <v-icon>$phone</v-icon>
              {{ DataUser.tel_casa }}
            </h2>
            <h2
              class="md-subheading profile__title profile__title--edit"
              v-if="DataUser.tel_emergencia"
              content="Telefono Emergencia"
              v-tippy
            >
              <v-icon>$phone</v-icon>
              {{ DataUser.tel_emergencia }}
            </h2>
          </div>
        </v-sheet>
      </div>
      <!-- idiomas, habilidades y disponibilidad -->
      <div v-if="DataUser.nivel == 3">
        <v-sheet
          :elevation="18"
          class="mx-auto profile__person-info md-whiteframe-2dp person-picture"
        >
          <v-btn
            color="principal"
            dark
            fab
            style="z-index: 5; float:right;margin: -20px -40px 0px 0px"
            v-on:click="dialog2 = !dialog2"
            content="Editar Información"
            v-tippy
          >
            <v-icon>$edit</v-icon>
          </v-btn>
          <div style="padding: 20px">
            <h1 class="md-headline profile__headline profile__headline--edit">
              Idioma(s)
            </h1>

            <div class="text-center" v-if="DataUser.idiomas">
              <v-chip
                class="ma-2"
                color="principal"
                outlined
                v-for="idioma in DataUser.idiomas.split(',')"
                :key="idioma.index"
              >
                <v-icon left>$lang</v-icon>
                {{ idioma }}
              </v-chip>
            </div>

            <h1 class="md-headline profile__headline profile__headline--edit">
              Habilidades
            </h1>

            <div class="text-center" v-if="DataUser.habilidades">
              <v-chip
                class="ma-2"
                color="activo"
                outlined
                v-for="hab in DataUser.habilidades.split(',')"
                :key="hab.index"
              >
                <v-icon left>$dumbbell</v-icon>
                {{ hab }}
              </v-chip>
            </div>

            <h1 class="md-headline profile__headline profile__headline--edit">
              Disponibilidad
            </h1>

            <div class="text-center" v-if="DataUser.disponibilidad">
              <v-chip
                class="ma-2"
                color="cancelado"
                outlined
                v-for="disp in DataUser.disponibilidad.split(',')"
                :key="disp.index"
              >
                <v-icon left>$calen_day</v-icon>
                {{ disp }}
              </v-chip>
            </div>
          </div>
        </v-sheet>
      </div>
      <!-- Historial medico -->
      <div v-if="DataUser.nivel == 3">
        <v-sheet
          :elevation="18"
          class="mx-auto profile__person-info md-whiteframe-2dp person-picture"
        >
          <v-btn
            color="principal"
            dark
            fab
            style="z-index: 5; float:right;margin: -20px -40px 0px 0px"
            v-on:click="dialog3 = !dialog3"
            content="Editar Información"
            v-tippy
          >
            <v-icon>$edit</v-icon>
          </v-btn>
          <div style="padding: 20px">
            <h1 class="md-headline profile__headline profile__headline--edit">
              <v-icon center class="mr-2 mb-1">$medic</v-icon>Enfermedades
            </h1>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left text-center title">Nombre</th>
                    <th class="text-left text-center title">Medicamento</th>
                  </tr>
                </thead>
                <!-- condicional para evitar que salga los head cuando esta vacio -->
                <tbody>
                  <tr
                    v-for="(item, index) in $store.state.DataUserMedStore
                      .enfermedades"
                    :key="index"
                  >
                    <td class="text-center subtitle-1">
                      {{ item.enfermedad }}
                    </td>
                    <td class="text-center subtitle-1">
                      {{ item.medicamento }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <h1 class="md-headline profile__headline profile__headline--edit">
              <v-icon center class="mr-2 mb-1">$medic</v-icon>Alergias
            </h1>

            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left text-center title">Nombre</th>
                    <th class="text-left text-center title">Medicamento</th>
                  </tr>
                </thead>
                <!-- condicional para evitar que salga los head cuando esta vacio -->
                <tbody>
                  <tr
                    v-for="(item, index) in $store.state.DataUserMedStore
                      .alergias"
                    :key="index"
                  >
                    <td class="text-center subtitle-1">{{ item.alergia }}</td>
                    <td class="text-center subtitle-1">
                      {{ item.medicamento }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-sheet>
      </div>
      <!-- Barra de progreso del perfil -->
      <v-progress-linear
        class="fixed2"
        bottom
        color="principal"
        height="25"
        :value="compl_perfil"
      >
        <strong>Progreso de tu perfil {{ Math.ceil(compl_perfil) }}%</strong>
      </v-progress-linear>
    </v-container>
    <!-- Dialog info personal -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Editar Perfil</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form_perfil.nombres"
                      label="Nombres"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form_perfil.apellidos"
                      label="Apellidos"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      disabled
                      v-model="form_perfil.correo"
                      label="Correo"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form_perfil.edad"
                      type="number"
                      label="Edad"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form_perfil.cedula"
                      label="Cedula"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form_perfil.ocupacion"
                      label="Ocupacion"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form_perfil.direccion"
                      label="Dirección"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="form_perfil.tel_movil"
                      label="Tel.Movil"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="form_perfil.tel_casa"
                      label="Tel.Casa"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="form_perfil.tel_emergencia"
                      label="Tel.Emergencia"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false"
                >Cerrar</v-btn
              >
              <v-btn color="blue darken-1" text @click="Guardar()"
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- Dialog idiomas, habilidades y disponibilidad -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog2" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Editar Perfil</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form_perfil.idiomas"
                      :items="items_idiomas"
                      attach
                      chips
                      label="Idiomas"
                      multiple
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form_perfil.habilidades"
                      :items="items_habilidades"
                      attach
                      chips
                      label="Habilidades"
                      multiple
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="form_perfil.disponibilidad"
                      :items="items_dias"
                      attach
                      chips
                      label="Disponibilidad"
                      multiple
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog2 = false"
                >Cerrar</v-btn
              >
              <v-btn color="blue darken-1" text @click="Guardar()"
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- Dialog historial medico -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog3" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Editar historial medico</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <!-- v-model="nombres" -->
                <v-row class="historial">
                  <v-container class="enfermedad">
                    <v-row
                      v-for="(campo_enfe, index) in campos_enfe"
                      :key="index"
                    >
                      <v-col cols="12" md="5">
                        <v-text-field
                          v-model="campo_enfe.enfermedad"
                          label="Enfermedad"
                          color="principal"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="5">
                        <v-text-field
                          v-model="campo_enfe.medicamento"
                          label="Medicamento(s)"
                          color="principal"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn
                          class="vcenter mt-2"
                          fab
                          dark
                          small
                          :disabled="
                            index == 0
                              ? (campos_enfe[campos_enfe.length - 1]
                                  .enfermedad !=
                                  '') &
                                (campos_enfe[campos_enfe.length - 1]
                                  .medicamento !=
                                  '')
                                ? false
                                : true
                              : false
                          "
                          :color="index == 0 ? 'principal' : 'cancelado'"
                          style="text-aling:center"
                          @click="
                            index == 0
                              ? AddCampo('enf')
                              : DelCampo(index, 'enf')
                          "
                        >
                          <v-icon dark>{{
                            index == 0 ? "$plus" : "$minus"
                          }}</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-container class="alergias">
                    <v-row
                      v-for="(campo_aler, index) in campos_aler"
                      :key="index"
                    >
                      <v-col cols="12" md="5">
                        <v-text-field
                          color="principal"
                          v-model="campo_aler.alergia"
                          label="Alergia"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="5">
                        <v-text-field
                          color="principal"
                          v-model="campo_aler.medicamento"
                          label="Medicamento(s)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn
                          class="vcenter mt-2"
                          fab
                          dark
                          small
                          :disabled="
                            index == 0
                              ? (campos_aler[campos_aler.length - 1].alergia !=
                                  '') &
                                (campos_aler[campos_aler.length - 1]
                                  .medicamento !=
                                  '')
                                ? false
                                : true
                              : false
                          "
                          :color="index == 0 ? 'principal' : 'cancelado'"
                          style="text-aling:center"
                          @click="
                            index == 0
                              ? AddCampo('ale')
                              : DelCampo(index, 'ale')
                          "
                        >
                          <v-icon dark>{{
                            index == 0 ? "$plus" : "$minus"
                          }}</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog3 = false"
                >Cerrar</v-btn
              >
              <v-btn color="blue darken-1" text @click="HistorialMED()"
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
import { tippy } from "vue-tippy";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      img_pred: require("@/assets/imagenes/perfil.png"),
      BaseUrlApi: process.env.VUE_APP_RUTA_API,
      DataUser: JSON.parse(localStorage.getItem("DataUser")) || [],
      compl_perfil: 0,
      dialog: false,
      dialog2: false,
      dialog3: false,
      items_idiomas: [
        "Español",
        "Ingles",
        "Portugues",
        "Frances",
        "Japones",
        "Italiano"
      ],
      items_habilidades: [
        "Cantar",
        "Correr",
        "Hablar",
        "Ayudar",
        "Cocinar",
        "Bailar"
      ],
      items_dias: [
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo"
      ],
      form_perfil: {
        nombres: "",
        apellidos: "",
        correo: "",
        edad: "",
        cedula: "",
        ocupacion: "",
        tel_movil: "",
        tel_casa: "",
        tel_emergencia: "",
        direccion: "",
        idiomas: [],
        habilidades: [],
        disponibilidad: [],
        foto: "",
        nivel: this.$store.state.DataUserStore.nivel
      },
      campos_enfe: [],
      campos_aler: []
    };
  },
  created() {
    this.form_perfil = JSON.parse(localStorage.getItem("DataUser"));
    this.form_perfil.idiomas = this.form_perfil.idiomas
      ? this.form_perfil.idiomas.split(",")
      : [];
    this.form_perfil.habilidades = this.form_perfil.habilidades
      ? this.form_perfil.habilidades.split(",")
      : [];
    this.form_perfil.disponibilidad = this.form_perfil.disponibilidad
      ? this.form_perfil.disponibilidad.split(",")
      : [];
  },
  mounted() {
    this.CalcularPorcent();
    var campnulenf = false;
    var campnulale = false;
    try {
      if (this.$store.state.DataUserMedStore.enfermedades.length == 0) {
        this.campos_enfe.push({ enfermedad: "", medicamento: "" });
      } else {
        this.$store.state.DataUserMedStore.enfermedades.forEach(element => {
          if (element.enfermedad) {
            this.campos_enfe.push({
              enfermedad: element.enfermedad,
              medicamento: element.medicamento
            });
          } else {
            campnulenf
              ? null
              : this.campos_enfe.push({ enfermedad: "", medicamento: "" }),
              (campnulenf = true);
          }
        });
      }

      if (this.$store.state.DataUserMedStore.alergias.length == 0) {
        this.campos_aler.push({ alergia: "", medicamento: "" });
      } else {
        this.$store.state.DataUserMedStore.alergias.forEach(element => {
          if (element.alergia) {
            this.campos_aler.push({
              alergia: element.alergia,
              medicamento: element.medicamento
            });
          } else {
            campnulale
              ? null
              : this.campos_aler.push({ alergia: "", medicamento: "" }),
              (campnulale = true);
          }
        });
      }
    } catch (error) {}
  },
  methods: {
    ...mapMutations(["LoadData"]),
    HistorialMED() {
      var test = true;
      var enfe = false;
      var aler = false;
      if (this.campos_enfe.length == 1) {
        enfe = true;
      } else {
        this.campos_enfe.forEach(element => {
          if (element.enfermedad == "" || element.medicamento == "") {
            test = false;
          }
        });
        if (test) {
          enfe = true;
        } else {
          this.$swal.fire({
            icon: "error",
            title: "¡Espera!",
            text: "Si has generado otro campo debes rellenarlo"
          });
        }
      }

      if (this.campos_aler.length == 1) {
        aler = true;
      } else {
        this.campos_aler.forEach(element => {
          if (element.aler == "" || element.medicamento == "") {
            test = false;
          }
        });
        if (test) {
          aler = true;
        } else {
          this.$swal.fire({
            icon: "error",
            title: "¡Espera!",
            text: "Si has generado otro campo debes rellenarlo"
          });
        }
      }

      if (aler && enfe) {
        this.$store
          .dispatch("AgregarCrub", {
            Datos: {
              enfermedades: this.campos_enfe,
              alergias: this.campos_aler,
              correo: this.DataUser.correo
            },
            EndPoint: "AddHistorialMed"
          })
          .then(res => {
            this.$swal.fire({
              icon: "success",
              title: "¡Genial!",
              text: "Su historial medico ha sido actualizado"
            });
            console.log(res);
            localStorage.setItem("DataUserMed", JSON.stringify(res.datos));
            this.LoadData();
            // this.DataUser = JSON.parse(localStorage.getItem("DataUser"));
            this.dialog3 = false;
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    ImageChange(img) {
      const formData = new FormData();
      formData.append("archivo", img);
      if (this.form_perfil.foto) {
        let fotito = this.form_perfil.foto.split("/");
        let carpeta = fotito[fotito.length - 3];
        let subcarpeta = fotito[fotito.length - 2];
        let imgvieja = [fotito[fotito.length - 1]];
        this.$store
          .dispatch("EditarArchivo", {
            carpeta,
            subcarpeta,
            imgvieja,
            formData
          })
          .then(res => {
            var newstr = res.path
              .replace("src", this.BaseUrlApi)
              .replace("public", "");
            var newstr2 = newstr.replace(/\\/g, "/");
            this.form_perfil.foto = newstr2;
            this.Guardar();
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        var titulo = this.DataUser.nombres + this.DataUser.apellidos;
        this.$store
          .dispatch("SubirArchivo", { formData, titulo, carpeta: "perfiles" })
          .then(res => {
            var nuevaRuta = res.path
              .replace("src", this.BaseUrlApi)
              .replace("public", "")
              .replace(/\\/g, "/");
            this.form_perfil.foto = nuevaRuta;
            this.Guardar();
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    SubirImgPerfil() {
      $("#imgprincipal").click();
    },
    CalcularPorcent() {
      var c = 0;
      Object.values(this.DataUser).forEach(element => {
        if (element) {
          c++;
        }
      });
      var total = Object.values(this.DataUser).length - 3;
      var completado = c - 3;
      this.compl_perfil = (completado * 100) / total;
    },
    Guardar() {
      this.$store
        .dispatch("GeneralPost", {
          Datos: this.form_perfil,
          EndPoint: "/EditarPerfil"
        })
        .then(res => {
          this.$swal.fire({
            icon: "success",
            title: "¡Genial!",
            text: "Sus datos han sido actualizados"
          });
          localStorage.setItem("DataUser", JSON.stringify(res.datos));
          this.DataUser = JSON.parse(localStorage.getItem("DataUser"));
          this.CalcularPorcent();
          this.dialog = false;
          this.dialog2 = false;
          this.LoadData();
        })
        .catch(e => {
          console.log(e);
        });
    },
    AddCampo(NameCampo) {
      if (NameCampo == "enf") {
        this.campos_enfe.push({ enfermedad: "", medicamento: "" });
      } else {
        this.campos_aler.push({ alergia: "", medicamento: "" });
      }
    },
    DelCampo(index, NameCampo) {
      if (NameCampo == "enf") {
        this.campos_enfe.splice(index, 1);
      } else {
        this.campos_aler.splice(index, 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
input {
  position: absolute;
  top: -1000px;
}
.fixed2 {
  position: sticky;
  margin-top: 20px;
  bottom: 0%;
}
.cont_perfil {
  display: flex;
  justify-content: space-between;
  position: relative;
  max-width: 1380px;
  width: 100%;
}
.cont_perfil.p {
  margin: 60px auto 16px;
}
.profile__person-info.person-picture {
  margin-top: 40px;
}
.profile__person-info {
  position: relative;
  width: 100%;
  // height: 600px;
  max-width: 960px;
  background-color: #ffffff;
  border-top: 3px solid var(--theme-color);
}

.person-picture__hexagon {
  display: block;
  text-align: center;
}
.profile__avatar {
  margin: 0;
}

.profile__headline {
  text-align: center;
  max-width: 60%;
  margin: 24px auto 0;
}

.md-display-1,
.md-headline {
  font-weight: 400;
  letter-spacing: 0;
}
.md-headline {
  font-size: 24px;
  line-height: 32px;
}
.md-subheading,
.md-subheading-2 {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 20px;
  border: 0px;
  outline: 0px;
}
@media (min-width: 720px) {
  .profile__title {
    font-size: 18px;
  }
}
.profile__title {
  margin: 24px 0 0 0;
  text-align: center;
}

.md-theme-dark.md-chip {
  background-color: rgba(255, 255, 255, 0.16);
}
.md-chip {
  max-width: 99%;
}
.md-chip {
  height: 32px;
  padding: 8px 12px;
  display: inline-block;
  border-radius: 32px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-size: 13px;
  line-height: 16px;
  white-space: nowrap;
  border: 0px;
  outline: 0px;
}
.md-chip .md-chip-container {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: rgba(53, 53, 53, 0.438) !important;
}
</style>
