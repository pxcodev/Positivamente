<template>
  <v-data-table
    :headers="headers"
    :items="jornadas"
    sort-by="calories"
    class="elevation-1"
  >
    <!-- Estado -->
    <template v-slot:item.estado="{ item }">
      <v-menu bottom offset-y>
        <template v-slot:activator="{ on }">
          <v-chip v-on="on" :color="getColorEst(item.estado)" dark>{{
            item.estado
          }}</v-chip>
        </template>
        <v-list>
          <v-list-item
            v-for="(estado, i) in estados"
            :key="i"
            @click="ModEstado(estado, item)"
          >
            <v-list-item-title>{{ estado }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <!-- fecha -->
    <template v-slot:item.fecha="{ item }">
      <v-chip light>{{ $store.getters.FechaFormateada(item.fecha) }}</v-chip>
    </template>
    <!-- Tabla header hora -->
    <template v-slot:item.hora="{ item }">
      <v-chip light>{{ $store.getters.HoraFormateada(item.hora) }}</v-chip>
    </template>
    <!-- tabla -->
    <template v-slot:top>
      <!-- Dialog visualizar jornada -->
      <v-dialog v-model="dialogAct" persistent width="600px">
        <v-card class="text-center">
          <v-icon
            class="float-right mr-2 mt-2"
            content="Salir"
            v-tippy="{ placement: 'left' }"
            color="red"
            @click="close"
            >$cancel</v-icon
          >
          <v-card-title>
            <span class="headline mx-auto">{{ editedItem.titulo }}</span>
          </v-card-title>
          <v-card-text class="text-justify">{{
            editedItem.descripcion
          }}</v-card-text>
          <v-card-text>
            <v-row>
              <v-col cols="6" class="text-center">
                <v-chip
                  class
                  color="principal"
                  content="Fecha"
                  v-tippy
                  outlined
                >
                  <v-icon left>$calendar</v-icon>
                  {{ $store.getters.FechaFormateada(editedItem.fecha) }}
                </v-chip>
              </v-col>
              <v-col cols="6">
                <v-chip
                  class="mr-2"
                  content="Hora"
                  v-tippy
                  color="principal"
                  outlined
                >
                  <v-icon left>$clock</v-icon>
                  {{ $store.getters.HoraFormateada(editedItem.hora) }}
                </v-chip>
              </v-col>
              <v-col cols="6">
                <v-chip
                  class="mr-2"
                  color="principal"
                  content="Cupos totales"
                  v-tippy
                  outlined
                >
                  <v-icon left>$users</v-icon>
                  {{ editedItem.cupos }}
                </v-chip>
              </v-col>
              <v-col cols="6">
                <v-chip
                  class="mr-2"
                  color="principal"
                  content="Ubicación"
                  v-tippy
                  outlined
                >
                  <v-icon left>$map</v-icon>
                  {{ editedItem.ubicacion }}
                </v-chip>
              </v-col>
              <v-col cols="6">
                <v-chip
                  class="mr-2"
                  content="Estado"
                  v-tippy
                  :color="getColorEst(editedItem.estado)"
                  outlined
                >
                  <v-icon left>$act</v-icon>
                  {{ editedItem.estado }}
                </v-chip>
              </v-col>
              <v-col cols="6">
                <v-chip
                  class="mr-2"
                  content="Cupos restantes"
                  v-tippy
                  color="principal"
                  outlined
                >
                  <v-icon left>$users</v-icon>
                  {{ editedItem.cuposrest }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog editar jornada -->
      <v-dialog v-model="dialog" width="1000px">
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
                <!-- Titulo -->
                <v-col cols="12" md="12">
                  <v-text-field
                    v-upfirstletter
                    color="principal"
                    v-model="editedItem.titulo"
                    label="Titulo"
                    :error-messages="tituloErrors"
                    required
                    @input="$v.editedItem.titulo.$touch()"
                    @blur="$v.editedItem.titulo.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Descripcion -->
                <v-col cols="12" md="12">
                  <v-textarea
                    color="principal"
                    counter
                    v-model="editedItem.descripcion"
                    label="Descripcion"
                    :error-messages="descripcionErrors"
                    required
                    @input="$v.editedItem.descripcion.$touch()"
                    @blur="$v.editedItem.descripcion.$touch()"
                  ></v-textarea>
                </v-col>
                <!-- Fecha -->
                <v-col cols="12" md="6">
                  <v-menu
                    v-model="Datepicker"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        color="principal"
                        :value="
                          $store.getters.FechaFormateada(editedItem.fecha)
                        "
                        clearable
                        label="Fecha de la jornada"
                        readonly
                        prepend-icon="$calendar"
                        v-on="on"
                        @click:clear="date = null"
                        :error-messages="fechaErrors"
                        required
                        @input="$v.editedItem.fecha.$touch()"
                        @blur="$v.editedItem.fecha.$touch()"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="principal"
                      :min="mindate"
                      v-model="editedItem.fecha"
                      @change="Datepicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Hora -->
                <v-col cols="12" md="6">
                  <v-menu
                    ref="menu"
                    v-model="HoraPicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="editedItem.hora"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        color="principal"
                        :value="$store.getters.HoraFormateada(editedItem.hora)"
                        label="Hora de la jornada"
                        prepend-icon="$clock"
                        readonly
                        v-on="on"
                        :error-messages="horaErrors"
                        required
                        @input="$v.editedItem.hora.$touch()"
                        @blur="$v.editedItem.hora.$touch()"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      color="principal"
                      v-if="HoraPicker"
                      v-model="editedItem.hora"
                      full-width
                      @click:minute="$refs.menu.save(editedItem.hora)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <!-- Ubicacion -->
                <v-col cols="12" md="4">
                  <v-text-field
                    v-capitalize
                    color="principal"
                    v-model="editedItem.ubicacion"
                    label="Ubicación"
                    :error-messages="ubicacionErrors"
                    required
                    @input="$v.editedItem.ubicacion.$touch()"
                    @blur="$v.editedItem.ubicacion.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Cupos -->
                <v-col cols="12" md="4">
                  <v-text-field
                    type="number"
                    color="principal"
                    v-model="editedItem.cupos"
                    label="Cupos disponibles"
                    :error-messages="cuposErrors"
                    required
                    @input="$v.editedItem.cupos.$touch()"
                    @blur="$v.editedItem.cupos.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Proyectos -->
                <!-- v-if="editedIndex == -1" -->
                <v-col cols="12" md="4">
                  <v-select
                    color="principal"
                    :hint="`${proyecto.nombre}, ${proyecto.id}`"
                    item-text="nombre"
                    item-value="id"
                    v-model="proyecto"
                    :items="proyectos"
                    label="Proyectos"
                    persistent-hint
                    return-object
                    single-line
                    :error-messages="proyectoErrors"
                    required
                    @input="$v.proyecto.$touch()"
                    @blur="$v.proyecto.$touch()"
                  ></v-select>
                </v-col>
              </v-row>
              <h1
                class="headline text-center"
                v-if="editedItem.estado == 'Finalizada'"
              >
                Subir galeria de jornada
                <v-btn
                  class="vcenter mt-2"
                  fab
                  dark
                  small
                  content="Agregar imagenes"
                  v-tippy
                  color="principal"
                  style="text-aling: center;"
                  @click="AggImagenes"
                >
                  <v-icon dark>$plus</v-icon>
                </v-btn>
                <input
                  multiple
                  @change="ImageChange($event.srcElement.files)"
                  accept="image/*"
                  label="File input"
                  id="inputhideen"
                  type="file"
                />
              </h1>
              <v-row
                v-if="
                  editedItem.estado == 'Finalizada' && editedItem.imagenes != ''
                "
              >
                <v-col
                  cols="12"
                  md="4"
                  v-for="(img, index) in editedImg"
                  :key="index"
                >
                  <v-icon
                    class="float-right"
                    content="Eliminar"
                    v-tippy="{ placement: 'top' }"
                    color="red"
                    @click="borrarimg(img, index)"
                    >$cancel</v-icon
                  >
                  <div id="preview">
                    <v-img
                      v-if="img"
                      :src="img"
                      aspect-ratio="1.4"
                      contain
                    ></v-img>
                  </div>
                  <v-file-input
                    color="principal"
                    @change="ImageChangeEdit($event, img, index)"
                    accept="image/*"
                    label="File input"
                    id="imgprincipal"
                  ></v-file-input>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  v-for="(imgurl, index) in ImgselectedUrl"
                  :key="index"
                >
                  <div id="preview">
                    <v-img
                      v-if="imgurl"
                      :src="imgurl"
                      aspect-ratio="1.4"
                      contain
                    ></v-img>
                  </div>
                </v-col>
              </v-row>
              <v-row v-else-if="editedItem.estado == 'Finalizada'">
                <!-- <v-col cols="12">
                  <v-file-input
                    multiple
                    color="principal"
                    @change="ImageChange($event)"
                    accept="image/*"
                    label="File input"
                    id="imgprincipal"
                  ></v-file-input>
                </v-col> -->

                <v-row>
                  <v-col
                    cols="12"
                    md="4"
                    v-for="(imgurl, index) in ImgselectedUrl"
                    :key="index"
                  >
                    <div id="preview">
                      <v-img
                        v-if="imgurl"
                        :src="imgurl"
                        aspect-ratio="1.4"
                        contain
                      ></v-img>
                    </div>
                  </v-col>
                </v-row>
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
            <!-- <v-btn class="ma-2"  tile outlined color="activo">
            </v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog marcar asistencia -->
      <v-dialog v-model="dialogAsis" persistent width="1000px">
        <v-card class="text-center">
          <v-icon
            class="float-right mr-2 mt-2"
            content="Salir"
            v-tippy="{ placement: 'left' }"
            color="red"
            @click="close"
            >$cancel</v-icon
          >
          <v-card-title>
            <span class="headline mx-auto">{{ editedItem.titulo }}</span>
          </v-card-title>
          <v-card-text>
            <!-- Tabla de asistencia -->
            <template>
              <v-data-iterator
                :items="inscripciones"
                :items-per-page.sync="itemsPerPage"
                :page="page"
                :search="search"
                :sort-by="sortBy.toLowerCase()"
                :sort-desc="sortDesc"
                hide-default-footer
              >
                <template v-slot:header>
                  <v-toolbar dark color="principal" class="mb-1">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          :rounded="true"
                          v-model="search"
                          clearable
                          flat
                          solo-inverted
                          hide-details
                          prepend-inner-icon="$search"
                          label="Buscar"
                          color="principal"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-toolbar>
                </template>

                <template v-slot:default="props">
                  <v-row>
                    <v-col
                      v-for="item in props.items"
                      :key="item.name"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <v-card
                        @click="AsistenciaVol(item)"
                        :color="item.asistencia ? 'activo' : ''"
                      >
                        <v-card-title
                          class="subheading font-weight-bold names text-center mx-auto"
                        >
                          <v-scroll-y-transition>
                            <v-icon
                              color="blue darken-3"
                              v-if="item.asistencia"
                              class="mr-1"
                              >$check</v-icon
                            >
                          </v-scroll-y-transition>
                          <span class="mx-auto">{{
                            item.nombres.split(" ")[0] +
                            " " +
                            item.apellidos.split(" ")[0]
                          }}</span>
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-list dense>
                          <v-list-item
                            v-for="(key, index) in filteredKeys"
                            :key="index"
                          >
                            <v-list-item-content
                              :class="{ 'black--text': sortBy === key }"
                              >{{ key }}:</v-list-item-content
                            >
                            <v-list-item-content
                              class="align-end"
                              :class="{ 'black--text': sortBy === key }"
                              >{{
                                item[key.toLowerCase()]
                              }}</v-list-item-content
                            >
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:footer>
                  <v-row class="mt-2" align="center" justify="center">
                    <span class="grey--text">Voluntarios por pagina</span>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          dark
                          text
                          color="principal"
                          class="ml-2"
                          v-on="on"
                        >
                          {{ itemsPerPage }}
                          <v-icon>$angle_down</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(number, index) in itemsPerPageArray"
                          :key="index"
                          @click="updateItemsPerPage(number)"
                        >
                          <v-list-item-title>{{ number }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                    <v-spacer></v-spacer>

                    <span class="mr-4 grey--text"
                      >Page {{ page }} of {{ numberOfPages }}</span
                    >
                    <v-btn
                      fab
                      dark
                      color="principal"
                      class="mr-1"
                      @click="formerPage"
                    >
                      <v-icon>$angle_left</v-icon>
                    </v-btn>
                    <v-btn
                      fab
                      dark
                      color="principal"
                      class="ml-1"
                      @click="nextPage"
                    >
                      <v-icon>$angle_right</v-icon>
                    </v-btn>
                  </v-row>
                </template>
              </v-data-iterator>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn class="ma-2" @click="close" tile outlined color="cancelado">
              <v-icon left>$cancel</v-icon>cancelar
            </v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog subir imagenes -->
      <v-dialog v-model="dialogimg" persistent width="800px">
        <v-card>
          <v-icon
            class="float-right mr-2 mt-2"
            content="Salir"
            v-tippy="{ placement: 'left' }"
            color="red"
            @click="close"
            >$cancel</v-icon
          >
          <v-card-title class="text-center">
            <span class="headline text-center">Subir galeria de jornada</span>
          </v-card-title>
          <v-card-text>
            <v-file-input
              multiple
              color="principal"
              @change="ImageChange($event)"
              accept="image/*"
              label="Seleccione imagenes"
              id="imgprincipal"
            ></v-file-input>
            <v-row>
              <v-col
                cols="12"
                md="12"
                lg="6"
                v-for="(imgurl, index) in ImgselectedUrl"
                :key="index"
              >
                <div id="preview">
                  <v-img
                    v-if="imgurl"
                    :src="imgurl"
                    aspect-ratio="1.4"
                    contain
                  ></v-img>
                  <!-- <img v-if="imgurl" :src="imgurl" /> -->
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loader"
              :disabled="loader"
              large
              @click="SubirImagenes"
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
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-toolbar flat color="white">
        <v-toolbar-title>Jornadas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <template>
          <v-btn color="principal" dark class="mb-2" @click="dialog = true"
            >Nueva jornada</v-btn
          >
        </template>
      </v-toolbar>
    </template>
    <!-- acciones -->
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
      <!--      <v-icon
        class="mr-2"
        content="Eliminar"
        v-tippy
        color="red"
        small
        @click="deleteItem(item)"
        >$delete</v-icon
      >-->
      <v-icon
        class="mr-2"
        content="Visualizar"
        v-tippy
        color="activo"
        small
        @click="VisualizarAct(item)"
        >$eye</v-icon
      >
      <v-icon
        content="Asistencia"
        v-tippy
        color="principal"
        small
        @click="AsistenciaAct(item)"
        >$hand</v-icon
      >
    </template>
    <template v-slot:no-data>
      <h1>No se encontraron jornadas</h1>
    </template>
  </v-data-table>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import { tippy } from "vue-tippy";
import moment from "moment";
moment.locale("es");
export default {
  data: () => ({
    joractestado: "",
    id_jor: 0,
    ready: false,
    loader: false,
    estados: ["Activa", "Finalizada", "Cancelada", "Desactivada"],
    mindate: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
    Datepicker: false,
    HoraPicker: false,
    BaseUrlApi: process.env.VUE_APP_RUTA_API,
    Imgselected: null,
    dialog: false,
    dialogAct: false,
    dialogAsis: false,
    dialogimg: false,
    headers: [
      {
        text: "Id",
        align: "left",
        sortable: false,
        value: "id",
      },
      { text: "Titulo", value: "titulo" },
      { text: "Fecha", value: "fecha" },
      { text: "Hora", value: "hora" },
      { text: "Cupos", value: "cupos" },
      { text: "Ubicación", value: "ubicacion" },
      { text: "Estado", value: "estado" },
      { text: "Acciones", value: "action", sortable: false },
    ],
    jornadas: [],
    editedIndex: -1,
    editedItem: {
      titulo: "",
      descripcion: "",
      extracto: "",
      fecha: null,
      hora: null,
      ubicacion: "",
      cupos: 0,
      id_p: 0,
      imagenes: [],
    },
    defaultItem: {
      titulo: "",
      descripcion: "",
      extracto: "",
      fecha: null,
      hora: null,
      ubicacion: "",
      cupos: 0,
      id_p: 0,
      imagenes: [],
    },
    editedImg: [],
    proyectos: [],
    proyecto: { nombre: "", id: "" },
    cuposaux: 0,
    inscripciones: [],
    itemsPerPageArray: [4, 8, 12],
    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 4,
    sortBy: "Nombres",
    keys: ["Nombres", "Apellidos", "Cedula", "Correo", "Asistencia"],
    Imgselected: [],
    Imgselectedaux: [],
    ImgselectedUrl: [],
    rutasimg: [],
    OldImag: [],
    RegEditImg: [],
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      titulo: { required },
      descripcion: { required },
      fecha: { required },
      hora: { required },
      ubicacion: { required },
      cupos: { required },
    },
    proyecto: {
      nombre: { required },
      id: { required },
    },
  },
  computed: {
    tituloErrors() {
      const errors = [];
      if (!this.$v.editedItem.titulo.$dirty) return errors;
      !this.$v.editedItem.titulo.required &&
        errors.push("Titulo es requerido.");
      return errors;
    },
    descripcionErrors() {
      const errors = [];
      if (!this.$v.editedItem.descripcion.$dirty) return errors;
      !this.$v.editedItem.descripcion.required &&
        errors.push("Descripción es requerida.");
      return errors;
    },
    horaErrors() {
      const errors = [];
      if (!this.$v.editedItem.hora.$dirty) return errors;
      !this.$v.editedItem.hora.required && errors.push("Hora es requerida.");
      return errors;
    },
    fechaErrors() {
      const errors = [];
      if (!this.$v.editedItem.fecha.$dirty) return errors;
      !this.$v.editedItem.fecha.required && errors.push("Fecha es requerida.");
      return errors;
    },
    ubicacionErrors() {
      const errors = [];
      if (!this.$v.editedItem.ubicacion.$dirty) return errors;
      !this.$v.editedItem.ubicacion.required &&
        errors.push("Ubicación es requerida.");
      return errors;
    },
    cuposErrors() {
      const errors = [];
      if (!this.$v.editedItem.cupos.$dirty) return errors;
      !this.$v.editedItem.cupos.required && errors.push("Cupos es requerido.");
      return errors;
    },
    proyectoErrors() {
      const errors = [];
      if (!this.$v.proyecto.$dirty) return errors;
      !this.$v.proyecto.id.required && errors.push("Proyecto es requerido.");
      return errors;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nueva jornada" : "Editar jornada";
    },
    numberOfPages() {
      return Math.ceil(this.inscripciones.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== `Nombres`);
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {},
  mounted() {
    this.$store
      .dispatch("GeneralGet", { EndPoint: "/proyectos" })
      .then((resp) => {
        resp.forEach((element) => {
          this.proyectos.push({ nombre: element.titulo_p, id: element.id_p });
        });
      });
    this.$socket.client.emit("ActsIniciales");
  },
  sockets: {
    connect() {
      console.log("socket conectado");
    },
    ActsIniciales(val) {
      var aux = val;
      for (let i = 0; i < aux.length; i++) {
        aux[i].fecha = moment(aux[i].fecha).format("YYYY-MM-DD");
      }
      this.jornadas = aux;
    },
    NuevaAct(val) {
      this.jornadas.push(val);
      this.$swal.fire({
        icon: "success",
        title: "Genial",
        text: "Ha sido agregada la Jornada",
      });
      this.close();
      this.loader = false;
      this.$socket.client.emit("EnviarCorreos");
    },
    EnviarCorreos(val) {
      if (val.cod == -5) {
        this.$swal
          .fire({
            title: "Jornada agregada",
            text: "Pero no han sido enviados los correos",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Volver a enviar!",
            cancelButtonText: "No",
          })
          .then((result) => {
            if (result.value) {
              this.$socket.client.emit("EnviarCorreos");
            } else if (result.dismiss === "cancel") {
              console.log("Envio de correos cancelada");
            }
          });
      } else if (val.cod == -6) {
        this.$swal.fire({
          icon: "warning",
          title: "Jornada agregada",
          text:
            "Pero no fueron enviados los correos, no hay voluntarios registrados",
        });
      } else {
        this.$swal.fire({
          icon: "success",
          title: "Genial, jornada agregada",
          text: "Han sido enviados los correos",
        });
      }
    },
    EditarAct(val) {
      this.jornadas = val;
      var foundIndex = val.findIndex((acts) => acts.id == this.editedItem.id);
      this.editedItem = Object.assign({}, val[foundIndex]);
    },
    EliminarAct(val) {
      this.jornadas = val;
    },
    VerAct(val) {
      this.editedItem = Object.assign({}, val);
    },
    Inscripciones(val) {
      this.inscripciones = val;
    },
    VolParticipando(val) {
      this.$socket.client.emit("Inscripciones", { jornada: this.editedItem });
    },
    MarcarAsistenciaVol(val) {
      var foundIndex = this.inscripciones.findIndex(
        (ins) => ins.correo == val.correo
      );
      Object.assign(this.inscripciones[foundIndex], val);
    },
  },
  methods: {
    AggImagenes() {
      $("#inputhideen").click();
    },
    AsistenciaVol(voluntario) {
      if (this.joractestado == "En Proceso") {
        voluntario.asistencia = voluntario.asistencia == 1 ? 0 : 1;
        this.$socket.client.emit("MarcarAsistenciaVol", { voluntario });
      } else {
        this.$swal.fire({
          icon: "warning",
          title: "¡Espera!",
          text: "La jornada debe estar en proceso para marcar asistencias",
        });
      }
    },
    AsistenciaAct(item) {
      this.joractestado = item.estado;
      this.$socket.client.emit("VerAct", { jornada: item });
      this.$socket.client.emit("Inscripciones", { jornada: item });
      this.dialogAsis = true;
    },
    VisualizarAct(item) {
      // Visualizar jornada
      this.$socket.client.emit("VerAct", { jornada: item });
      this.dialogAct = true;
    },
    ModEstado(estado, item) {
      // Modificar estado de la jornada

      if (
        estado == "Finalizada" &&
        item.estado == "Finalizada" &&
        item.imagenes == "" &&
        item.estado != "En Proceso"
      ) {
        this.dialogimg = true;
        this.cuposaux = item.cupos;
        this.editedItem = Object.assign({}, item);
      }
      item.estado = estado;
      this.$socket.client.emit("EditarAct", {
        jornada: item,
      });
    },
    SubirImagenes() {
      if (this.Imgselected || this.Imgselectedaux) {
        this.Imgselectedaux.forEach((element) => {
          this.Imgselected.push(element);
        });
        const formData = new FormData();
        for (let i = 0; i < this.Imgselected.length; i++) {
          formData.append(`archivos`, this.Imgselected[i]);
        }
        var imgedit = [];
        var subcarpeta = "";

        if (this.editedItem.imagenes != "") {
          let base = this.editedItem.imagenes.split(",")[0].split("/");
          subcarpeta = base[base.length - 2];
          if (this.OldImag.length > 0) {
            this.OldImag.forEach((element) => {
              var imgact = element.split("/");
              imgedit.push([imgact[imgact.length - 1]]);
            });
          }
        } else {
          subcarpeta = this.editedItem.titulo.replace(/ /g, "_") + moment();
        }

        this.$store
          .dispatch("SubirArchivos", {
            formData,
            carpeta: "jornadas",
            subcarpeta,
            id_jornada: this.editedItem.id,
            imgedit: String(imgedit),
          })
          .then((res) => {
            this.rutasimg = res;
            this.editedItem.imagenes = this.rutasimg;

            if (this.cuposaux != this.editedItem.cupos) {
              var cuposocupados = this.cuposaux - this.editedItem.cuposrest;
              this.editedItem.cuposrest = this.editedItem.cupos - cuposocupados;
            }

            if (this.proyecto.id != 0) {
              this.editedItem.id_p = this.proyecto.id;
              this.editedItem.titulo_p = this.proyecto.nombre;
            }

            this.editedItem.extracto = this.editedItem.descripcion.substring(
              0,
              100
            );
            this.$socket.client.emit("EditarAct", {
              jornada: this.editedItem,
            });
            this.$swal.fire({
              icon: "success",
              title: "Genial",
              text: "Ha sido modificada la Jornada",
            });
            this.close();
            this.loader = false;
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Espera",
          text: "Selecciona al menos una imagen",
        });
      }
    },
    ImageChange(e) {
      console.log(e);
      this.ImgselectedUrl = [];
      this.Imgselectedaux = [];
      if (e) {
        this.Imgselectedaux = e;
        this.Imgselectedaux.forEach((element) => {
          this.ImgselectedUrl.push(URL.createObjectURL(element));
        });
      } else {
        this.ImgselectedUrl = {};
        this.Imgselectedaux = [];
      }
      console.log(this.ImgselectedUrl);
    },
    ImageChangeEdit(img, OldImag, index) {
      var test = [];
      if (this.RegEditImg.indexOf(index) == -1) {
        this.RegEditImg.push(index);
        this.Imgselected.push(img);
        this.OldImag.push(OldImag);
      } else {
        // this.editedImg[index] = URL.createObjectURL(img);
        this.Imgselected[this.RegEditImg.indexOf(index)] = img;
      }
      this.editedImg[index] = URL.createObjectURL(img);

      this.ImgselectedUrl.push(URL.createObjectURL(img));
      this.ImgselectedUrl.pop();
      // if (img) {
      //   this.RegEditImg.push(index);
      //   this.editedImg[index] = URL.createObjectURL(img);
      //   this.Imgselected.push(img);
      //   this.OldImag.push(OldImag);
      //   this.Imgselected.forEach(element => {
      //     this.ImgselectedUrl.push(URL.createObjectURL(element));
      //   });
      // }
    },
    getColorEst(estado) {
      switch (estado) {
        case "Activa":
          return "activo";
          break;
        case "En Proceso":
          return "proceso";
          break;
        case "Agotado":
          return "warning";
          break;
        case "Proximamente":
          return "default";
          break;
        case "Finalizada":
          return "finalizada";
          break;
        default:
          return "cancelado";
          break;
      }
    },
    getColorIns(Ins) {
      if (Ins == "Inscrito") return "principal";
      else return "cancelado";
    },
    editItem(item) {
      this.cuposaux = item.cupos;
      this.editedIndex = this.jornadas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      if (this.editedItem.imagenes.length > 0) {
        this.editedImg = this.editedItem.imagenes.split(",");
      }
      this.proyecto = {
        nombre: this.editedItem.titulo_p,
        id: this.editedItem.id_p,
      };
      this.cuposaux = this.editedItem.cupos;
      this.dialog = true;
    },
    deleteItem(item) {
      // Borrar jornada
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
            this.$socket.client.emit("EliminarAct", { jornada: item });
            this.$swal.fire(
              "Borrado!",
              "La jornada ha sido borrada.",
              "success"
            );
          }
        });
    },
    close() {
      // Cerrar modal y reiniciar variables
      this.dialog = false;
      this.dialogAct = false;
      this.dialogAsis = false;
      this.dialogimg = false;
      this.loader = false;
      this.ImgselectedUrl = [];
      this.Imgselected = [];
      this.OldImag = [];
      this.rutasimg = [];
      this.RegEditImg = [];
      this.editedImg = [];
      this.Imgselectedaux = [];
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.proyecto = { nombre: "", id: "" };
        this.cuposaux = 0;
        this.$v.$reset();
      }, 300);
    },
    save() {
      this.$v.$touch();
      if (!this.$v.$error) {
        this.loader = true;
        if (this.editedIndex > -1) {
          // Editando jornada
          var cuposocupados = this.cuposaux - this.editedItem.cuposrest;
          if (cuposocupados > this.editedItem.cupos) {
            this.$swal.fire({
              icon: "error",
              title: "¡Espera!",
              text:
                "La cantidad de cupos que ingresaste es inferior a las personas ya inscritas",
            });
            this.loader = false;
          } else {
            if (
              this.Imgselected.length > 0 ||
              this.Imgselectedaux.length > 0 ||
              this.OldImag.length > 0
            ) {
              this.SubirImagenes();
            } else {
              if (this.cuposaux != this.editedItem.cupos) {
                var cuposocupados = this.cuposaux - this.editedItem.cuposrest;
                this.editedItem.cuposrest =
                  this.editedItem.cupos - cuposocupados;
              }

              this.editedItem.id_p = this.proyecto.id;
              this.editedItem.titulo_p = this.proyecto.nombre;
              this.editedItem.extracto = this.editedItem.descripcion.substring(
                0,
                100
              );
              this.$socket.client.emit("EditarAct", {
                jornada: this.editedItem,
              });
              this.$swal.fire({
                icon: "success",
                title: "Genial",
                text: "Ha sido modificada la Jornada",
              });
              this.close();
              this.loader = false;
            }
          }
        } else {
          // Agregar jornada
          this.editedItem.imagenes = [];
          this.editedItem.id = 0;
          this.editedItem.id_p = this.proyecto.id;
          this.editedItem.titulo_p = this.proyecto.nombre;
          this.editedItem.extracto = this.editedItem.descripcion.substring(
            0,
            100
          );
          this.editedItem.estado = "Activa";
          this.editedItem.inscripcion = "No Inscrito";
          this.editedItem.cuposrest = this.editedItem.cupos;
          this.$socket.client.emit("NuevaAct", { jornada: this.editedItem });
        }
      }
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    borrarimg(img, index) {
      this.OldImag.push(img);
      var indice = this.editedImg.indexOf(img);
      this.editedImg.splice(indice, 1);
    },
  },
};
</script>

<style scoped>
#inputhideen {
  position: absolute;
  top: -1000px;
}
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview img {
  max-width: 50%;
  max-height: 500px;
  height: 200px;
  width: 200px;
}
</style>
