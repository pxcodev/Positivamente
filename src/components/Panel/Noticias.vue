<template>
  <v-data-table
    :headers="headers"
    :items="noticias"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Noticias</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="1000px">
          <template v-slot:activator="{ on }">
            <v-btn color="principal" dark class="mb-2" v-on="on"
              >Nueva noticia</v-btn
            >
          </template>
          <v-card>
            <v-icon
              class="float-right mr-2 mt-2"
              content="Salir"
              v-tippy="{ placement: 'left' }"
              color="red"
              @click="close"
              >$cancel</v-icon
            >
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field
                      color="principal"
                      v-model="editedItem.titulo"
                      label="Titulo"
                      :error-messages="tituloErrors"
                      required
                      @input="$v.editedItem.titulo.$touch()"
                      @blur="$v.editedItem.titulo.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <wysiwyg
                      v-model="editedItem.contenido"
                      color="principal"
                      counter
                      label="Contenido"
                      :error-messages="contenidoErrors"
                      required
                      @input="$v.editedItem.contenido.$touch()"
                      @blur="$v.editedItem.contenido.$touch()"
                    />
                    <div
                      class="v-text-field__details"
                      v-if="$v.editedItem.contenido.$error"
                    >
                      <div
                        class="v-messages theme--light error--text"
                        role="alert"
                      >
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            Contenido es requerido
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- <v-textarea
                      color="principal"
                      counter
                      v-model="editedItem.contenido"
                      label="Contenido"
                      :error-messages="contenidoErrors"
                      required
                      @input="$v.editedItem.contenido.$touch()"
                      @blur="$v.editedItem.contenido.$touch()"
                    ></v-textarea> -->
                  </v-col>
                  <v-col>
                    <div id="preview">
                      <img v-if="ImgselectedUrl" :src="ImgselectedUrl" />
                    </div>
                    <v-file-input
                      color="principal"
                      @change="ImageChange($event)"
                      accept="image/*"
                      label="File input"
                      id="imgprincipal"
                      :error-messages="ImgselectedUrlErrors"
                      required
                      @input="$v.ImgselectedUrl.$touch()"
                      @blur="$v.ImgselectedUrl.$touch()"
                    ></v-file-input>
                  </v-col>

                  <v-col>
                    <v-switch
                      color="principal"
                      v-model="editedItem.estado"
                      :label="`Estado: ${
                        editedItem.estado ? 'Publicar' : 'No publicar'
                      }`"
                    ></v-switch>
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
                @click="save"
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

              <!-- <v-btn class="ma-2" @click="save" tile outlined color="activo">
                <v-icon left>$paper_plane</v-icon>Guardar
              </v-btn>-->
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.fecha="{ item }">
      <v-chip light>{{ $store.getters.FechaFormateada(item.fecha) }}</v-chip>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        content="Editar"
        v-tippy
        small
        color="warning"
        class="mr-2"
        @click="editItem(item)"
        >$edit</v-icon
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
      <h1>No se encontraron noticias</h1>
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
    myHTML: "",
    loader: false,
    BaseUrlApi: process.env.VUE_APP_RUTA_API,
    Imgselected: null,
    ImgselectedUrl: null,
    estado: true,
    dialog: false,
    headers: [
      {
        text: "Id",
        align: "left",
        sortable: false,
        value: "id",
      },
      { text: "Titulo", value: "titulo" },
      { text: "Extracto", value: "extracto" },
      { text: "Autor", value: "autor" },
      { text: "Fecha", value: "fecha" },
      { text: "Hora", value: "hora" },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "action", sortable: false },
    ],
    noticias: [],
    editedIndex: -1,
    editedItem: {
      titulo: "",
      contenido: "",
      estado: true,
      img_principal: null,
    },
    defaultItem: {
      titulo: "",
      contenido: "",
      estado: true,
      img_principal: null,
    },
    DataUser: JSON.parse(localStorage.getItem("DataUser")) || false,
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      titulo: { required },
      contenido: { required },
    },
    ImgselectedUrl: { required },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva noticia" : "Editar noticia";
    },
    tituloErrors() {
      const errors = [];
      if (!this.$v.editedItem.titulo.$dirty) return errors;
      !this.$v.editedItem.titulo.required &&
        errors.push("Titulo es requerido.");
      return errors;
    },
    contenidoErrors() {
      const errors = [];
      if (!this.$v.editedItem.contenido.$dirty) return errors;
      !this.$v.editedItem.contenido.required &&
        errors.push("Contenido es requerido.");
      return errors;
    },
    ImgselectedUrlErrors() {
      const errors = [];
      if (!this.$v.ImgselectedUrl.$dirty) return errors;
      !this.$v.ImgselectedUrl.required && errors.push("Imagen es requerida.");
      return errors;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    $(document).ready(function () {});
  },

  methods: {
    ImageChange(e) {
      console.log(e);
      if (e) {
        this.Imgselected = e;
        this.ImgselectedUrl = URL.createObjectURL(this.Imgselected);
      } else {
        this.ImgselectedUrl = null;
        this.Imgselected = null;
      }
    },
    initialize() {
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/noticias" })
        .then((res) => {
          this.noticias = res;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },

    editItem(item) {
      this.editedIndex = this.noticias.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.ImgselectedUrl = this.editedItem.img_principal;
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
              "La noticia ha sido borrada.",
              "success"
            );
            let img_principal = item.img_principal.split("/");
            let folder = img_principal[img_principal.length - 3];
            let subfolder = img_principal[img_principal.length - 2];
            this.$store
              .dispatch("EliminarCrub", {
                Datos: item.id,
                EndPoint: "noticia/",
              })
              .then((res) => {
                const index = this.noticias.indexOf(item);
                this.noticias.splice(index, 1);
                this.$store
                  .dispatch("EliminarArchivo", { folder, subfolder })
                  .then((res) => {})
                  .catch((e) => {});
              })
              .catch((e) => {});
          }
        });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.ImgselectedUrl = null;
        this.Imgselected = null;
        this.$v.$reset();
      }, 300);
    },

    save() {
      this.loader = true;
      this.$v.$touch();
      console.log(this.$v);
      if (!this.$v.$error) {
        if (this.editedIndex > -1) {
          // Editando
          if (this.Imgselected) {
            let img_principal = this.editedItem.img_principal.split("/");
            let carpeta = img_principal[img_principal.length - 3];
            let subcarpeta = img_principal[img_principal.length - 2];
            let imgvieja = [img_principal[img_principal.length - 1]];
            const formData = new FormData();
            formData.append("archivo", this.Imgselected);
            this.$store
              .dispatch("EditarArchivo", {
                carpeta,
                subcarpeta,
                imgvieja,
                formData,
              })
              .then((res) => {
                var newstr = res.path
                  .replace("src", this.BaseUrlApi)
                  .replace("public", "");
                var newstr2 = newstr.replace(/\\/g, "/");
                this.editedItem.img_principal = newstr2;
                this.editedItem.autor =
                  this.DataUser.nombres.split(" ")[0] +
                  " " +
                  this.DataUser.apellidos.split(" ")[0];
                this.$store
                  .dispatch("EditarCrub", {
                    Datos: this.editedItem,
                    EndPoint: "noticia/",
                  })
                  .then((res) => {
                    Object.assign(this.noticias[this.editedIndex], res);
                    this.$swal.fire({
                      icon: "success",
                      title: "Genial",
                      text: "Ha sido modificada la noticia",
                    });
                    this.loader = false;
                    this.close();
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => {
                console.log(e.response);
              });
          } else {
            this.$store
              .dispatch("EditarCrub", {
                Datos: this.editedItem,
                EndPoint: "noticia/",
              })
              .then((res) => {
                Object.assign(this.noticias[this.editedIndex], res);
                this.$swal.fire({
                  icon: "success",
                  title: "Genial",
                  text: "Ha sido modificada la noticia",
                });
                this.ImgselectedUrl = null;
                this.Imgselected = null;
                this.close();
                this.loader = false;
              })
              .catch((e) => {
                console.log(e);
              });
          }
        } else {
          // Agregando
          const formData = new FormData();
          formData.append("archivo", this.Imgselected);
          var titulo = this.editedItem.titulo.replace(/ /g, "_");
          this.$store
            .dispatch("SubirArchivo", { formData, titulo, carpeta: "noticias" })
            .then((res) => {
              var nuevaRuta = res.path
                .replace("src", this.BaseUrlApi)
                .replace("public", "")
                .replace(/\\/g, "/");
              this.editedItem.img_principal = nuevaRuta;
              this.editedItem.autor_correo = this.DataUser.correo;
              this.editedItem.autor =
                this.DataUser.nombres.split(" ")[0] +
                " " +
                this.DataUser.apellidos.split(" ")[0];
              this.editedItem.img_autor = this.DataUser.foto;
              this.$store
                .dispatch("AgregarCrub", {
                  Datos: this.editedItem,
                  EndPoint: "/nueva-noticia",
                })
                .then((res) => {
                  this.noticias.push(res);
                  this.$swal.fire({
                    icon: "success",
                    title: "Genial",
                    text: "Ha sido agregada la noticia",
                  });
                  this.ImgselectedUrl = null;
                  this.Imgselected = null;
                  $("#imgprincipal").val("");
                  this.close();
                  this.loader = false;
                })
                .catch((e) => {
                  console.log(e);
                });
            })
            .catch((e) => {
              console.log(e.response);
            });
        }
      } else {
        this.loader = false;
      }
    },
  },
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
