<template>
  <v-data-table
    :headers="headers"
    :items="gestores"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:item.estado="{ item }">
      <v-chip v-if="item.estado" :color="getColorEstado(item.estado)" light>{{
        item.estado
      }}</v-chip>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip v-if="item.status" :color="getColorStatus(item.status)" light>{{
        item.status
      }}</v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Gestores</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="800px">
          <template v-slot:activator="{ on }">
            <v-btn color="principal" dark class="mb-2" v-on="on"
              >Nuevo Gestor</v-btn
            >
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-capitalize
                      color="principal"
                      v-model="editedItem.nombres"
                      label="Nombres"
                      :error-messages="nombresErrors"
                      required
                      @input="$v.editedItem.nombres.$touch()"
                      @blur="$v.editedItem.nombres.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-capitalize md="4">
                    <v-text-field
                      color="principal"
                      v-model="editedItem.apellidos"
                      label="Apellidos"
                      :error-messages="apellidosErrors"
                      required
                      @input="$v.editedItem.apellidos.$touch()"
                      @blur="$v.editedItem.apellidos.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      color="principal"
                      v-model="editedItem.cedula"
                      label="Cedula"
                      :error-messages="cedulaErrors"
                      required
                      @input="$v.editedItem.cedula.$touch()"
                      @blur="$v.editedItem.cedula.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      color="principal"
                      v-model="editedItem.correo"
                      label="Correo"
                      :error-messages="correoErrors"
                      required
                      @input="$v.editedItem.correo.$touch()"
                      @blur="$v.editedItem.correo.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      color="principal"
                      item-text="nombre"
                      item-value="id"
                      v-model="editedItem.nivel"
                      :items="niveles"
                      label="Nivel"
                      return-object
                      single-line
                      :error-messages="nivelErrors"
                      required
                      @input="$v.editedItem.nivel.$touch()"
                      @blur="$v.editedItem.nivel.$touch()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      color="principal"
                      v-model="editedItem.status"
                      :items="estados"
                      label="Estado"
                      :error-messages="statusErrors"
                      required
                      @input="$v.editedItem.status.$touch()"
                      @blur="$v.editedItem.status.$touch()"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="ma-2"
                :disabled="loader"
                @click="close"
                tile
                outlined
                color="cancelado"
              >
                Cancelar
                <v-icon left>$cancel</v-icon>
              </v-btn>
              <v-btn
                :loading="loader"
                :disabled="loader"
                large
                @click="save"
                class="ma-2"
                outlined
                color="success"
              >
                <v-icon left>$user</v-icon>Completar
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>$sync</v-icon>
                  </span>
                </template>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogSol" persistent max-width="290">
          <template v-slot:activator="{ on }">
            <v-btn color="principal" dark class="ml-5 mb-2" v-on="on"
              >Enviar solicitud</v-btn
            >
          </template>
          <v-card>
            <v-card-title class="headline">Envio de solicitud</v-card-title>
            <v-card-text
              >Ingrese el correo del nuevo gestor, sera enviado una solicitud de
              registro.</v-card-text
            >
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    color="principal"
                    v-model="solicitud.correo"
                    label="Correo"
                    :error-messages="solcorreoErrors"
                    required
                    @input="$v.solicitud.correo.$touch()"
                    @blur="$v.solicitud.correo.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    color="principal"
                    item-text="nombre"
                    item-value="id"
                    v-model="solicitud.nivel"
                    :items="niveles"
                    label="Nivel"
                    return-object
                    single-line
                    :error-messages="solnivelErrors"
                    required
                    @input="$v.solicitud.nivel.$touch()"
                    @blur="$v.solicitud.nivel.$touch()"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>

            <v-card-actions>
              <v-btn
                small
                class="ma-2"
                :disabled="loader"
                @click="close"
                tile
                outlined
                color="cancelado"
              >
                <v-icon left>$cancel</v-icon>Cancelar
              </v-btn>
              <v-btn
                small
                :loading="loader"
                :disabled="loader"
                @click="EnviarSolicitud()"
                class="ma-2"
                outlined
                color="success"
              >
                <v-icon left>$paper_plane</v-icon>Enviar
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>$sync</v-icon>
                  </span>
                </template>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.action="{ item }">
      <v-icon
        v-if="item.estado != 'Por Completar'"
        content="Editar"
        v-tippy
        small
        color="warning"
        class="mr-2"
        @click="editItem(item)"
        >$edit</v-icon
      >
      <v-icon
        v-if="item.estado == 'Por Completar'"
        content="Reenviar correo"
        v-tippy
        color="principal"
        small
        class="mr-2"
        @click="ReenviarCorreo(item)"
        >$mail</v-icon
      >
      <v-icon
        content="Eliminar"
        v-tippy
        color="red"
        small
        @click="deleteItem(item)"
        >$delete</v-icon
      >
    </template>
    <template v-slot:no-data>
      <h1>No se encontraron gestores</h1>
      <!-- <v-btn color="primary" @click="initialize">Reset</v-btn> -->
    </template>
  </v-data-table>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import { tippy } from "vue-tippy";
export default {
  data: () => ({
    loader: false,
    BaseUrlApi: process.env.VUE_APP_RUTA_API,
    Imgselected: null,
    ImgselectedUrl: null,
    estado: true,
    dialog: false,
    dialogSol: false,
    niveles: [
      { nombre: "Gestor", id: 2 },
      { nombre: "Administrador", id: 1 },
    ],
    estados: ["Habilitado", "Deshabilitado"],
    headers: [
      { text: "Nombres", value: "nombres" },
      { text: "Apellidos", value: "apellidos" },
      { text: "Cedula", value: "cedula" },
      { text: "Correo", value: "correo" },
      { text: "Nivel", value: "nivel.nombre" },
      { text: "Solicitud", value: "estado" },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "action", sortable: false },
    ],
    gestores: [],
    editedIndex: -1,
    editedItem: {
      nombres: "",
      apellidos: "",
      cedula: "",
      correo: "",
      status: "",
      nivel: null,
    },
    defaultItem: {
      nombres: "",
      apellidos: "",
      cedula: "",
      correo: "",
      status: "",
      nivel: null,
    },
    solicitud: {
      correo: "",
      nivel: [],
    },
    DataUser: JSON.parse(localStorage.getItem("DataUser")) || false,
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      nombres: { required },
      apellidos: { required },
      cedula: { required },
      correo: { required, email },
      nivel: { required },
      status: { required },
    },
    solicitud: {
      correo: { required, email },
      nivel: { required },
    },
  },
  computed: {
    nombresErrors() {
      const errors = [];
      if (!this.$v.editedItem.nombres.$dirty) return errors;
      !this.$v.editedItem.nombres.required &&
        errors.push("Nombres es requerido.");
      return errors;
    },
    apellidosErrors() {
      const errors = [];
      if (!this.$v.editedItem.apellidos.$dirty) return errors;
      !this.$v.editedItem.apellidos.required &&
        errors.push("Apellidos es requerido.");
      return errors;
    },
    cedulaErrors() {
      const errors = [];
      if (!this.$v.editedItem.cedula.$dirty) return errors;
      !this.$v.editedItem.cedula.required &&
        errors.push("Cedula es requerida.");
      return errors;
    },
    correoErrors() {
      const errors = [];
      if (!this.$v.editedItem.correo.$dirty) return errors;
      !this.$v.editedItem.correo.email &&
        errors.push("Ingrese un correo valido");
      !this.$v.editedItem.correo.required && errors.push("Correo es requerido");
      return errors;
    },
    nivelErrors() {
      const errors = [];
      if (!this.$v.editedItem.nivel.$dirty) return errors;
      !this.$v.editedItem.nivel.required && errors.push("Estado es requerido.");
      return errors;
    },
    statusErrors() {
      const errors = [];
      if (!this.$v.editedItem.status.$dirty) return errors;
      !this.$v.editedItem.status.required &&
        errors.push("Estado es requerido.");
      return errors;
    },
    solcorreoErrors() {
      const errors = [];
      if (!this.$v.solicitud.correo.$dirty) return errors;
      !this.$v.solicitud.correo.email &&
        errors.push("Ingrese un correo valido");
      !this.$v.solicitud.correo.required && errors.push("Correo es requerido");
      return errors;
    },
    solnivelErrors() {
      const errors = [];
      if (!this.$v.solicitud.nivel.$dirty) return errors;
      !this.$v.solicitud.nivel.required && errors.push("Nivel es requerido.");
      return errors;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo gestor" : "Editar gestor";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    if (this.$store.state.DataUserStore.nivel == 1) {
      this.initialize();
    } else {
      this.$router.push("/panel/inicio");
    }
  },

  methods: {
    EnviarSolicitud() {
      this.$v.solicitud.$touch();
      console.log(this.$v);
      if (!this.$v.solicitud.$error) {
        this.loader = true;
        this.$store
          .dispatch("GeneralPost", {
            Datos: {
              correo: this.solicitud.correo.toLowerCase(),
              nivel: this.solicitud.nivel.id,
            },
            EndPoint: "/solicitar",
          })
          .then((res) => {
            console.log(res);
            if (res.cod >= 0) {
              this.$swal.fire({
                icon: "success",
                title: "Genial",
                text: "Se ha enviado la solicitud",
              });
              var gestor = res.datos;
              // Recorremos el array niveles para agregar el array correspondiente a la respuesta con su debido
              // nombre y id del nivel para que sea leido por la tabla principal
              this.niveles.forEach((element) => {
                if (gestor.nivel == element.id) {
                  gestor.nivel = element;
                }
              });
              // agregamos el array de respuesta al array leido por la tabla
              this.gestores.push(gestor);
              // reiniciamos el loader del botton
              this.loader = false;
              // cerramos el dialog
              this.dialogSol = false;
              // reiniciamos las variables del array que contenia los datos de la solicitud
              this.solicitud.correo = "";
              this.solicitud.nivel = [];
            } else if (res.cod == -1) {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text: "El correo se encuentra registrado",
              });
              this.email = "";
              this.$v.$reset();
              this.loader = false;
            } else if (res.cod == -5) {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text:
                  "Ocurrio un error al enviar el correo, vuelva a intentarlo",
              });
              this.loader = false;
            } else {
              this.$swal
                .fire({
                  title: "El gestor ya posee una solicitud",
                  text: "Por favor revise el correo o cancele la solicitud",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Revisar correo!",
                  cancelButtonText: "Cancelar solicitud",
                })
                .then((result) => {
                  if (result.value) {
                    this.loader = false;
                    this.dialogSol = false;
                    this.solicitud.correo = "";
                    this.solicitud.nivel = [];
                  } else if (result.dismiss === "cancel") {
                    this.$store
                      .dispatch("CancelarSolicitud", this.solicitud.correo)
                      .then((resp) => {
                        if (resp.cod >= 0) {
                          this.$swal.fire(
                            "Cancelada!",
                            "La solicitud ha sido cancelada.",
                            "success"
                          );
                          const index = this.gestores.indexOf({
                            correo: this.solicitud.correo,
                            nivel: this.solicitud.nivel,
                          });
                          this.gestores.splice(index, 1);
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
          .catch((e) => {
            this.loader = false;
            console.log(e);
          });
      }
    },
    ReenviarCorreo(item) {
      this.$store
        .dispatch("GeneralGet", {
          EndPoint: `/CancelarSolicitud/${item.correo}`,
        })
        .then((resp) => {
          console.log(resp);
          if (resp.cod >= 0) {
            const index = this.gestores.indexOf({
              correo: this.solicitud.correo,
              nivel: this.solicitud.nivel,
            });
            this.gestores.splice(index, 1);
            this.$store
              .dispatch("GeneralPost", {
                Datos: {
                  correo: item.correo.toLowerCase(),
                  nivel: item.nivel.id,
                },
                EndPoint: "/solicitar",
              })
              .then((res) => {
                if (res.cod >= 0) {
                  this.$swal.fire({
                    icon: "success",
                    title: "Genial",
                    text: "Se ha reenviado la solicitud",
                  });
                  var gestor = res.datos;
                  this.niveles.forEach((element) => {
                    if (gestor.nivel == element.id) {
                      gestor.nivel = element;
                    }
                  });
                  this.gestores.push(gestor);
                } else if (res.cod == -1) {
                } else {
                }
              })
              .catch((error) => {});
          } else {
            console.log(resp);
          }
        })
        .catch((error) => {});
    },
    getColorStatus(status) {
      if (status == "Habilitado") return "activo";
      else if (status == "Deshabilitado") return "cancelado";
    },
    getColorEstado(estado) {
      if (estado == "Completada") return "activo";
      else if (estado == "Por Completar") return "peligro";
    },
    initialize() {
      this.$store
        .dispatch("GeneralGet", {
          EndPoint: `/gestores/${this.DataUser.correo}`,
        })
        .then((ges) => {
          this.$store
            .dispatch("GeneralGet", { EndPoint: "/solicitudes" })
            .then((sol) => {
              var gestores = ges;
              sol.forEach((element) => {
                gestores.push(element);
              });
              for (let i = 0; i < gestores.length; i++) {
                for (let j = 0; j < this.niveles.length; j++) {
                  if (gestores[i].nivel == this.niveles[j].id) {
                    gestores[i].nivel = this.niveles[j];
                  }
                }
              }
              this.gestores = gestores;
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editItem(item) {
      this.editedIndex = this.gestores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.correoold = this.editedItem.correo;
      this.dialog = true;
    },
    deleteItem(item) {
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
            this.$swal.fire(
              "Borrado!",
              "El gestor ha sido borrado.",
              "success"
            );
            this.$store
              .dispatch("EliminarCrub", {
                Datos: item.correo,
                EndPoint: "gestor/",
              })
              .then((res) => {
                const index = this.gestores.indexOf(item);
                this.gestores.splice(index, 1);
                if (item.foto) {
                  let foto = item.foto.split("/");
                  let folder = foto[foto.length - 3];
                  let subfolder = foto[foto.length - 2];
                  this.$store
                    .dispatch("EliminarArchivo", { folder, subfolder })
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }
              })
              .catch((e) => {});
          }
        });
    },
    close() {
      this.dialog = false;
      this.dialogSol = false;
      this.$v.$reset();
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.ImgselectedUrl = null;
        this.Imgselected = null;
      }, 300);
    },
    save() {
      this.$v.editedItem.$touch();
      if (!this.$v.editedItem.$error) {
        if (this.editedIndex > -1) {
          // Editando
          this.loader = true;
          this.$store
            .dispatch("EditarCrub", {
              Datos: this.editedItem,
              EndPoint: "gestor/",
            })
            .then((res) => {
              Object.assign(this.gestores[this.editedIndex], res);
              this.$swal.fire({
                icon: "success",
                title: "Genial",
                text: "Ha sido modificado el gestor",
              });
              this.loader = false;
              this.close();
            })
            .catch((e) => {
              this.loader = false;
              console.log(e);
            });
        } else {
          // Agregando
          this.loader = true;
          this.$store
            .dispatch("AgregarCrub", {
              Datos: this.editedItem,
              EndPoint: "/nuevo-gestor",
            })
            .then((res) => {
              if (res.cod >= 0) {
                this.gestores.push(res.datos);
                this.$swal.fire({
                  icon: "success",
                  title: "Genial",
                  text: "Se ha agregado un nuevo gestor",
                });
                this.loader = false;
                this.close();
              } else if (res.cod == -1) {
                this.$swal.fire({
                  icon: "error",
                  title: "Error",
                  text:
                    "El gestor que intenta registrar se encuentra registrado",
                });
                this.loader = false;
                this.close();
              } else if (res.cod == -5) {
                this.$swal
                  .fire({
                    title: "Correo no enviado",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Volver a enviar!",
                    cancelButtonText: "No",
                  })
                  .then((result) => {
                    if (result.value) {
                      this.save();
                      this.loader = true;
                    } else if (result.dismiss === "cancel") {
                      this.loader = false;
                      this.close();
                    }
                  });
              } else {
                this.$swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "El gestor que intenta registrar posee una solicitud",
                });
                this.loader = false;
                this.close();
              }
            })
            .catch((e) => {
              this.loader = false;
              console.log(e);
            });
        }
      }
    },
  },

  mounted: {},
};
</script>

<style scoped>
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview img {
  max-width: 50%;
  max-height: 500px;
}
</style>
