<template>
  <div>
    <h1 class="text-center mb-3">Seleccione que desea consultar</h1>
    <v-item-group active-class="activa">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-item
              v-slot:default="{ active, toggle }"
              @change="CambiarTipo('proyectos')"
            >
              <v-card
                :color="active ? 'principal' : ''"
                class="d-flex align-center"
                dark
                height="200"
                @click="toggle"
              >
                <div v-if="!active" class="display-2 flex-grow-1 text-center">
                  Proyectos
                </div>
                <v-scroll-y-transition @change="proyectos">
                  <img
                    v-if="active"
                    height="200"
                    src="@/assets/proyectos.png"
                    alt
                    class="mx-auto"
                  />
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
          <v-col cols="12" md="4">
            <v-item
              v-slot:default="{ active, toggle }"
              @change="CambiarTipo('jornadas')"
            >
              <v-card
                :color="active ? 'principal' : ''"
                class="d-flex align-center"
                dark
                height="200"
                @click="toggle"
              >
                <div v-if="!active" class="display-2 flex-grow-1 text-center">
                  Jornadas
                </div>
                <v-scroll-y-transition>
                  <img
                    v-if="active"
                    height="200"
                    src="@/assets/jornadas.png"
                    alt
                    class="mx-auto"
                  />
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
          <v-col cols="12" md="4">
            <v-item
              v-slot:default="{ active, toggle }"
              @change="CambiarTipo('voluntarios')"
            >
              <v-card
                :color="active ? 'principal' : ''"
                class="d-flex align-center"
                dark
                height="200"
                @click="toggle"
              >
                <div v-if="!active" class="display-2 flex-grow-1 text-center">
                  Voluntarios
                </div>
                <v-scroll-y-transition>
                  <img
                    v-if="active"
                    height="200"
                    src="@/assets/voluntarios.png"
                    alt
                    class="mx-auto"
                  />
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <!-- PROYECTOS -->
    <v-sheet v-if="proye" class="pa-12" color="grey lighten-3">
      <!-- dialog jornadas -->
      <v-dialog v-model="dialogjor" width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">Jornadas registradas</span>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headJornadasdialog"
              :items="jornadaact.jornadas"
              :items-per-page="5"
              class="elevation-1"
            ></v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="ma-2"
              @click="dialogjor = false"
              tile
              outlined
              color="cancelado"
            >
              <v-icon left>$cancel</v-icon>Salir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div>
        <h1 class="text-center">Proyectos</h1>
      </div>
      <v-container>
        <v-row>
          <!-- Fecha inicial -->
          <v-col cols="12" md="6">
            <v-menu
              v-model="Datepicker"
              :close-on-content-click="false"
              max-width="290"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  color="principal"
                  :value="$store.getters.FechaFormateada(fechaInicial)"
                  clearable
                  label="Fecha inicial"
                  readonly
                  prepend-icon="$calendar"
                  v-on="on"
                  @click:clear="date = null"
                  :error-messages="fechaInicialErrors"
                  required
                  @input="$v.fechaInicial.$touch()"
                  @blur="$v.fechaInicial.$touch()"
                ></v-text-field>
              </template>
              <v-date-picker
                color="principal"
                :min="mindate"
                v-model="fechaInicial"
                @change="Datepicker = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- Fecha final -->
          <v-scroll-y-transition>
            <v-col cols="12" md="6">
              <v-menu
                v-model="Datepicker"
                :close-on-content-click="false"
                max-width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    color="principal"
                    :value="$store.getters.FechaFormateada(fechaFinal)"
                    clearable
                    label="Fecha final"
                    readonly
                    prepend-icon="$calendar"
                    v-on="on"
                    @click:clear="date = null"
                    :error-messages="fechaFinalErrors"
                    required
                    @input="$v.fechaFinal.$touch()"
                    @blur="$v.fechaFinal.$touch()"
                  ></v-text-field>
                </template>
                <v-date-picker
                  color="principal"
                  :min="fechaInicial"
                  v-model="fechaFinal"
                  @change="Datepicker = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-scroll-y-transition>
        </v-row>
        <div class="text-center">
          <v-btn
            @click="ConsultarProyectos"
            color="principal"
            fab
            dark
            content="Realizar busqueda"
            v-tippy
            class="mr-5"
          >
            <v-icon>$search</v-icon>
          </v-btn>
          <v-scroll-x-reverse-transition>
            <v-btn
              @click="ExportarPro"
              color="cancelado"
              content="Exportar PDF"
              v-tippy
              fab
              dark
              v-if="busqueda"
            >
              <v-icon>$pdf</v-icon>
            </v-btn>
          </v-scroll-x-reverse-transition>
        </div>
      </v-container>
      <!-- TABLA -->
      <v-scroll-y-transition>
        <v-data-table
          :headers="headProyectos"
          :items="proyectos"
          sort-by="calories"
          class="elevation-1"
          id="tab_proyectos"
          v-if="busqueda"
        >
          <!-- fecha -->
          <template v-slot:item.fecha="{ item }">
            <v-chip light>{{ item.fecha }}</v-chip>
          </template>
          <!-- Tabla header hora -->
          <template v-slot:item.hora="{ item }">
            <v-chip light>{{
              $store.getters.HoraFormateada(item.hora)
            }}</v-chip>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip v-on="on" :color="getColorEst(item.estado)" dark>{{
              item.estado
            }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              content="Ver jornadas"
              v-tippy
              color="principal"
              small
              @click="Verjornadas(item)"
              >$act</v-icon
            >
          </template>
          <template v-slot:no-data>
            <h1>No se encontraron resultados</h1>
          </template>
        </v-data-table>
      </v-scroll-y-transition>
    </v-sheet>
    <!-- JORNADAS -->
    <v-sheet v-if="jorna" class="pa-12" color="grey lighten-3">
      <!-- dialog voluntarios -->
      <v-dialog v-model="dialog" width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">Voluntarios registrados</span>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headVoluntariosdialog"
              :items="voluntarios"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.asistencia="{ item }">{{
                item.asistencia == 0 ? "Inasistente" : "Confirmada"
              }}</template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="ma-2"
              @click="dialog = false"
              tile
              outlined
              color="cancelado"
            >
              <v-icon left>$cancel</v-icon>Salir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div>
        <h1 class="text-center">Jornadas</h1>
      </div>

      <!-- SELECTORES -->
      <v-container>
        <v-row>
          <!-- Fecha inicial -->
          <v-col cols="12" md="6">
            <v-menu
              v-model="Datepicker"
              :close-on-content-click="false"
              max-width="290"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  color="principal"
                  :value="$store.getters.FechaFormateada(fechaInicial)"
                  clearable
                  label="Fecha inicial"
                  readonly
                  prepend-icon="$calendar"
                  v-on="on"
                  @click:clear="date = null"
                  :error-messages="fechaInicialErrors"
                  required
                  @input="$v.fechaInicial.$touch()"
                  @blur="$v.fechaInicial.$touch()"
                ></v-text-field>
              </template>
              <v-date-picker
                color="principal"
                :min="mindate"
                v-model="fechaInicial"
                @change="Datepicker = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- Fecha final -->
          <v-scroll-y-transition>
            <v-col cols="12" md="6" v-if="fechaInicial">
              <v-menu
                v-model="Datepicker"
                :close-on-content-click="false"
                max-width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    color="principal"
                    :value="$store.getters.FechaFormateada(fechaFinal)"
                    clearable
                    label="Fecha final"
                    readonly
                    prepend-icon="$calendar"
                    v-on="on"
                    @click:clear="date = null"
                    :error-messages="fechaFinalErrors"
                    required
                    @input="$v.fechaFinal.$touch()"
                    @blur="$v.fechaFinal.$touch()"
                  ></v-text-field>
                </template>
                <v-date-picker
                  color="principal"
                  :min="fechaInicial"
                  v-model="fechaFinal"
                  @change="Datepicker = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-scroll-y-transition>
          <!-- Proyectos -->
          <v-scroll-y-transition>
            <v-col cols="12" md="6" v-if="fechaFinal">
              <v-select
                color="principal"
                item-text="nombre"
                item-value="id"
                v-model="proyecto"
                :items="proyectosSelect"
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
          </v-scroll-y-transition>
          <!-- Asistencia -->
          <v-col cols="12" md="6" v-if="proyecto.nombre">
            <v-select
              color="principal"
              item-text="nombre"
              item-value="id"
              v-model="asistencia"
              :items="asistencias"
              label="Asistencia"
              persistent-hint
              return-object
              single-line
              :error-messages="asistenciaErrors"
              required
              @input="$v.asistencia.$touch()"
              @blur="$v.asistencia.$touch()"
            ></v-select>
          </v-col>
        </v-row>
        <div class="text-center">
          <v-btn
            @click="ConsultarJornadas"
            color="principal"
            fab
            dark
            content="Realizar busqueda"
            v-tippy
            class="mr-5"
          >
            <v-icon>$search</v-icon>
          </v-btn>
          <v-scroll-x-reverse-transition>
            <v-btn
              @click="ExportarJor"
              color="cancelado"
              content="Exportar PDF"
              v-tippy
              fab
              dark
              v-if="busqueda"
            >
              <v-icon>$pdf</v-icon>
            </v-btn>
          </v-scroll-x-reverse-transition>
        </div>
      </v-container>
      <!-- TABLA -->
      <v-scroll-y-transition>
        <v-data-table
          :headers="headJornadas"
          :items="jornadas"
          sort-by="calories"
          class="elevation-1"
          id="tab_jornadas"
          v-if="busqueda"
        >
          <!-- fecha -->
          <template v-slot:item.fecha="{ item }">
            <v-chip light>{{ item.fecha }}</v-chip>
          </template>
          <!-- Tabla header hora -->
          <template v-slot:item.hora="{ item }">
            <v-chip light>{{
              $store.getters.HoraFormateada(item.hora)
            }}</v-chip>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip v-on="on" :color="getColorEst(item.estado)" dark>{{
              item.estado
            }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              content="Ver voluntarios"
              v-tippy
              color="principal"
              small
              @click="VerVoluntarios(item)"
              >$hand</v-icon
            >
          </template>
          <template v-slot:no-data>
            <h1>No se encontraron resultados</h1>
          </template>
        </v-data-table>
      </v-scroll-y-transition>
    </v-sheet>
    <!-- VOLUNTARIOS -->
    <v-sheet v-if="volun" class="pa-12" color="grey lighten-3">
      <div>
        <h1 class="text-center">Voluntarios</h1>
      </div>
      <!-- dialog jornadas -->
      <v-dialog v-model="dialogjorvol" width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">Jornadas inscritas</span>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headJornadasdialogvol"
              :items="jornadaact.jornadas"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.asistencia="{ item }">{{
                item.asistencia == 0 ? "Inasistente" : "Confirmada"
              }}</template>
              <template v-slot:item.fecha="{ item }">{{
                $store.getters.FechaFormateada(item.fecha)
              }}</template>
              <template v-slot:item.hora="{ item }">{{
                $store.getters.HoraFormateada(item.hora)
              }}</template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="ma-2"
              @click="dialogjorvol = false"
              tile
              outlined
              color="cancelado"
            >
              <v-icon left>$cancel</v-icon>Salir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-container>
        <div class="text-center">
          <v-btn
            @click="ConsultarVoluntarios"
            color="principal"
            fab
            dark
            content="Realizar busqueda"
            v-tippy
            class="mr-5"
          >
            <v-icon>$search</v-icon>
          </v-btn>
          <v-scroll-x-reverse-transition>
            <v-btn
              @click="ExportarVol"
              color="cancelado"
              content="Exportar PDF"
              v-tippy
              fab
              dark
              v-if="busqueda"
            >
              <v-icon>$pdf</v-icon>
            </v-btn>
          </v-scroll-x-reverse-transition>
        </div>
      </v-container>
      <!-- TABLA -->
      <v-scroll-y-transition>
        <v-data-table
          :headers="headVoluntarios"
          :items="voluntarios"
          sort-by="calories"
          class="elevation-1"
          id="tab_proyectos"
          v-if="busqueda"
        >
          <!-- fecha -->
          <template v-slot:item.fecha="{ item }">
            <v-chip light>{{ item.fecha }}</v-chip>
          </template>
          <!-- Tabla header hora -->
          <template v-slot:item.hora="{ item }">
            <v-chip light>{{
              $store.getters.FechaFormateadacorta(item.hora)
            }}</v-chip>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip v-on="on" :color="getColorEst(item.estado)" dark>{{
              item.estado
            }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              content="Ver jornadas"
              v-tippy
              color="principal"
              small
              @click="Verjornadas(item)"
              >$hand</v-icon
            >
          </template>
          <template v-slot:no-data>
            <h1>No se encontraron resultados</h1>
          </template>
        </v-data-table>
      </v-scroll-y-transition>
    </v-sheet>

    <table
      id="tab_voluntarios"
      class="table table-striped"
      style="display: none;"
    >
      <thead>
        <tr class="warning">
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Correo</th>
          <th>Inscripción</th>
          <th>Asistencia</th>
          <th>Id Jornada</th>
        </tr>
      </thead>
      <tbody v-for="jor in jornadas" :key="jor">
        <tr v-for="v in jor.voluntarios" :key="v">
          <td>{{ v.nombres }}</td>
          <td>{{ v.apellidos }}</td>
          <td>{{ v.correo }}</td>
          <td>{{ v.inscripcion }}</td>
          <td>{{ v.asistencia == 0 ? "Inasistente" : "Confirmado" }}</td>
          <td>{{ v.id_jornada }}</td>
        </tr>
      </tbody>
    </table>

    <table id="tab_jornadas" class="table table-striped" style="display: none;">
      <thead>
        <tr class="warning">
          <th>Id</th>
          <th>Id Proy</th>
          <th>Titulo</th>
          <th>Fecha</th>
          <th>Cupos</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody v-for="pro in proyectos" :key="pro">
        <tr v-for="j in pro.jornadas" :key="j">
          <td>{{ j.id }}</td>
          <td>{{ j.id_p }}</td>
          <td>{{ j.titulo }}</td>
          <td>{{ $store.getters.FechaFormateadacorta(j.fecha) }}</td>
          <td>{{ j.cupos }}</td>
          <td>{{ j.estado }}</td>
        </tr>
      </tbody>
    </table>

    <table
      id="tab_jornadasvol"
      class="table table-striped"
      style="display: none;"
    >
      <thead>
        <tr class="warning">
          <th>Correo</th>
          <th>Id</th>
          <th>Titulo</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Estado</th>
          <th>Asistencia</th>
        </tr>
      </thead>
      <tbody v-for="vol in voluntarios" :key="vol">
        <tr v-for="j in vol.jornadas" :key="j">
          <td>{{ j.correo }}</td>
          <td>{{ j.id }}</td>
          <td>{{ j.titulo }}</td>
          <td>{{ $store.getters.FechaFormateadacorta(j.fecha) }}</td>
          <td>{{ $store.getters.HoraFormateada(j.hora) }}</td>
          <td>{{ j.estado }}</td>
          <td>{{ j.asistencia == 0 ? "Inasistente" : "Confirmada" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import moment from "moment";
import jspdf from "jspdf";
import "jspdf-autotable";
export default {
  data() {
    return {
      dialog: false,
      dialogjor: false,
      dialogjorvol: false,
      headJornadas: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Titulo", value: "titulo" },
        { text: "Fecha", value: "fecha" },
        { text: "Hora", value: "hora" },
        { text: "Proyecto", value: "titulo_p" },
        { text: "Tot.Volun", value: "tvoluntarios" },
        { text: "Estado", value: "estado" },
        { text: "Cupos", value: "cupos" },
        { text: "Acciones", value: "action", sortable: false },
      ],
      headProyectos: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id_p",
        },
        { text: "Titulo", value: "titulo_p" },
        { text: "Fecha", value: "fecha" },
        { text: "Hora", value: "hora" },
        { text: "Acciones", value: "action", sortable: false },
      ],
      headVoluntarios: [
        {
          text: "Correo",
          align: "start",
          sortable: false,
          value: "correo",
        },
        { text: "Nombres", value: "nombres" },
        { text: "Apellidos", value: "apellidos" },
        { text: "Cedula", value: "cedula" },
        { text: "Dirección", value: "direccion" },
        { text: "Ocupación", value: "ocupacion" },
        { text: "Acciones", value: "action", sortable: false },
      ],
      headJornadasdialog: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Titulo", value: "titulo" },
        { text: "Fecha", value: "fecha" },
        { text: "Hora", value: "hora" },
        { text: "Estado", value: "estado" },
        { text: "Cupos", value: "cupos" },
      ],
      headJornadasdialogvol: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Titulo", value: "titulo" },
        { text: "Fecha", value: "fecha" },
        { text: "Hora", value: "hora" },
        { text: "Estado", value: "estado" },
        { text: "Asistencia", value: "asistencia" },
      ],
      headVoluntariosdialog: [
        { text: "Correo", value: "correo" },
        { text: "Apellidos", value: "apellidos" },
        { text: "Cedula", value: "cedula" },
        { text: "Estado", value: "estado" },
        { text: "Asistencia", value: "asistencia" },
      ],
      jornadas: [],
      jornadaact: [],
      voluntarios: [],
      proyectosSelect: [],
      proyectos: [],
      asistencias: [
        { nombre: "Todos", id: -1 },
        { nombre: "Confirmadas", id: 1 },
        { nombre: "Inasistentes", id: 0 },
      ],
      proyecto: { nombre: null, id: null },
      asistencia: { nombre: null, id: null },
      proye: false,
      jorna: false,
      volun: false,
      fechaInicial: null,
      fechaFinal: null,
      busqueda: false,
      DClaves: [],
    };
  },
  mixins: [validationMixin],
  validations: {
    fechaInicial: { required },
    fechaFinal: { required },
    proyecto: {
      nombre: { required },
      id: { required },
    },
    asistencia: {
      nombre: { required },
      id: { required },
    },
  },
  mounted() {
    this.$store
      .dispatch("GeneralGet", { EndPoint: "/proyectos" })
      .then((resp) => {
        this.proyectosSelect.push({ nombre: "Todos", id: 0 });
        resp.forEach((element) => {
          this.proyectosSelect.push({
            nombre: element.titulo_p,
            id: element.id_p,
          });
        });
      });
  },
  computed: {
    fechaInicialErrors() {
      const errors = [];
      if (!this.$v.fechaInicial.$dirty) return errors;
      !this.$v.fechaInicial.required &&
        errors.push("Fecha Inicial es requerida.");
      return errors;
    },
    fechaFinalErrors() {
      const errors = [];
      if (!this.$v.fechaFinal.$dirty) return errors;
      !this.$v.fechaFinal.required && errors.push("Fecha final es requerida.");
      return errors;
    },
    proyectoErrors() {
      const errors = [];
      if (!this.$v.proyecto.$dirty) return errors;
      !this.$v.proyecto.id.required && errors.push("Proyecto es requerido.");
      return errors;
    },
    asistenciaErrors() {
      const errors = [];
      if (!this.$v.asistencia.$dirty) return errors;
      !this.$v.asistencia.id.required &&
        errors.push("Asistencia es requerida.");
      return errors;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {},
  methods: {
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
    CambiarTipo(tipo) {
      this.fechaInicial = null;
      this.fechaFinal = null;
      this.$v.$reset();
      this.jornadas = [];
      this.proyectos = [];
      this.busqueda = false;
      this.proyecto = { nombre: null, id: null };
      switch (tipo) {
        case "proyectos":
          this.proye = !this.proye;
          this.jorna = false;
          this.volun = false;
          break;
        case "jornadas":
          this.proye = false;
          this.jorna = !this.jorna;
          this.volun = false;
          break;
        case "voluntarios":
          this.proye = false;
          this.jorna = false;
          this.volun = !this.volun;
          break;
      }
    },
    ConsultarJornadas() {
      this.busqueda = false;
      this.jornadas = [];
      this.$v.$touch();
      if (!this.$v.$error) {
        this.$v.$reset();
        this.$store
          .dispatch("GeneralPost", {
            Datos: {
              fechaInicial: this.fechaInicial,
              fechaFinal: this.fechaFinal,
              id_p: this.proyecto.id,
              asistencia: this.asistencia.id,
            },
            EndPoint: "/fechjornadas",
          })
          .then((res) => {
            this.jornadas = res.jornadas;
            this.DClaves = res.DClaves;
            this.busqueda = true;
          })
          .catch((e) => {
            console.log(e.response);
          });
      }
    },
    ConsultarProyectos() {
      this.busqueda = false;
      this.proyectos = [];

      this.$v.$reset();
      this.$store
        .dispatch("GeneralPost", {
          Datos: {
            fechaInicial: this.fechaInicial,
            fechaFinal: this.fechaFinal,
          },
          EndPoint: "fechproyectos",
        })
        .then((res) => {
          this.proyectos = res;
          this.busqueda = true;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    ConsultarVoluntarios() {
      this.busqueda = false;
      this.voluntarios = [];
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/voluntarios" })
        .then((res) => {
          this.voluntarios = res;
          this.busqueda = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    Verjornadas(item) {
      this.jornadaact = item;
      this.dialogjor = true;
      this.dialogjorvol = true;
    },
    VerVoluntarios(item) {
      this.$store
        .dispatch("GeneralGet", {
          EndPoint: `/inscripciones/${item.id}/${this.asistencia.id}`,
        })
        .then((res) => {
          console.log(res);
          this.voluntarios = res;
          this.dialog = true;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    close() {
      this.dialog = false;
    },
    ExportarJor() {
      // var doc = new jspdf("p", "pt");
      var doc = new jspdf();

      doc.setFont("helvetica");
      doc.setFontStyle("bold");
      doc.text("Reporte de jornadas", 105, 10, null, null, "center");
      var img =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACWCAYAAAD32pUcAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAALiMAAC4jAXilP3YAAAdiaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDItMTZUMTU6NDEtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTAzLTEzVDE0OjQyOjMwLTA0OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTEzVDE0OjQyOjMwLTA0OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmQyZWE4YWIxLWY1M2UtZGQ0My04YWQwLWU1MmM0ZjBiYTJlNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjVmOWQwOTgxLThkMjAtMTQ0MS1iNGM1LThhZjY4NWQ3Y2M3MyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjA2YzcwOTQwLTJkYjgtMTc0ZC05NjY3LTk0MzU3MzY3YmEzMiI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1ZjlkMDk4MS04ZDIwLTE0NDEtYjRjNS04YWY2ODVkN2NjNzM8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNmM3MDk0MC0yZGI4LTE3NGQtOTY2Ny05NDM1NzM2N2JhMzIiIHN0RXZ0OndoZW49IjIwMjAtMDItMTZUMTU6NDEtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0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";
      doc.addImage(img, "PNG", 14, 5, 40, 25, "left");
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.setFontSize(10);
      doc.text("Fecha: " + moment().format("dddd, Do MMMM YYYY"), 14, 35);
      doc.text("Total de voluntarios: " + this.DClaves.totalv, 14, 40);
      doc.text("Total de confirmados: " + this.DClaves.totala, 14, 45);
      doc.text("Total de inasistencia: " + this.DClaves.totali, 14, 50);

      // doc.text(img, 197, 10, 40, 25, "");

      doc.text(
        "Jorn. Activas: " + this.DClaves.jornact,
        197,
        35,
        null,
        null,
        "right"
      );
      doc.text(
        "Jorn. En Proceso: " + this.DClaves.jornenp,
        197,
        40,
        null,
        null,
        "right"
      );
      doc.text(
        "Jorn. Finalizadas: " + this.DClaves.jornfin,
        197,
        45,
        null,
        null,
        "right"
      );
      doc.text(
        "Jorn. Proximamente: " + this.DClaves.jornpro,
        197,
        50,
        null,
        null,
        "right"
      );
      doc.text(
        "Jorn. Canceladas: " + this.DClaves.jorncan,
        197,
        55,
        null,
        null,
        "right"
      );
      doc.text(
        "Jorn. Desactivadas: " + this.DClaves.jorndes,
        197,
        60,
        null,
        null,
        "right"
      );

      var columnas = [
        { title: "Id", dataKey: "id" },
        { title: "Titulo", dataKey: "titulo" },
        { title: "Fecha", dataKey: "fecha" },
        { title: "Proyecto", dataKey: "titulo_p" },
        { title: "Estado", dataKey: "estado" },
        { title: "Cupos", dataKey: "cupos" },
        { title: "Tot.Volun", dataKey: "tvoluntarios" },
      ];
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.text("Jornadas", 14, 69);

      doc.autoTable({
        body: this.jornadas,
        columns: columnas,
        styles: {
          halign: "center",
          fontSize: 10,
        },
        bodyStyles: {
          minCellHeight: 7,
        },
        startY: 70,
      });
      var finalY = doc.previousAutoTable.finalY;
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.text("Voluntariado", 14, finalY + 14);

      doc.autoTable({
        html: "#tab_voluntarios",
        styles: {
          halign: "center",
          fontSize: 10,
        },
        bodyStyles: {
          minCellHeight: 7,
        },
        startY: finalY + 15,
        tableWidth: "wrap",
      });

      // finalY = doc.previousAutoTable.finalY;
      // doc.text("From HTML with CSS", 14, finalY + 15);
      // doc.autoTable({
      //   startY: finalY + 20,
      //   html: ".table",
      //   useCss: true
      // });
      doc.save("jornadas.pdf");
    },
    ExportarPro() {
      var doc = new jspdf();

      doc.setFont("helvetica");
      doc.setFontStyle("bold");
      doc.text("Reporte de proyectos", 105, 10, null, null, "center");
      var img =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACWCAYAAAD32pUcAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAALiMAAC4jAXilP3YAAAdiaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDItMTZUMTU6NDEtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTAzLTEzVDE0OjQyOjMwLTA0OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTEzVDE0OjQyOjMwLTA0OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmQyZWE4YWIxLWY1M2UtZGQ0My04YWQwLWU1MmM0ZjBiYTJlNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjVmOWQwOTgxLThkMjAtMTQ0MS1iNGM1LThhZjY4NWQ3Y2M3MyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjA2YzcwOTQwLTJkYjgtMTc0ZC05NjY3LTk0MzU3MzY3YmEzMiI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1ZjlkMDk4MS04ZDIwLTE0NDEtYjRjNS04YWY2ODVkN2NjNzM8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNmM3MDk0MC0yZGI4LTE3NGQtOTY2Ny05NDM1NzM2N2JhMzIiIHN0RXZ0OndoZW49IjIwMjAtMDItMTZUMTU6NDEtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjVlZTRhM2UtZTUzMy0xNjQ4LTlhZmUtZmIyNDljNWUwY2NlIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTEzVDE0OjM4OjA4LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQyZWE4YWIxLWY1M2UtZGQ0My04YWQwLWU1MmM0ZjBiYTJlNCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0xM1QxNDo0MjozMC0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj/YnNYAAI/hSURBVHic7J13vGZXWe+/z1prl7edOjUzmUx6JQQCAUKHUCwoUgQUxIJUEbuCinoVLBe9oujlqtdCUZTeMQhSQkkhpPcyyfR2+lv23mut5/6x33PmzGRSuEySSXJ+n8+Z8r777L32Wuu31tOXqCorWMEKHt4wD3YDVrCCFdz/WCH6ClbwCMAK0VewgkcAVoi+ghU8ArBC9BWs4BGAFaKvYAWPALgjdaMfe+mP3+13EiM2VFz/2BcwvXYj6WAOkCP16IctVMGKR8SgSU6cnUIMkKaYyhN8QPIUSUcx4qn6CxiXr00z+6xYhaeJs4/BmM0oa+/hMQWqW2KM14m1l+H9N1Xk63HQC+rAZG2cGsqywiRAJUSEJDMogWK6IHrqdq3gnhGBpmCd4LIG81PbaczN8ZjbrkT780R7eDp+8hOf+L4ffcSIvoIHAaqoRqT+54+meeOnMfZ5KqYhmatXClUQWbr+MMgw5lRr7Kmq8cdwDkHulDT7ZJD4QVQvfgDfaAX3E1bW4YcqYgQRjElelSR811r5hEnSFxpjGqgiKGJsTXJViDoDbAGuB24GdqNUiAwXirjs5rrJZPmbXdL4thXzRVX9gTqwaiW46qGKlR39IQiNEcQ8IR0fexciT0HD0uciAoLGMnwllAtfM4m7nKjXg90raToHMSJgoBkME/R7xynmUabRerLE8HSEY0WkJr4KwAUYLnCp/TSivxpVb16SEFbwkMEK0R8yEIgRjQHXGf09I+b3xRo0BFQEEYgxXqchvK+K4cNaxtu0N0/SaSNqDye79RDpaai2xei+ITnv1RidGHlGCPGl1rqfFCstQkABa+0LFH2+2vDmGPg/D/z7r+D7wYro/lCBBnAuS9ojn7FJ+vuIoCEgYiCEW6IPPx01nhli+FNivE1EEOsA4R53YBHELH3vEf2vqOZ1xczsyeXs9B/hXK/e4RUgsal9r0vMe1dyJB5aWCH6QwE1qSaTzsh3TKP9Q1pViAhiDD5Wf+TLwWkawr8gMhTda71cYziY5KqIcxhn6+uAw3k/xFm0KneGQfd3K42nxBjeZ5YMemAdrxMjn2Ro62Pl577/PEhYEd2PeiiqjDhrLxH0BA0ekySEwWB7KHsvD3l6kRWDiKAcoK04Q9IZxTYywgAqr2Q5hO4CqgKJxbgE22gRo6Khqn9X6z/EGDAO0O2R8OpQ8nnr7D8bS6ZREZEfQcxnMPwwomBW9PajGQ8C0Vest/cNCmJR40gSd5GonqDDLdRX1bd8v/vD+HJKmg2gNsYJEFWJGknSBGdzkLqvo0YkdVTb9xEkIZkcx4iAWJAIMdT+8KG+v+Sao/7MB/MhLbpXJs30P8Wlx2qMGLE/lI6kf18Uxc9jLCvjeu9Qw6Lt9AHFA0Z0UaVojOBdiywsoGIfqEc/NGEsFDPYRv5RY9NHBV9hrEVi/O/uvv3PsonFWcsBp5iiCNXQYi461OFtvdMu7tZiLSLLRPclQkt9gQomNYgDDQd2aTEGDdX1oeRcY90lRmRz1EiSZK+JMXw7FuH/OuPQFbLfMyLIw5boIkRrWb39ejRroO0xXFU+II9+SEKE6BVJ0zda514UY8BZS78svhtjfFaSZcRYDS+ufeZRISwJ74eI0QoHu8mVQ41pBxE0VCQjI8QIsSprsVzqnT2q7o1lfELi3I1idUxjJHXZP5RV/4uVVnfKSojcvUKtYo0iD2B06ANCdBXBu5STr/8qaXcP12w+m0ZvbplBaAXLEauSZHTVMfm6TX8TqwJBIZqZfrd6prpA21hiUMQJ1qYIPeIyng5JfCYiP6PKeSYhJkYuQeWfovfXq7UYa59jRH4c1dNFpLBivxw0/A3ojIogLsGqIr6qVQgF12qQ5EKMskdjeK4il6CKiMFk6X8EDU90WV4vJA9W5z1EkOZtBsm+u4tWPOJ4YEX31git6X1U7YQBa0hCtRLyfgg0AuoZX9P6F7Sq41uaTYoq/GDSzmeNM0QE8Y5iz16ypIVxCTEMrR+qOOfebI37K6T+v3GQOXm6qv66yRuvclnzhCTL/2DRR27q7fpZpPILqvGF2q8uxgg4i01zqtn9xF5FaI0glQcgFNWlJNlvpSOdP4m+wqWNJzA//SK/b/vHxCYPZhc+JFCmKcXUXrKhGnV/0/0BNcYVNmGkP8+JzQW2n/RomnNT9+zjfQRCVTHWnp9m5oJYVRiX4u/Y8td+bt+3kiSBCGo9vnMM/Z6QjpaQNCBEjIJ19vlO0iWSq3KVesU4czYhkK1e+34BCGH4vV6CyGoROd5YWUfkoqryG6LKHte0YC1x0MP5gu50h3IAxkRQCy7+6XhevjpN3ekYA8J7prbc+DEjBuyKDeYeESNlmjKx/sQ60vF+xgNKdMUQrOP4Wy9i5phV+EaGK4uVXX05NJIkjb8gJhib4AlT2679+lv8nh2YRgsIZKZFeuokJk8Qa+qtPAS0LEjarb82AlG18qW+UuE/1CpSzr3Smfz9xqZ1eKt1OxVeGIO/RBSr/d6f2DT9NRHr7Ejj96u+vrGWLhTEIUmg2a6QymLF1YF6wVMV5c8lzn0z+gGu2Vm/5twLfjJU8YPAyrgug6iiYoguwTdaqBiSZpuwdydh0MXcz3v6A0p0QSmzBu3p/ay5/QZuefT5tAfdlRzHIZSIkeQxou4JSsSooKH67dbTnqdiHcYIIVTEaYcUBnq7gRaqiljzE8amL1fMSQoE9f+70uo/nM0QDMU8HyCPT8868hqJjoU9297s+91LWquOIboklEX31zPrLnCpO0dUXu+cpEL8gKp+BSAq5Fbxg4qFnsVKbfjrTg++JevsRc1O9pQYBWPc25XeB23qVrxtQ4hGvEvxNiftzrLm+ouxZYFPc5LBAhiD3s+xaw+4H11UGTTabLj9GvYfdwaDzjqy3tyKCE9t+bZi3ghD37Uv98UY3zvpxqgD3gzd2QHd+QVCkiARNPhVptX5qPjwNGMtGmMt/mNuyBtNdDCg3LMHWykyPvpNHWm9BvWkNrkmyZrEXhdf9CEESPI7JG+coz6KdfJzqubnxLq/0xBeRwiEoOS2JLYdmlqESBJBEv97GrMvRR+wzpyCbTylKvxFK0E0dS2GojGC5hmnXv0VRm+/kWxuPyb42rtiLINGB110b95PeFAi43yW05zdz4lXfoNrnvoixGSYUPFIl/UUEnHyUkUxYohB/48vK6IPiDWUcz0G0z1MkqBliU2T1Kb5xSLmBBElel8pfE1E5gS5WkNEXEq+bl39AGMTrWq3XLp6fS7WEcsBia9qPznyqeirqKrrEXniMFPmtbbV6mhlfkLFQSI0rVD6HPVgjVLN82XXCltsJpvFQLngX7MwM7jIGHgkj6nEQNEeQxZ6nHH9Z1m3+3oGahi02rUUe5DF/WEkui9CYqTfHmdy2w1suPZr3PmoJ9HslzySZT0FTIjPcJqMYoSokaIX/iV4gzG1VTZNUhprAQzRV9jW5LtN3johViUx8ung45swYWuapHWEnITaop4MDWMqtdVHFTUSMAJJChoXXXL/CPxjAOJg9kmNRuNDMcimdHT8FVXR+XBVxI+LFQgKwYFJEKndfGr9+yC+PXjIMvOiZI17rThXPlDuo6MNopEyH6NVFpx+0acY27mF3shqvA+1kP4A98uDF+tuhDJvccKNl7G/M8p03qLdm0Ufkfq6EoMnGz/mObRaECs06HVi5WY3FH9FhKzTRGxnSEpZherrCZ4Y9eqyHPyIsw0OylXxhiixJmOMKKZpbQJGGGy9PfHdeUyak67bgEsSdOiMd62M7qD6lp/On9wcl5vFkOOr3632bP24GFO78BoJ6cgIxLrKDUXySXWjbx+G33WI6TOouPCRSHNRqFyONy3OuvjTjO24g7mxNdhhHsGDIeU8eERXpUpz3GCB0797EVec83y8XUP6iDTOKSYELMkTkAgSiZJdaFwTYxRVg7F9ghZoWdtnReRp1riaz8H/YZRIGXokkiA4UKmTV6Lgix7RQpa0fqQmIohJflhN/l3bbNVpqroU+Ua1dQthtqKaj9ucjn+gsXbta2zqHp2vP2a1CnvFWDR4+ttvJ5ZF7QcWc3l782k7XbO9PsaI+PLZWvUvxDzCxlLrALGi1eC4736J8Ttvpje2BtHIg6nGPKjZa6KRftZktD/HWduv5crzX0qsBriy/4jb2QVxmOoMfFX7rmd2Xab9kmgNhIiOtom2gcaAKhhjMjEgCEXo3jLwPQBymjiT1UE1IkRf4OdmcasmXmOMPFtVISjZmvVvTZRPiOPqWJagijW1q85PzWHLLi4JSGhfFVUAMenIWMuYZC8AqsTuAmGwgFhXp8SiF6nqS4kBXPL4+Aj0pYsq/c4Ek7tu47ibLqNsdYZpww9uux70NFUBuvkI43dezSntBrec9wO4QUVSFegjyhKvm6WKqxSDqBAH1Y2x30WcAx+wIyPYpAFUtYitcVy13p2bzfYTcm18F1WM5GAyrAUtQ0tj+bhsdPwn0rT9Wj2gi6MaGiJcpmX8Q+A/gcs1hiAI2amPGS60gtXyfKoBJs2Yu+bK9mD/Lkyeo76idco5NI89mVj0hxJp+R2N1UtBEJUzjFori6l1jwCIRvqdCZpz05z6zc8QxeKTFDkK7BQPOtEBMELRHGXDtZcQouO2Ux9P1lvAxDB0OzzMoRGx7ljbbDHU10N+3KbtdSipEmOk7M8TBnNgDBJjmtnsdzCCBjy9/BLBgAi+mCL43WgE12j8QD4+8WGRRl1yKuqi9BhRNSipiPyhIH+osCkgWwGM77K4BYnof2Pcy0UVt2bt203D/rixCUrAa0V3fi+qnhgjaZLc3EwbRI0grEXjsRHd8uB06gMLUaXMm9hqwGnf/gzJoEevPY5o4GjwPBwdRFclWsegNcZxV/033sC2s55KY24fR0Mn3e+oZfHRoaIMqrN+dmoBAWMcvhowmNlb693Bk7TaL8zWbFpvBPqh9/beoLqcKFiX0LCCUYdXjxE6ANF7YtCPAPusk9erMlDVvxSRHwbOHjZBoPbVKwEfi/rfMfydVV7qxFzQmFj90kTdevVxJwBBkY6AZMMbyM64LJwzqm5U1S0P++QlVYJ1lEmDUy75DKM7bqE7uR55AEJb7yuODqJDTXZjKToTbL7pOywcdzpza4+jMbv34W+cqws95Dos4YzGvhaDAmq5V6yjNbKmzngJAdNoPVNECMFXpY9/J506VbWZGaLkJG6ctsspy/63if7Xyvn+t42VbySd1g9pDK8HmmLkHdGH3wZ5gbHmFBGdrptS70AaE0CI6jBq3oPVCzRWSKf1dFH50GK7jTEsLVDo1PLXMgwXL304E11BoeysYsMN32b9jd+hP76mDnl9sJu2DEcP0QFQqrSB6c1x0lc+wg3PfgWDkUmyhelHjnEuRhAr0llT14pQxSaCTc2wPoRAiBtj5VHRbY002y+SE3yFk4zphd0s9G/nuNWnYUWu98TrEYuxAuiJy2bfGQiXEfk0WpeeimUgqmASITfJ0qUKtw5deoiTDXGx8gwsqwevAOXy3du4YVD8wxiiUHYmae2+nY2XXUjV6KDGPuB+8nvDUUb0YaBBa4TG9F6O/9rHuOE5ryRkTUzRf5iHyepSdo9AS6PPUQoEYqFIOXTPqIKzfawgKi1rLIIQqFCNOJvSK+fYOnULx4wfj8GQtFMEQUNcMoypahRjlvrUL3RRckxigEjUiBqDsQnE0NAQMElKtXd74edmEGuQJCddu7F2r9Vi6kHzSTWGh/OIAQSXYKJn9Tc+i/a6hNFxJB5dJIejkOhQR84NRlfR3nE766/4Ktue8iPkg95Rt0oeUQizi6RTGDFGRhGZFSBEpUuCGEuMSu7kulQqNLCmLAaPV7jUONMU5R2JSadGOuv+METPTDHDRD6B0XD3JZ4MaIz4uVlMO61ryFHbBspqwNSu2+mMrn5msz2OxkjMGleH0XpJslkD02gu+eC1KscoC5Z85yEuPKzLQqvSb02w6YaLGd9+M8WqY8jjg+svvzsclUQHQJWiM86amy9n7oSzWJhcT7ow83AW4bcuBbUJYmzcKOidYgQJkWp6mhhri1lI3Md1fPT3xFogvBn0TxPX/pRx7oSkKsi37/5TopYh7qQ44UzykUlCVRz2oYvdaZJ0s0nkZWJ4FMoCwlcV/Teb51iX/BqqxOinkqzxjSRvIUlCmNnP4LpLEZegVYkdX7MuWbMRrcphlRm7/WGb2KIQGg2SuWkmrruU0OxwNBJ8EUcv0YGQ5rj5Hhu//Tluev6raxHeP2xrzW0B9gOTNnXMb9t1Sm+6+02bpWAdsvtW2LMFFcPA+yvtk5/zX9nG4y9IYngV8CrVSIweY+2dnckNI2jcpwrWZYToD/tAVaCKiOW0ZGLi+lq/VlQF1fg6Z5OfGh8/RgxmtcZIUVZ/UFR9b41FvcNFwLWJxqDWYYw7dZnUtd9k2RacO6Rg3cMAw1esxldx7Nc+SmNqB3Otifs9p/z7wVFNdNFI2R6jvfsOxm+5gj1nP43G1K6Hpa6uUCFcC/I0jMWkyeN0du8/x8SBMbg0Iz3rSZDmxGKAt/krXTG4VdBWbSczxKJ6L4a32I3HlkNfGToowfu79JlIXWh26o7IYCbeseqk9FP5iPmRUMbdwIiINKzY5xPrXJgY47dC1L8yJq9FjqCEVhMzNrZYqQZj7BPFV3Xsg+i1FN2KAo7mne7/B0KkaI7QvvNGVt/0XarW2LJKukcnjmqiAyBC1Wiz9oqvMnfMiZSr1tfx8A8zSJ0SejHF4GmxCuTN7AJZO1Knj8aAZE3MhlNqHVojoejv9sXggiRxXzEimY965aAMb0hzi/MVsapq3XnxRNVDUO/2QtYRZrbR973qpbGhL1SST6FMxBj+0ljzUhFDDPGGsiyfZQBrBMQggy7a69WLSX1DY8ZWP1OTDNGIevmmljwMC4AqwSYEL6y9/L9xZZ9eawKKw6tGRwuOfqKr4vMW2dRO1l/+JW4++xnE/bsfdmdJaQiYrPGfybpjfl19hTRapzZOf9xpiLkBgBiJgy6oR0RIElDc5aoYcQlxfs+HdXov3ibQGYWsgXiPa48O49DvCl8qrUlDZ60SPWUsq/8waUoV/Y7+oP/j7Ub7FjGciLAtTZPB0nFPQLF/nlgUw+ObKkyr82yT5hP1ia4w8HOfrWKFedjZVJSF1iqOu/FiVt95I72xiaMqMObucPQTnVqEH4ysYvVt17Cr8mzdcBLthZmHVSBN9BWm2frK2Nr108a6cUSo9u16ZTUz/TtiLRoiJk3I1qwbFi2ICLIaQhKDx2bNVj6+rj6wwSWEqqoPYLQGwl1F9/qhgAgTJySE7gCNdnieg5C4HGAfcKKIWbWoZ4vWNeTNmg3UZ7PUer2z8gaiRxAiZmeBvSg6kIfRkiyq9BsdmjO72Xz9N6gareEcXCH6EYRQuZSTF/ZRnvyj+LHVZP2Fh0/QlRg0+EBZ/Ss+vIkQkTR5nbaz38G6oYgs9LbfQSiLRZF+R/OYTbe7Zut4jfmrymDfJglkaUooZ+pojrsR3UXrjCr1YHKD2gpxjfq+gz4S4nmSZeeJKL7wVxdFrAtgKDAsNgGL0btsEJf8GKrYTFi4ff/f9bZ6XMOhDwES3BeIKsE4qqbltK2X0ap6zLdWHRUJK/cFDyGiK2WjTXNqL8d/9ZNcfc4FdAd97CEWXRXBBk9aDIa/9dCAADEGKpe8p7l+45vEGlzWWBWcvHZQ9v7OWgfWUuyeIUxPIS4hlH21rebfpCPj74q+t9FlfCPG+HoN8WpERhCpsK6PMRiXoDGoVmW9C8kwMd1SV35UMwIMUC2dS37AJLxfjBE0Upb73x2Dr/NgVEgbHYytrekxRpzL/udixbPghSQNfzO2vkDcQydxra7SKpR5m+jcMH/8AFQMJDmnXvVfrN1zHQsjEzXJHyI2iIcQ0YdpgCMTjG6/hc3dBWbGVpMc4m6z3tNrtZlevZ6s6JN4/5BJdzV1GukNunrVf5l09AJ8hVX7jl5v5u+8aH366dpVtE88A4tFNRDnZv68nNr3467TOc/B+Yhepei1rtk6hsg/x37xK2hksGMLJm/NJ2OTqK9QdM4YKEtPpUKe5l8y1mxUjQsmSU4SMXVhw7J4V4n5jnGOAKQuIzP58LhkJZhwtjHmFRojYixG7F83N27cK87AURghdngoRZJRuJRjb7uK0R23E9L8oCuidZiqYGzmdgaNTh2//9CYVsBDjOgAqDLIGhxbLnDqfCQeMpls8FTlHNtXj3P76WdSGEfbl8P65A9Sm+8zBI0eH+JbJPhriQFn7KrJ0Y1/3l+Y+VUzGEbJlvthfAJptWF2lmLQf6o0W/9hlB/VOvvtTGMsMYYXhbmZX7GdJtX0flwnPCldtRaCpz8YnGNVb9VygA+60YxPPI7l57aJUPZm/2Qw33tr1lpTV6XRgCm6lOUCMUYwhmxk7D9EFLEWX/Sq2TvveFt98VHf2bW9wVh6zQ4t7zl1962su+M6zKBHtIdQQyCGQJE2iEPPwkNgQi3hoUd0qCehWEy8a1SsuhRbVWy+4hKad97B9WTcaTPSEMiK7lEfWacaicXgulXnPev9jWNPeJXvzZPlzV+JO7Z9cLB71+Wm0SAM+sRuH3fyqYgxiMayrMILUyPPF8OPAK/XGEWMHCeZ/Siq/9Q567xzNVZviP0uYixZkv1D9KFjkjCfNpM/qhNUFEVvlij/5vsLHwm+uloJkCYQKmR+qq5wI6Y+H25s/C+NM6dG73HGsVAWr58u5hesSx7QAwS/ZwxF7n5zBDSyacsVnLFrK+NFn16rQ8hbd9W9pT6dVn11F7H+oQA5UrHIP/bSHz8i9wGWjvitlk5cVUI4oO+pRqxNyLL8LqeCLiIKNMsBWvTZNrKWbac+nrmJtTS6cyTl0V29RmNEOmONdGx8r0FbxACY3Qv9uCmipTFCLCtMO8N0pxGvmM4EicQ6+82Yj4iVFy/60Rfda7VPW2oj3bDbdLHkVPAYa8DaxxiNV1TzXSrfp1KLa62hvOrLFLbN2FmPwfqKUBY/mY60PqCxPmw1aPjvsgjPqo9kftC67l6g9bkCWYsqa7J6xy1svO27rNmzhWAsvTSvdfXDzallRF96waG7UaNSlhXGGvJGvrTI1fepA2mCRgxCqCrM9xgW/MlPfOL7emt4qO7o9wEC9NIcm+YcX8yydsvlbJWz2H7cKcw32jTmZ5G7czs9qKgnT1X0+row85JmY+Tz0RhEWNvI5QvV/MKz0k6LgSkAHRK7HkatIhpKxNmPic1eDBpVoxkWsyDGeGMo+r8gYjeZNPtfgo5ImkKM3jrjqn61Y2rH/is0KiMdIZ1sUS0MKG+4mGrnrYRjH0s0CWlTnm6y5AOqEWMNETvX7/deqBIwR+m596KRKsnpNccYmd3DSdd8mfVbrseGkm5rjCjykLGg///gYUt0GFqygbmsRTo3zSnf/jyrbr2K7Wc+jqlNJ2FMg2ave3Tu7mkLieELEuI7IPntECusyDOlkX/AqL4SDRAqaGQYLE49WDAmAeFCRKCqKHu9n0jHxkoD84PSX6hlASQYm34yb+RPqfbv66rljdnaY37M79/y2bDnZjAJpYxgW4K/6TvE2Wkkb6MhQghPNIl+JRARMUhZUAzCcwaSz5mj0JUmGqlcSr85Sqs7zebbLmXzlivozO2j1x5jYGsx/eFMcniYE30RopEqzSmzBp25Kc74+udYOOY4bjv7PHauO5bWwqI4b44e+0p9njFl0fud1DROzZL8JVEjJst/UoPvxqivMxaMUZCAiQ6Nta+dqPvEh0slTR8vRRl9t//RpDm0lBuDqAHM/iL0PtnrzdFsj/61FgNkZORLY+c9po5myzL6115FmO5iOhNo0SPvNM9J8+RrGgaICpImDKb2/mRVhEvM+Ho4mhKOhuXJuq0JsqLPqTd+k2O3XsPo7G7KrMX86GpE48Oe4It4RBB9EaJK0WhDjIxsv51T9+zAbzyR2044jWANjd7cUWes87FkNF/10kba+o4SH6sxIMa8Nksa+4oy/nYgQUXxMZInFrUGjYoY818iPN41mz8RSv/vwcdhxqiCEygWqGb2kY6MnOY646fFqiTBfp3oMA6quUBRnoRfdyqu2WNkrLu5uebYb8ZQJDEqIkLZ7/9aL2/8q+Yg2mV4QsGDijqwxdJvjmBDxabtV7P5titYs2cLZdZkfmTVcAc/+qSP+xOPKKIDSxbX7ugkaTng0ddcxrF7tnHVeRcwu+Yk2gtT1NEkR8fWHjVgXZsimmcmSXIHIYxpjGRJ422h9Jf3g/mosZZgwZdzyDC5Iibpt83ICCI8xeZWVEWdc6jrALWUk2QbEGPPJ3qCyo2V1x1iFBuguxciTSSx2Iaz+fqxr2qUhnqPtRZP8beVVH9uUksgDqudPrgQVSqXEiRlw7Yb2XTHtazZfSfRGOZGVj8iRPS7wyOP6EPUultCb3SC1bP7eeol/813H/8jzI1sorEwDchRobsLoIXSG8zNmdh/bnukdYkkGUGVvJV8WPoLq6mK/RIh+khM6wj0aLm0NovJRKj8aWi8XhVs4nDp0HgHRK+PM6qgfN3I0G4XhHQikK+qUB2QJsmHJJhN0VfYxFD24zfm9sqb1KTUZSkffPKIRrzNKFodHnvLFzj5tksoXYNuawQV84gl+CIesURfhKgyPzJJezDLmV/6Jy475enMNUdo9ObRo+Q4oUV3T1EUl7qTT/md1prOH/nBAIwVh/mXGHo/bK0QGzlls1PTLoSdMfrbrE1PkLJ8TKzK640FX6QMQhOos8zyEXmsWovV3necKxGx9KPiswgoTdv44dSal/gqIMYQQuiWVfVDkGCGEaBHg888WkeVtTnr+q9x/PbvstCexFv3iN7Fl+MRT3Soa9T1G6OYwR7OveNSrviBn6XKmuQLs0cN2UHr3VPMO6r+4GVGeJQGj23kP0S+/snB2G9oVJJSsUZQLAKXEsMJptk4U8ixiRDmI4Ppalh4QvK8484WUbzaa5QUEUfR71NVFcZETKf9j2HoexdrKXx8uWkms6Oj5igq4afMj0xwynUXc+a2rzDfmiQYt0LwZVgh+hCikX5zhJGFGU675PNc9dQfo2rmuLLg6DDFS31cua8oSnlFs9G4RmMA49D+4H8Wu247XzSQtkaQxhixHKAuudaMjqLenx5jJARwGaw6YRjQETlFI40YFB+TG8U0CGVJHAgSEhrN7I0uyVYH7zHWUnYXPuV7/c8Y5yiOEhKJKgudcdbcdC0nfvdrdPMxol0h+aFYIfoyiCq99gRrbr+GEzpj3PiYZ9Lwc0fdpKlUry0K/VCWNl4eQ8Ra+6RsfOQsxV+jxhLog/WYNL1xWKH1NLHJUlnmqh+GcTlyoqkV+TsTy17rDPO772Cwdxuu2SaZPOttqlKnrmqkuP2m14SFeSRJH+QeqCEaKdIGqb+ZU7ddhRFlkOaPOIv6fcEK0e8CpTu6iuOuv5S92Sjb1p1Me37/UeN2q8s/B7wrfz1d23i5SARnsJ31r4te3ywIFfNUWuDQLY26cuwJcX62RQhdSVM0b9YHQ4gcPyxhdYNoQEMga42TJC3E2mcbl26IwWOMUJXV35qNm/cmhyZ7PFhQJSQpiUt4zLc+RSsUdFtjKyS/Gxwlo3Z0IVpHlaSced23YMOJlMefTNqbPyqs8MAwfFq3RaOfNcoPqYLE8GMh9t6sBIxNadkJVMM2FYWoGaHapFV5vViDM4qGiIjdiECMbA2VAQKm0cI029g0+ykBNHg0SdBG9oeukQ9PXnrgX/ku9BWhyNtsvuJrjO/dRq89dtRJXkcTVoh+GIgqZdaiNb+fE676Mjc8/gfQ7txRc7qrABoDQczfysTkDwFg2ADubPX2KlGLsZGocY8qM8baMbdqzWqMuZ7Ko8Uwgk10U51XrXeKC9g0w1ghDgai5eB5pBkmyyin9n5hsG/XLvMAiuyiihpDmTTw1pHKsFbGsHTVIG2ybvZGjr/xEoq8tfT5Cg6PFaLfDUQj/fY447ddx6rOGnaddi6tuamjwi63lBPlzIWgMyBjxgBF+oxq3l6lyQDsHjSKd6MTO3DJmFRhnUqs02Bt/ftOZLWqYo3bkSUNutPbGSzsJx1ZdXZjbN1a9RWSWfr7pv514dY7cc3mA/J+opEqaxKsY2z6BtbP72bCRIy1LJ7WGkQYlUBMU/yKhf1esUL0e4AiVI0Wx91xJVNnnMPc5pNJDio1PcwKo64OY8vBAzfhRIgh+NT7ryQufaFGxTb1HJdWGGNB6kgwrN2NxjMiuipqRGCpMqsIkyJQ+XKqkkB/9166W26nc6I5tzW5geA9odeL+ebjv5ifdOpwR70fUdeNpmiP0QoVx176X6ztb6PRMIQIYiIMzxsXjVQ2oTTJil5+H7BC9HuEUuVNGvPTbLr0K9xx9lNJit4SmevDTQWrkSrJ6I2txsRQLwb3e0F/Rept+TIlvrDmtJyVuWHD4mLONNOqihjp2GHBUgmggoBMDK3yM1pVtE55FM3TzsWpf3Qs+gyF5eusYZeo5/4VjbU+hWZkksk7b+S471xIa3ofvSSjKylqFLOYT7+YUy/2/l98HiZYIfq9QIZnwE1uu5H0tqsIYpYKGMcQSBsN2o0GvV6f3olnsuvMJ7IwthrnS9Ly/q9oI8gtOizbbJL0eKoCohIq0KgYR89kQixphVKwCZgERGkojCgK0cwLBqsVVgrAnhCozz0X4SaC5/5ctEQjIckZtEZZc+vVnPz1jxG9p9eZIASPWyHz940Vot8nCFWSEwcD0APFJjXULqkgBsqCY267mtGtNzO3djM7HvtMplqrafWnSUJ1/1js6wSdKyRNwXuKfbvfY9ttolqgwjqHWNOvi05oy3slmog4JUZ1VpImYjBWC8UQB116lVKpe9foaPrDIpYY4zXK/Vc1RjRSNEYIYtl82YUcd+OlFC6laIxitA7DXcH3jxWi3yfUQd3qkjrufJHoYurPjCWkOYORUeL8HGtu/g7j8/u4ef3ZbJ04icLmNPuzS5lzR6xVChqqGyc3tP8MqPZfd+0frHnM4yDLmhKKnqKIpHs0gktlKskgRLJQxoLKz9HJIzFaMbJFI4QQxSVpE5WvlkV8YjOX19LvvieG+6essWhkkLWJC31O/O6FrLvjaqqx1VTGIeHBz4Z7OGGF6EcSqsQkZWF8HaNlj8fe8mU2N6/hho2PY9e6k2n0ZoEjqbsLEai6C7+ZjY0zce4Tfto4+wZD3EySTgfVv1Z00oghxvgUhX8y4p4nzvRAvotqBcxH1TMFXuwazReLkVZuzTXq4y9Oz4efm50VrHDkia6RqjFGqzfDU674BNnCNN3RVaRJini/so8fYawQ/X6AaKTMGhRJg7H+fp5w0xe4Yk2HfSeeQntmT20lPmLESQk+IDG+s9lqvtUPzybH2DUW3sOw2KGIPH+pfdaCcydSu6oqg3wdwYqxtR0v6DOdk6vVyiuk3fqQOcJl4ESVkGT45gibvvnfjMzvZWZkDcRw17K+KzgiWCH6/Qql2xwnHSxwyjc/iT33Oew//kyy/jyyvJro9wVBjMVr/JKUxVtFTJ0ffk+E0YO+7xz4uP5crKOCopktXDHatugRPfdKUWvxzZxjvvVx1m+5hIXJ9UiMK7v4/YgVot/PEI2UjTYyN8PZF32Uaxe63HjCeTQHs0gMR4DsNT28j19qN8LvdlrmD78v9dZYiBUyP/NiI+EGz5E7qECGfyyMr2PNJRex5uKv0ptYQ2YMPAROJH0oY4XoDwAkRsq8ic1zTrjkMyxUntlzn05zMH/EJrgC1sgfkbiflFiepvH/72Qal1gW9s5/bHrr3GfTzsgBf/wRaWSk155k7R3XsOmqr1CMjKPOrYjrDwBWiP4AQVTxaU7ZaHPmVV9kS7PJlsZaOnP7joyvXcD7QJnlL2lt2nCNWIN+j4tInclWDXwj/Slz3AYicXjowxFoXgz0OhM0u3Mcd/kXiBIIaY5ZIfkDghWiP4AQjfi0gdHISZddyNTmxzO/egONhVn0ezy943BQHxD11wZf/Unist/6nigkoEHpFf5n8tx1my05Yi5s0UjRnGCkGnDONz/JgJJ+Y4RMIw+nM+6PZqwQ/QGGaKRwOSN4Hj9/I999+hPx2cnkC7PE73PS14UlAmFQvtVo9jJj7PF6X06jUcU6Rynmv2Z7fMgFc8RywQTwLqf0hnO//Tk6u7Yy3RrFrOjkDyhWiP4gQFD6zQ5u315O+cKHuf7ZL6NMxkjL/vedBiskuLyB9ouXoPodcQl6L0kfYi2xrPDd3stbEQjfi3qveGOpxNax94cgGiGocM4VF7Jhx3XMj65BZme+t5dawfeNFaI/SBBVBu0xVu28g03//QmuWH8K2cLMMHHjEOjSH/ft3iJUC7OXd0466w2NjcefS79bqCCybBXRA3+pyfJksOf2j89/97L9Ns/vmydAhx6FtEHuDBNVn3CY3ytNwoZing3TWxi0xzkq8nwfgVgh+oOIurDhBMfecR2zacqtj3oije78IVcp0SbY4En6C9SZW/dyY1XMWAfajfeqL0cRmb37hUKQqmw1Rke69uxHI8bcK9FFlSiG+fYqxvbt4FHXfJkGAX83kTUueMqsSRCLXfGWPyhYIfqDjIgyaLY5oT/L2t1bsOXB55eZGAgoW08+i5lHnUvemyWpBkMR/+4JqQa0KJ0UxSfAPgNkbvnli/90jpG52fI9C4POm9PR1aDxXoQHpcjbaJqycfoWTtt5DZl6ekl+2OYIUIqtw/yPaPjvCr4XrBD9QYYAVd4knZ1mwxUXo8axvEKaYNCyR/u269h76mPZesoT6Nk2eW/u3jPiTOL78/1fSRtyuU3tiMbDMFiNitHfFxPQsnvX7xfboYp3Cf28QWNqByfecjHH774acYZeYxS9myOZamqv7OIPNlaIfhRAYiQkKb20yaG1zwTBt1swWODY736V8Vuv5+pH/yD7Vh9He27vvfjgAzHa7ybI2wy881AqirHMzOz5wRB7+9vp4YVq0bogRK/VwcTA2Vtv44TbrsF25+g1RwjWIboSvnq0Y4XoDwFIjPgkpTu2ms7cPs757se58mkvpb9qkqw7d7c69SL5vIY/lsgrrZgzFuPZjUuJJn6ELHxBYoI/zD1ElTLJ8MayascWjr3tBtbu3YVvtOg1J1aOO3oIYYXoDyGIKgsjq8hn93L6Nz/J5Re8nLKZkpaDu99RRYgx4jW+xCWt67SqEOeIRa/v56Z+KjcCcmAayDAhJlpHLx+h40s23/pd1t96LYihNzIxrDa9QvCHElaI/hCDaKTXmaA9N8XpF/8n1z36mcSqj/N3X8XGAhr0et/w73St9tvUOIqZ7quKXfv7Ns2W3VtREQbNDqIFG3d9g83776BZ9ug320Rj6138AXrXFRw5rBD9IQhRZdAaZd3uLUx99bPcMHIcLeEeq6HGqoDGyG+veuL5b7MyuCmOtD6ajJ2xdCCDaK0e9LMGE7u2cvxNl7B6/x144+i2RusT41d28YcsVoj+EIUC/bTJ6eU+umYdt3fWk4dymYVbUI2kMeBQpJETq0D3pqufZjetmQrW15FsOtTF0wzvlDOu/QbH3nwV+ECvOYIiK1bzhwFWiP4QhhdLleScvv8G7PQ2KjFLASlSV5lhf9JkAUtTPa4sKHuNr8eJHGMsGgNGlSLNKQmce9mXOGHLDXQ7Y/gsGYrpKyR/OGCF6A9hCEohlsQZzhjM4ENARDCAD548b9BLlNtosCNpUuJo5g3Euro8tCplluGTjMdd9U1O2HoL86OTRJEVMf1hhhWiP8QhKB7BG4eqICJ1EI4KahxjoeTc2GVzyLmSNjNmhLbU4niRZlRJxmOv+iYn3Hkj8+3RoV9+heQPN6wQ/WGEw9GzJxYVWBUGPMEXXBbaTKU56hJM8Jx71Tc5/o4Vkj/csUL0hzkW4+zmTErDes6b38GeqyqCS2j1Flg9tXNI8pXTSB/OWCH6UQRrLYcLgY0h1iWbl3mwDyrxdB/SSgWlcCkuBo7beUftTjOOfn7XsNsHBcOy1Mv+e7+dDvNIxINB9AzIgfJuvhegAqrFgb/bAb/7+ZkALaC4h3bI8BmVHnnD0+nAY4BJIAA7gO8AWw8bTy5CjMpgMMC5BJbFjgtClLjeIAPq97GozsflWWbDDhI5oKNrTRyhLuesxpgRDXGHV9TnzWVMWjyEeQn3Nj6Hwg7fcXDoje4Ni+G4AGLMY41yNjAiQmGM3IHq5aq653u55xD3ZfwPB0c99waH/fYeFp4YI2IEQR4DPBoYqZ8vW4BLVXXqwVy5jhjRv4dX+BDwdO5+EASoRGS7c+5rMcb3xhhuO/SSGAMhRowxHIaovyzwNqB/t61QBMRneb7dGPNNjfGfVeOViKl3y2W3lKVTPO/mVqrEGNEYX5bn+VtQfdKhbUqc88aYT4L+qapeetDbiGCtYefO7UxNTeHcgWEpBgUbjt347A0bN75/MBjsNsa4qih+vxj032MXK6gOF4qatrpYGmo8SdKLNcZJZ22rKAb/VnT7PyNGGB65TNZokDUaxIPrQ/+jwA9yd5P9rnDALKrnAVOH76DDfBQjguCce4uI/Lyx9kyLHR42YbAWVLWb2PRTGuOfgVxx15vcbZTerwO/wT2N/+GRALeJyBNZlkKogBHBR71Lom099oG8kb/RGPN6EXnUgQ1qcd7ojDP2w6r6p6p66+IdROQBK4ArR2o3e9FLf/y+XnoV8CgY7kDGLE0EkXplXDzfbNihviyLn/Fl9QFZVkBRY8SlKUmaH65U0p8L/Mrif8xiMYUD2yQ6fM7iQqEoVVH+Yqj8XxtrDiE6xKj0+t3FU0+A+jTVJM9pdToQ4r/ZxL18sdUH96ssLeYxRkKMv21ifKegYMxSGytf0e/1kWUZaTFGsixL8mbzFmBT/VmgLIoJg0wv9ZPUuz8Cg8GANMv/NWs0XqExYq1lev++M6IP11tnF3d7mp0RkixDDyb6N4Dz730YD0bQuA7YfejnonpQX1pr2T+1H4H14+OTHzfWPGGxr5YTRIYx+nUdvIjCWzTGv5KD6swrYpJlkskS/gn46bu0ReRwm8LhcJBVsl74laosDvQzEFUx1q4G+Xiapk+OyySUw70L4H1V/SwxvF/Mfa8P+MlPfOI+X3t3eDBE92moOyB4v9V7f62xJkdBUbXWBhGzRuBsra9zSZq9P4Z4o6heujTGUhf9v5t6aHVitQhEnS/6/UsQETFihmWZ1FgXxZgNip4GgApZnv9VP3SvqMrq62bZQIgRgveo1rvQQYOpirPuy8bJM4eDSQzxYoRPADcADuLjVOUVIrLJGIO17h3Bl61iMPjtuKxIojGGRrOJNRYx9cIkRqjKqhr0us9ttNo3xBixNiFN+bvu/NxLjal3DXEWMCCQN5uPds69QmPEJQk7t2/7pam9e69P0rRe0MqKkdFRxlevOXQ3B5hZ9u95avIuGg8OBwvMo3p4Uf8QXtXtt6OtVvtS4+yGxQVXo35eDJ8B2VZVVVNjfHqW568FjIogyLuRuB/kgwdLXFq/tx5Ux/56YBdDqUQVjBGvqpPA+PCaEti22PXDvx2whWVKoaqSJEldfz9JDiJuWZZNY92lxpjjwjCGwXt/oap+2ll7JyIN7/2TReSnnXOdGKNL0vR9ZTGgHAzef1+KBR0pPHjGOBHEyAcG/e7bgg9Yawkx0mi2cElCCP6ZWZZ/TFXHRIQsy/4kBP9sI4fGamlN+sOt1DVRro0xXNDrdjHGLA1Su9PBphndhe6L8jz/V2ttpihplv+2s+H5y41dRgx9BhADiyuxEaHs97HW/bEz9pmVrxZ3+l/XGN+lAqbW2QghfkThD5rN1t9HDT/pywrrkreF2P+qxnihc27plKSqLPHG1KGnw+k2XPBu9N7/L+fcL0eNGOdeUnj/+OCrS5Mkpez3iRGCr1izZs2/ZJkjxkgM8abuQvfdkXoHAvAhkqQZzloK7+9+jJR/V/h5uMdyNgaIcsiKa40hqNbDMvxNAbz3jIyMftJau2Go7mgI/iUoH3MmGbavApUP+ap6j6JfSpJ0ba0D2w8E7z8notNLTdKIdQ5lqL7Uz3oX8FdAqao45/Dex7nZmd8dn5j4H8Pd9katbQKL7wBL9oYD75LnObt27uS2W28lS9O6fd6TZimnnX7GR511x4XgsdYyGAxeVlXVfzhrwTqMMfT7/X/3vvrjkdGxD1trnxxCIG+03tftdS8qBsXtLnEPiB30QSuqXYuULh8ZGydJU6IeOCxguGL/dwzhbcsI9+SyqNq9/oDBoGDQH9DvD4jhng4ZUEBds92m1enU+pRqrR8ag3OWGPzHgvd/X4uIihg53aZOTGKpfxwmsfjg0RCXfqqyotVsHdceGfktPxzo+bm5d87Pzb1LjGFJIlDFWkuapv07b7/9lfOzcxe5NCXGSKvV/sdWs0We5TTy+qfZaJImKfML80xNTzMzN8vs3CxT09Ps3r3rV3wI+4zU5ZhXrVr1/marhXOWLElIDKxdu+Ynms3mo733iAj79+19RbPZYM2atYyPjzM2Ps7atWsYHx/H3xPJaxTDyq5KrbMe7sfXfx9s1CvKkrKqqEKF9/VPWZUYa3/AWvv0RbHcV9ULow8fW66WidTqxdTMzLVT09M/tDgnrLVUVfXGqalpZmdnmZ2dZXp6irnZ6TrS78A9IjBQ1eici9bauHPHdvr9frHM/hGWzZrFd6lYppsbYyiLgn379hJiwA9/Sl+R5o1nJ1n2fNVaIvHevzzE8B+1mlaPvVALlSKyc++e3U9ZWFjYWj9fabU6/8cm9QKFMff8cwTwoLrXYgzGWEt7ZITu/Dy+qhAB5xxZkhHRi0KoJywiWZJlJyp65ZKGpgx1/LvP2lJFQgjkzWZdHbUs6xrmZcWOHTsAYWR05NK80UCMIXif9Hu9+peXLTy97gJlWWCHBRArX9LI1v5y4hxVVeF9taOqyt+uRb2ULM9qG4C1eB/Ytu0O7txyO6tWr/mpMx71qNtEBGPNhtmF+Rf0er1P22WFFUUg+oBBMcMtXYYGtEGv++rR8YnPVmVJo9E4deeOXa/dsuW2vzv15JNptVpWxPxtjBFjLWVR/LOvqsvrBJeahCEGEpdgnWO52nA3SFmUiO9BxlRg8SAG5xy9bo+tW+9cEnPrcagNlpuO2/w7eZ7XC24IXzTIp8S6gzY1YwwhePI8A/iO9/6/rbXPNMag8PRur/uORcKqKt1+jyTNaLZahOHitbiTW2vZsX0bU1NTrFu3Llv2GLv4Wve0ofbLgvWbjuX4k09eshnEEMiz/LcYbhyoXhTK8t8Ta4lS23t0KM2kaYazBmcEa81bFD4WQiDL0ufkaX6SxnjL96Kv///iQfejx6Fu0x4ZHU48JYbAQm8eY4xttdtLHZxl6cEKpQghhOUi2z0+J8sbZHkD4xz9bpfRsXH279tLjHG1MZboK4zIlDP2gDl3KHquXrsWe4iFX8T8SFmWw8GP/9RqtTDG1H7vGKiPIVaqqsBZw6mnn47A7cWg/80kSc9XVbI8f5l1yaft8sEeGnxCqDjExkuM8XNFv3+hS5LnFkXBmjVr3t1qtf41sbLQaLf/WIwd1VokXtize/cbqqqqdcwhqrKkuapFkqRU1b160Hr3UoNyWV/UUylGSNKM4zZvPpykdYxz6fneewQYFMXfhipgTL0QpTlYZzFGSPMca+sUHQ3hhapxU+Ur0iwtVq9efdC96/mhS0dQLSf59m3bmJ7eT5Zld+unPRzZhzYkBCF3KRpi3Q2qGDGTGuOzwvA3ReQ9Lk2XjH0qghFDWRX4ymMQrE3QGD9eFsVu59xaI4Yky148Nz//p/ZIn0t9GDzYRC/hgEvXOEf0gRAqFhYWyLL0ZzsjI/VAIr1i0L9VY1yyyMcYsUmKvcdDCnToJlqyfKLeY4B2p0PUKI288ZoQPNZYgvDhrJkPxa8DRrcYI96HpUkhsMlYOX7xe4GvOOtAap2+NjItvpth7br19eQJAVW+qKrnK+Cce2wtkRxQZoe7PTt37KbXXSBJ0gMdVhZ0RkZftfnEk3b7qiLJkrxjO7/Y63bfHaP+uqHWWefn5l6XZumg0Wwc6AqBLE9J84wY79ORq6sRNnD380So1b+doP3FsbS2JuviAr3YR8aYJyx9biSmaXKxJo46nKf2gBhricOdMoSwaGqbA65ZfKJz7iDOqtqDLOpLJN9ekzxNM6qquscXXU722siutXQQwkH16rV2XT5BhvJ5jKrz8/MXs5TQW3tl2u0Oxhi897UaF4e/m/A1EXmpGIOvqifOTE+TuPufhg820dNFwVBV6+2gJtWx64455rXGmDdXVYVLEop+78KFubm+sXZxJAChneX3In/JGuA51FfVS2dtPg8a46mr16x5ffThNIBud+GWbrf7x8YeWGFDDLSbrYP8zUNR9sSDH8MdS5u9AFovRtbaOuJtaCm2zoDqLcskg/WIaQK9xQ8UMMYyPjJCf35+caEDwFpHr9vbMzsz/WtjY+PvqqoKRX+j2W6/om6X0O92v200/uv4yOghfVP7qE2aEu7L2crCK4CXcM/zxIjybODLS5+oDhdeXWYjVVR1sw5tFt777XPzCzsPWJ6FqBEjQqvVRu7uLDrlbiQ4YejRQDWyY/s2pqemyLL83t9z6Q5DS8OwzTZJMIk7KCJxuGCdsMx9tquRN7Yvl/SMtVT9Pr3BAJskS30dQsQl/qYkTfHe02w2jztu06YjdpDlPeFBJrr8NPDDHCCgihFJ03QDqknwtZFLo7J79+7f6C4s4IZiqK9K8rzJ6MTEvRktTwYuXP6BquKSFAWqokREgqq+Z//+fb9EVJrNZm2xjoqxhjTL6l3qoJWd9jIpIpgkmT90uFQZ2g+GU2jJNajdZbt3kmVZiyHR1RiSQY+kN0c+OYkJgQGCcQmLu4b3FWVR/nmI8Q3GmBNjjKMCo4s+fhHzky5JEWM5aAVUvWsc3D1DxJj0br9dJIS1I4fOVR9r4+aSnQNQ1XbdDEVEZpuNxvC7A7u+INSeFV3qMkHQ+gYYY8kbd/X2iQh79uzGVxVRle7CQi2uf49YvujosrYtf45CS4b/DiHMRtVqiawiaAiYUNFJDD7LDnLHusTNaYzEOtgrbzZbfE8j8v+JB3tHHx3+LGHRMKEHxL47y7L46aqqbk6SZMmaHRBGxkaxNqGqvtdIx4MDWlRVQwjZ6tWrxxJrZ1ziiLGmhLUOFUNZLwgH2in0l20rJlS+oYu+3MUJasyy4JcD5muBbFE8NMYEY0zt7zWGbGY/veYIt579NHbnTVZtvYUNV13EIE1gqMtZlxFCYGZ66uUjndFLZajjGmPoLXT/NMmy25IkIS4tMouNHv7vPhxwWLshw81VUX7TiEkOf1EtuvcG5S0hhqWIQlWl2W6RLPXjogVa+nEYrCNIM03T5Q9cCmJaLoUcbq9bHmS1iDRNsdaya8cO8kbjILvE94raG+BZ9I0vh8aIc66wWba4YLXSNDEiEpX6wA1TDrjp3OewZmo7q7feQNEaWUZ2mosLsqqWVVnczVseWRwxoidFHzQSrSO6egDv9YAB2IHqzUAKICISqkrEmBLYWvnqKwZ5nxEpjKn97EBtkW00GBufIIR7dRHdBPwiB3zBChJj8A3r7BOTJP2Nqqqcc8nrTZq+ZN+eXcf3er0FZxeNSwHrUprt9kHGHjGydVEPU1UJvtqoUW+vPQQQfCDNcgZln0ExqMNah7p+nufHNZtNFPBVtW9ubm4eY0ln9zEYX8Vtz3wp+1dvpLf9ZhZOPZdy/x5Gr/42RWesLv90QIe8LEuz97fanVcF74kxbo1GfmtQFRT+8Ia2PM3uYlQ8HBRFMJ/SoL9WhIOj9RaxGKwzPT3FYDDAWkuMEWct1lmCT5ZsAbXI7ranWT03osaNvYXuJKr7kbrslYghbzYOkp+HMQRjwIn1bbTnK3/DoW2JURkbH2dhYYFycF+jd+/m3VVJnMOlhxdmBO5c7D9jzDFlUazz3u/AGPL5Gfad9UR2nvEkulM7aG+/Fen1CC6F2g5xvAwjL1V1RwjxAQmBP2JE746tJhpLOuiS9hewocKEQJm3CO7wq6uKvN/48reSolc79JOUmTJg0owkSerAhGQxxHEIEWK/y9jkKpIso+j3703H2Qv6n4eumtZaer3eJ3u9vZ8bG5v4WlJHPa1C7E/5yN8uzmsfwRlDo5Gi8aAMq1sE9iisQQSXJE8M3n9dpNYVxVgikKQJzijqI9E50EiaJE9f1FXLEK6eX1igMejRy5vsfNbLYGIdnX3boTdPdA32Pf5ZHF/1yMs+RZrXJp8DYvPVIfha1IU78/yedVID90ryenBAkE6WNZBK6gX1kG4WMUuRY87ZWv83hqIo2LZ1Wz1sw7Hx3pPn+WWbjz8eaw0iNhWRc0rvvySmjnJs5CnOOBa68wRVrDWEEMmz7DcbLv8tBSpffbvb7T3pLjq8GBpFl7ToUdyNAHJfoCKYEHC9eTRJiM3OXdy3ApcqSxKZnV+Yf3Qx6O/INDJrLLtOPpfWwjSD0Ul2n/IYjr3mm2jeYGhIfuqiuxTVy0X03ubvEcERI/r1T/5RorXkgy7J9DSu6DMyu43JXVtp9ecok5wyyZZKFKkYkrKfgDK97niiWJqhxG6/nUasEGlRHJpCIAadnyGbWM1Ep4Od2Q+N9gHryeExnPnLrdpgMAy6feZmZr8+0hn9L8myC7z3TK5efc746lXLfr32mzorJK4Wh4e2tkDkQl+FV9a7jvlZEfmfQj2pxdU114wxYBMKUSR6EDNqrH3OUEdjdHz8kxOtJuXsFFc988fxG06gsX8XwRhUhGTQY2F0kt3Hn8EZN30HTdOlVxl6HkaXETe/e0dNLcx8L9qgoiIKaZIR7F13dBn65ycmJrDWsLh4DQYDms1mbR0fhvLGmrg3i8j1MerpAFmj8XPGmi8hgnMJiTGEGMiynF6/S3ehBwrNvPGDdSxABOW6VqNxwJovggmexsI0+05+DN3kdtwt18D4qvukohz6Rq4qUWPY8qQfYvT6S8nvvInByMRBa1yMcWuj0bg8y/PHhhAZGx19XWy3Pp/3Fpg97lR2joxhp/dTpTnF2o2Eaw2DbheXpuenaXr84iJRDAafqN3L5sAQwaJxh7usrN8HjhjR1RhMjBStEXquQ+kcO7IzGNm7l86dN7Np6zW05/bRa46phIq0vwBGZm55yo+x45iTiAs9Ws02bs8ttO+4mdVTO0iLabKqjxiHnZvCzE1Rbjqd6R97I33tsvn6S+js2cqg0blbH+khrWSx8yrvGZ+cZPWatfjgL/XeXyCAxmjM8qwiI2TWML9zK71BnyWRXiMW88eTY+M/LtakVdo4zWT5a/rdhX8IPpIn6TCGO0KaEpOcztROrEveG2J0ttFgfnZ2cOmll/5be3aK8KM/zswxmxmd3oMu86mrCHnRY+uqY1m//RYa/QXK9O537Xsiclr2Ee8pGu064ured/a4lA13D77eoT6/5D5sNBo0W238rm1E6/CdMUQj0QcG/f5f5M3m32uMJNa+Qo39U0WvTIZi//CGWLHkaU6SJOcbY86Oi7tqjB/UGFEjIIakt4DzBXeecT63nvEk8jMHTP7DO9CFObTVuS/veFDvpf0FtjzmmWx79NPZu/541v/nvzK57UYGY2sOXFW38y/FmPcRPS7JfrTvq/P6RXmJRh0eUSWIRpIY8FVFz5eMZtnfLKYR+xCu9SFctrhiG1/hygLjK9TautrPEbTRHTGim6GubMuIHZRYUdRbikabnceezr5VGzll961M3nFVUbYnWJhcx95jT3v6rpMesy3fv3MulOUVsdW5tXfMCeyplN2rNjMZCtpT2zGq9PNVqBF6Z5xPmbbojU2ysGoTp3z5Q6zZv41ue/w+trQWe42tM9qCBhBmlxbTGNO4bHKIjwQRbj/5mUy7Jmms6h1KDGkWrtM4981m9M/Id2/FDLp/vyB2V4jVZ3SZ5OK6CzhbUIyu+l3TGXt5vnc7zcow1e//st9+x2Df6edQPOFZdOamEexZwEbQi6PGaauQVAVzrVG2rd3Mo2/49j0S/e7QnNvP9hPOphwZZ/PVX2eQd9DFNNe776vBgViCe7hqyZ1WI/gKqwW3nfgYqluuZeyqSylHJqmMw1nzD8ced9zvOJccF0LApdmF3lfPCjFcu5QVNozss85tanc6H/FVRYyRRqNxQ7PZ/LLWsi8ytYdeI+fGc36UqVMeTbZzC3LMsfTPfx6Nz/4b2uzc5/5RMTTmp5hecyxbTzuP5t5txGabPS96PeNf+wjr77yB/thqQLBG6Pf77x/0+7+dZ9mpQSNp1vi8uPlnV4PuFcQIxp6CSCW+ul000Bkd+8c0Tc+pFzNBNb4ubzSw0ZMuzFA1OnTXbWQwtor5NRvwLsHct1iH+4T70epei4pJ0aM9vZdycv3qW877wZ/Yd9wpj6mao/TbY6jqsxsze58t1mHbDkLxRVMU/zOfm/4ieYfpY05i39rj65XRGkK7AzMzuKnd5G4ULxnXn/dD2OsvYvz2a+iNTN5L9dJ6laXo4V0Cw6AYERPMgR1rjbG2DnpBafTn2bXmRPaf/8MkArFOuAC0RYtPbvHF46MYRvfv5PhLPs9Id+7TRav1AeCjauzNjfkpW41OPmbnuc95dW/V+mf6JGNs33bWfuszH2pr/71PePFLufm5L2Ofgp3r/i+y9i+BYo2dSm3648EXXwIhL/psO+YkxuenWbfrVvrN+17jrTm7n/3Hnc7Nj34GfnQSW3k2X/UVfJpTNDuosYdnsvBikBOoi1HcnchkAIO4NwPXIkK6MENvbDUzz/sJzFPnGfvuf3PcDZfU0XB5m0Gv/4ONlrl2KH6vcc5drarvRvWzwA4RaSVJ8jxj7W/5qmotJiPddtttLyuKAisQd20jOekMZl/4OmbHNtKe3YtWBTqzn+IJzyG98Qrs1luJo5P3aVe3viSkOVvPeCKo4oKHhRnKRocrz3kum/btZ9VNV6ONuivKKiLNkR/KVq+5SeqY3Ym20e/OTaz5K3XpKUnDPz8KlGnzfWln9Djr0qcvWttD8H8SQ/xG3psjJim7T3kcu084h97IONLIKNOUqEf2RJz71b1W5xHLeD6x6jfTPHkT/dn2zKpNGF9i+wsH9HUYrgv+OS5rPieZXPMH2u39vpvdhw2hlm5CwJZ9otehaCOkRZfSZlz/tJdweq/L+K7b6I2tQWJYbi5tLmsRCBTNUbK5/RiNlHkLdSYgtf82hHDenl27CCFgjCGd2cf06DEkyQLp3H50GP2UGPebybx7dgCMwq6Np9Ca3s3mS7+AdiZeGVRfmc1PU02u48ZnvYKFzjjJwgxSDJhat5m9T3zRl8zUFNVEm153hk4lz2w0xn8pDFdxCWGiM7b2/wTnTgLBoPT7Pa4+/XzUOdZtv5l+axSUg99VDBI8WblAEjxSluw47ixuPP9FuO402cwetpz5ZBbGVrH6zhuY3HkbUYSy0V4chGXigmxE2HhfxlpEjgGuNSGAS7jzMc9E+12sBu580guY3nAqZ3z7k4x0Z9hnG9cF759mnfskIuNSM/6XEPklgaUsw+F9AfDev+jOO++4as+2bWRAcuajSZ//ahqja2nO7kES6jLVRR+dXMvgsU+nfdv1h5L8sPNCxZB3Z9l6+hPYv+Ek2rP70TQDDGl/nsrD9me/gHDZOHH/AjFvkEhJe2HvrWF26vw0VB/P0fW7Tz+PLY9//i+6YgBab3Izq479qfm1mxnZfgtlo40a+2du0Htr2p1n34mPYueZT6S/7gS0KHC9WVwYIElCLfwfOdw/RF90PYj8jMsbf2KcW1PHX3vSwcLd/E79V/QlzY3H/15v185dC9d/970ura3uOujhTj4Tm49BNUxcEEM6mMeznpvOfS7nfOn9NOb20x+ZCHLAEFPV1wqt+SmmRldz01NfTHMwz+QtV7Lu1itRuMS3xxEjWJHxNM9fWAX/CWsMMjrGaHeaXncOnzaxvgQUI+bZtcu3bnhSDlD0tmRhdsZHTmuEqlmNTHDD01/CfHOE1tTuWvdWJe3N0Vu74aSZ5iQNHTAReohLnh2XW3etRYtBGvfsqP/faNLIEoIvuenc59MZdGnu3U6/MxZlGCUooaqy/gIxy9m57nT6NiNppOw45bGIr0iKHpJmoF12HX8m+489nfHtN7HxhosZ2b8TVCkb7cDQCo4xxPsah63aVzE05vax/cRz2bfxVJqz+xCBvNdjavVmrn76yzjryx+gNb0f71Z/fTDon95s5O9AeZWIpIhgkpSgOsxKhBjj58qqfBvKlU1naQCjP/gymq98PX5hAZndf/DR0caQLOxndvNjkTUnMDJ7J0VnSb9e1sFSSQwIiqv6VDZhx4aTccXgINlFxZD05rBjwtYn/DCzOyxYYWQiMGrnSHfvvnj8liuPydutT9z6uOf+aAiBzBfDNkk9p6oC2+9+qzTune1y8JngUm47/4fYedq5GAytuSmCD7X6c3cRgd8njhzRF8NSVVFRrEveZ617FQpxKR1yWcAJB4TOgyp/qBKLgrTd/t+ccPLHRNgzDKuCsUl0rnvgmVp7e/PuNHPNEa57yks446IP05rd9+5Ba+wjClFF5m3ZJ+vNMb/6WG4+/SmULqPcuJapzmr2ja1nw+5bv9HetyMPLl2XFd3JY5rZvE9qa75rJmBgxitF1oBhAQpFv6qG8+tQVyXtzzPVnnjW9ec88w4a7U8lSfqCubWb6DY6NOf2LRnYJEmpuvPb5i/+8tsbJ5xGe9UxmKpNkHCRLu9HEUIM/+YlgjXYoQM97S3gV1tuPPU8zt71YdJ+9y+ic/+eD7px4PJ928bXM/voJ7G7cxL7B5Hx8ZSx/jRuME+Q2i4hqrTm9oNJ2LvhZGZXHcP43u2M7tnC2I7bf9gGPx6tMzb4TqM7Z4OxlHlryYBXh+ga0v4CUhZGjRiMudUWffrtUbad9HjsoF+/h6nVi9bsbrrja7juWa/kuC9+kEZVUiG7A/KaKvjfylzyGGJ8bH/H1k15llZ2bPJGL+ZrRVFcq4CLHt2znfS5LyL/yV8m7tuCVhWStA9MpMWw1Kog2BZ7H/U8Rr/yt7jBHKWkqPIeV5WfsPMzUUNY8EmGT3NMqLjj7KfSHVtNc7AAh8QMqDFIVZKUc7hBgkjENoVqvDFRnPio1y6ccOYmDdUmW5bLSA7RpWSz+/6rHHR/dmZkcms6u5/exGpue+KPMrVhM+nsHlyMYFIWQ6TvLxyxUlKn/Mt/Egd9TAgtEfNlMXLeobdejMVW9IYY9Vsg14qqwXGBNea5sVqMilJMs0mxY9vv9LZue4e4FJs60hNPQmdmCaXHTraxAajKU934qtzPzFwzmFwXmv0ZjrvoU6zeu224g0Z6nTH2n/Aodp38eLq9PiOhh3Y6VAt9irRxXLPd3tiY23tLd8/O3Z25GY6d2Y5bmEFtgqsG3HTcKdx5/BkkvmQ0GyMxjmgMYsz/FZGfEGW26M//j9K4/23G1nzeGJ4VkcQWA7Kie9COI9YSet3Plnt2v9mtOmaHa7qirGrdLTH6ZhF+F7Gd4MMHq1i9zjSSUE7PkHRGSSpPuXf3aL56Q3uf+u2jO2/iSVdehHc5t206g7mTzmLepsfYRr5L5nyc6xaMjOc0tCKKJZZ9JE1RsSARowYNFSHN8M0RDNE1p3ZnJlT9kORRp3Yzsm8bqxZmGd21pc7Ea43SlPokmH2jawmtDq6s6An41igLG09mdnQdjWIW6ko566KPIVRhrzPgO+PE6Smyud3EUGGbI4hLSFJHCJF4x02sndnNuvk9JN15ej5SOQe9BW49/jHM/8BPYvfvx/b24l2OcS2A9S5hdViYmZE8vzPJErpznl2DUVbf/i02fv19lP0+k2vWMXH62exvT2BiYGbzWewreviFGdKzzifOTWPFYESQNGuBjgA7y9l5kkZJ6VvMT+dApD0an9ocNR9XL5MqMrSyBw4SB8QgVfG2oP5dZUXVmp6mt2qU0FlDszdNZRQj7gQnrhVC3KKhmreJUCXpQaL77a954ffNzyNG9DWvfjOdc5+YJK3xy9VXZx2sGwkiSoj61yH4fxfMN9QKgsU56O6ZJbHu3/LVIy+PQ7HcWPClXNibjs8Dg02UZBz8zt2IuKZbNfLr1mUvI4TTMYKGeLsonys6o//Uv/KS76yjJB+bRH3F/Kpj6K7agC0G6LbbSRq5yOjY6ymrnxKR89Q6E/ImobdwS4X+QTIYfKDRrHVWVeHW7h34+X1YY9g4dgLNxgjV/CzlwjzJ2PiI64wF3+t2DVxmnD1X78l/q4pYh0lzQtHbEmM4PgawlkZZlX1bVCSd9tqqirsrEzAz0wz27SPdfBytRudNoap+3yXZ6KA3/7+nxb9l7d7dhCplz7EntcZHsg9l/e7zrOidvXn/+9O98IGRsYw2FeFwRI9C1JiINa8wYl6IyLk+zTeqMSLKTu+LLxch/EXDpt+d2HM762/6Lp3dd7I7wE3zA8rnvZz22Y9vxLle2tu9fdaNdkjzFsncfkjsjxpjfgV4AqiPgQ9qjK93YrWnlkoHmN4cydjqH7NZ402IPlmhR9b4d18Wb0p3366r9m0n37OD9u4t7BzdwNSPvAbTn8PvncLZEskaP2uS5k+LxPOADCUo8esukT+dnyq/sHdXQZhcz5obvsjE7RehI2von/k4ykedj1PWmyzbOX/btZTzU6w7/gzKuVlM3jzDGvk1rP0hVEfF2mvLufm3YwafTfKUSBOSfLXx1R4RvWc7X53Kh7qEsoz/XEj6MybO0/R+nbHuLWrkBYKcObx6n8bwKSH+rm+1dkRrlk7Hve1VP/j/T8whjpwffdBDIp8TY846KGfbCDGET4RK344x60XMq43Kr0bR31KtbtJoSNMUxPyDxvjyxd+LAYxjcmTtsNDDoMCXFttoPCtpNP/JJNmmONQjUcVYezzwprzovUkbjdfuG9/09+6Y41BfkVQDGjN7CSrEZvs5JnXvkcgpDPOdJQZcd44kSU/KY3j/AJmeH5SfNQrRgKkGGDGIWETk6Sh/bbJ8nUX+o3ft5b+QtTvkp56BqrlWQ3wMcg+Ve0TQGNBYQQgXhplZl6xa9SmJ/jxrk8tLX7wQaewmA3ZuIe7dC4nBiH27uPQPjBhCCKTNzi+ukXjFzFj8p8GN17F61fiH09aaHwhAVDkxa7n3jzrZY1UvDIvB98PswCXjp5G3WEl+FeHYpQlRLoWPHpNY98oG8soQypfv23zGvy8cezLm219m++49lG1lrZVX573ZP/FVkbmM/6vzM78uMSBp8i4RfnVJPxPJrJPXxshxHv0B6fc0KfukjebfO9HXUPYWVbfcDHpvsHBKf+3xF2w99gxSIm7Ljcxu20Zrei8QMM6c6xoj75XEPW7RXVrrE2JF7TNE5BnG2p9r5vyjidNUp5/NzOY1lIVHnG2ODhY+hPJ8G/1tRTV4U/TFl1AwiXujTZK/GcanDidifKxrNj+j6p5j8uS/Zr74ecod2+Kal/7s9TRap1IWdz/Wpq4EZEIk8bNfUx9waesNJkn+TDDtQ0KYVol1P2usfaHfvesc3+9ttcnd5xN9rzhiO/rJf/3vP+9aI38XyzrBpA7xE6r+wsskMZ80Nv9LEV5vhmJOjPEvUf/LRjxYQTX5NaL9n8iBJAiFryrmGSEWhMEAlzZf7fL0n9E6pPTwGQ/D4n1F8XeSJFeq6i5EerW5PD5RXPJ2QevKp4cJsjFphp+bubZ383VniQLtFrp+DRoUjYF2Z7K0JklUwLqU/t7tvz2Yn3lnY+06kqxJ9DzVGPkKy8p0Lca/66IPFa7Xfv8fNYZ3iUs+7JqNl8QQh/nL5X8H9FkihjizQAwRm9pnpSOdLyEHYtTrpBn7D2VV/rz3/sRGnt1ysBAlGNHp6Pm9GPydYgzqq7Xi3CaM2QycK0ZOO6xeuJQGTK2varhegz8jpjkhzUljwATfjN4PDSaKTVK6+/Y83Taap2d58713zXev+6Cc23tOFdMrG632h22evkRDuIv7yxrHXHf/M3v9ua9Iu42b6uL27ic7+XRcnrxCkH8VY7gnyUlDxKR2s2lmd2hZEbr9YXqreatN03fW+QoWX/Znfdkby5pjbxIx7zlcXYPahiSXS6N1bu+6y5n50mdY/fKfx01M/ipl8a5Dr4WlMOOI9xdXvvwjkyWfE5G/sZK8cdn3d4FJHMX+qW/198+eL8P6Bjve8Ya7fc/7iiNX113sX7KYqSRC1LAnRn28cdlW48wWEdmkWlePcZ0RChY+1N8/D2GUNBOaCb+ksuzlBbQK12sjJ/o+iPy4S5J/1hCHxqq7aUiMqLGYLH+txmXZR7XfBmJgyei1+Chj6+d5TywLbKO5tv3o87DWMSjn6M3vA2CksepNzuaJjxUSFaXAja/dnLYmiVLifYXBnSNizIF8ZYhi+zGEHzYa5lTsvJ2cvHH3N/8T5uc2b3j2i19SDWuexagkLjkmjT2Cy6nWbkTKIk0T/RjeL8ZKL7W9KHp/jRjSvDFZ79jLFi9VojKO5a+MqYdZXAMWHYSLu+DyMRy6DoehoxERIxCq4P8o4KG3l2pqjl5UGu31r2g1RvBVURsOq4psZPRjIjJ5+KIWCmKxkk3aLP1Jm6Uv0WFdu0OnfNRImmSPlWTiK1IUxN3bidGAkZdZl/xrDOEeSQ5gmw3KfbvfWN649TdjPsn8YARnI6tOGHsDRusSkMHj0nzKKH+oGn+nXoyWDsCIDBfreix1Y1iYkfZZj9bGGWfjuz3iYPAsaw9EURoxFFX/YsH8okszjf3uXj/ob+k56GjjXxLrfiocpm/EOjTWC16sKtKJiSfJ6OQ5GuMVR8rHdsSKVZksb8ZqcTc3W0IVjo0h7HJZ2gOzaSnbpz1K9+rv/HXv4/9ysXanKGzEqLzLiNmw/H4qhujshxYu+TJx69YzGxNr//0gkWoIsXJwkQIR0LqU012wfB0Z7vwKXyz78y+sZqf/VKyteaJybayUsqjozwlFfwzjRickT98VNSwZFWOMoP7fE+OoppXBrO8YK39xUPvSnN5N1/xmccctX7Yj45dJkty4cOWlkOeMP+5pH40L80vkNEboVcVHp8vA7O3bmL/mCqzvvVt0GM8+bDNRqxjikxS5SoiI710Vq/JmOZwrbJhAIQA6FN3vspnUO7gavR5j3+QHg8ngvVVkbdRwouL/VdVRTucUO3KYMUlq5U+DxoMWTGPsJJi6+u1hJqigAWd/3ab2AyzWX4vhVlU9KAVRNZKnnZnxzjrSmOKTFm7VmnPTPP3QoRLA8JCEvir/Tn0iTn2PEDEuPTNrj+Oajmy8R2MsvsqoHru0adepsWskzX7HGINYg0nzyyofXq9RFw4mmcwnWa69nXuZvv5GQtG/IEmTH1xqSoxImlJq49VBsktM4i4lybdo0qDVGH2ns+Zgki8u2NZ8Jwy6H1Lvh30p4D2W6nFGPJZ7zc68TzhiRNdQN9QYs78qi7NDCGXi0h1RY77IMBFBhd3dvXveUs2DSVpMNMIFzcz8aogHG+9Mmt6gvv9VP7Ufl7Y/e2jxfWMEse5vurtnTi/nB5eYwyRdLN6LQ/YuEQgh7PU+vjTG+NxK/SfV2s5icsGg7P6PIi7gJZDlbdp5m0468mmLzVXrwTLWEsrymv7uvV/ygx7WJmRp9utijDuwmxtCWWyTsdG/TtauJe7bR/eKyxhcfzVjduQdzYn1j/XD0GERQQNU1dxfVjpHLAc4rU4y1rz+IGIaQxWrF3j13xaJ+OlZ+jt2D6qF3qtYVhkHEWRYcinEeENQ3XJYTQfBGJnzxJ8fzM2fEQbV39pmfoqx9geIukej3pEkDcrpBWb37WNgEprrT3hfkjcnNRxcnqkWh6Ho+98oe+WfH5phpiGIa3aeLy4DIiFULx0MihcenJxYi/gz++e+suvOvewJGdUJZzZaJ5x84XCnPehaH/1l3vvTYogvB51Z+tKXaKO9ENaeAKOraY+N2dE1E+/WuqHLm9USAOPws3N/uXDtdx4vGvtibWcpJ14EQS6PxhD68/jtW5Gi+mNZVgLKtlr0tt3xb92L//vG4pZr6G/dQm/LLVhjnp+l+VsPbfdQavqLarb3uGLv9BuWF4hUQFTn7FD6OhI4gqJ7LcJUoXjeQn9qvuFaX7RJMhn8gcmggM7sf/HIE5+q0TwDnZ5+VELz81EPXunEWIpdO147c+ttdM571lsbG445rpqZWiq8UBv4+KwKvxC8Ynx8AuiFiDznoEFUfXdQf7ER+3Yj5jTViDiLqvlOWfSfb63sc6mh2eg8U6x7Iz7iQ/idBVn4sg4WMHfsQhQ6J5/9VtMcPz+UJYs6gwKY9JVGUso9d+KaSZJObvrlYXjs8PEKvvzV1tqNxBiYvuFKqqldjJz12POap5z1tmp630ERYBX+l5p5Z29LLf6UnDTP/oJ+n8XVXsTge71/q8ref+IEU0QIirgMm2UvOSidMgR00P9odO5viqC7siT5zEHBC8OXiCZeTAgvIeo2a9zTRPSDRtxGNRHQOwnyZKPJtkbHAYE0D8/NW/Hl9bAuU3/EoBor1eqFVVF9zrrso3JogV4Rg0Y0xG6l1fMI+o0szb4gcmBxRCBWfNtYuS2xigmRpuW9on5i+WYwLHJxUYj+abEUddb+KIk5Y1lwBib4b8VQMVjwZEnyt5oxfqi+IgJibVH1y5/s7t/9UbMwe47Lsn85IPnU/u2FYvqfq3mPGx1l8hlPfXyi8rhqWYq0hoAm5lfy9asRNVQzs2BIjJV/P5QrJm9Qzc//dqz67zRmQDIy+n8lSdFFrtSBQt+sj9k6MrL7kbO6q16DyOfKQfhOmoz9dN5sXLCc5MYKg154T6zMN6x4oDwv64x8GaJbzk1nLYP+wt/2Zua/bic2ttNW8w9Dd36J5HWhB7993+yuH8YljG1Yg1Ul+rj+IHlR2B+QXzIYROQvFEWsJQ4G27wPj0saTRxK1EjwfMdq/BsRPh9FP0sVCdsa9Peso7nOnpw2s3dqWHaiijVU1cIfVj5c6cabkE1ixfw0atq6XHqBLVHsf5gqMrf/DuYanvyk48hXr/tYLMulwBhrDYOi+ubeBf/uVmZpJqB+cGL0/gVmKOKJMYiROLjz5l+o9u3Grd6I3Xw6MfNYG5/hMvdri0crDe0CujBXvCTrKHmWf80YOWF5UJLUef4Xlt255xU7Z0marae3Nox9Jfphxp0qxplNhbgXd+d67w4LLbKRcduekH8LpV/aFWsPkgGN+6sQnxEj1zQ6yYutNS+K/q67kRg7G8riPPX+Jpfmv2kT97wlfbuOCcI48/vNRgNxYGw8HZWfCv5A/4sIVeW3aNCn2sRhMz3eGvfBg0ic5KivPhD607Ry9/S03Xxt9HcpIoxG3eZ9eE6x0LvBTq42I2ee/eXY7S2pfmJAWqO3I/5zLixgNSUOwu9ocnCYbtXv/oOMT+zqbNiIKT1+UGJc+ttGdCRW5ZKoLiL0ttz8V6Y18k7TbGKb+RtE3YsWSW6dYdCtPje7v7etMVqXPT8SOHJEj/ooX3Rx2LG02fyn5dbL2jin29TEN9c7hfupLEn+ZagjLV1nnaOsyi8FjW9qbjwGl+ZvMKiN/oCRSYAQ44vS9gix22Wwdwcubz250R4/a2lwBILnKo0KiQJasSgEiag18iZjWKOR0xBRrHy66A1+Ickcrt1EvvVl4rU3kW44kfHTX/QJySKxNxiSUvBlvGJuJ2+3idKaDDTGxsG4X1UfOGg3D+GtFvChwOUjrJKUrD3yHtse3RAGvQMegqi+6PofTYtImjh0UOKy5Desq0tHAxAjVaV/4449dSrddDJJo4G4hKLrW87aj7FsuxabEOf2/U+SgGTpr1prn7q8hrtkGX7/nsul0X6eyxvEZq+TjrU+H8OBkskYg0aI266/vvQpPb+afJS/1eAmlouh1gmDQZjqTs2e1xxxtyl5Ii79v4dar009B3xBPF+y9CYLZ1pn/mT5+ItzhF73Yom9/9RGk74X0uj+KHWHJO8oOzTEk+pwUftj1uo/IrSWRG1rCDu3/8pcYfYXNrp1zexjhxr9xBiUeGuMPNFXxb7goJG23q+93rgu2h6MATH0vnvRLyaSkm06DTWhI4n5kXiQdAFi07c7Vaq9C/ieRzJDc9T9Rh2dfGBBiJX/cKzKtySJaxiX/i5VfKvKgT5QVYoivNk5kBjWibUB2Mv3iSO4owe0KnBZ428xoOGAKKaRsor+FGfEmIb7FyP2lbVdbfm5Y0LR7X95rhpckLsMg0Vi+BkVljrKWWF2vvrIdL91SacosN/6Ar25aUZf8IrfNas3ELrzw2cakP5nDAVSp0B8WMT8ioaAJNmxJpX36GKyDIKz5mVY86aIv8BF3+uceR6tE88i6TR+0yWDM0J/sQ214a/05QsDFmvAigUfX4fxpy69i0uoegs7u3vu/JB1DjeyjqS9Ftuuzk+seVMo+ksuLEkSQtSfzlvpvjQtMQlIX89E488tTaUhh0PBO6MmmEyoCiFOzZCP2M/j8vFFwgybOVgI8lt5nmapTd510KQ0BvWh52e7F4SdO7CrJ2lu3vxx7Q8ay12Wxlh8KC8r+uWFtp2xelP6g03nXrt8ZwWw1mi/P3jKwNvbWs5gie81RkaXm1xEBHFQDsKz5++4+bokyxjZcPxHai/N8vBz0Kg/3d3Xx41nNEebz1avL4qHWA+VuJBmyR8q/ABwzqIxEeq68GU5+Ohgevf/aq3eSGdi9edBJ2JVHSCcEeJgsAvHE33l9nX3Kflo9rSsZX8iVAfPyVDFr/W2b/9MsnqCWMyTOPe+JG+jcTGwy1IOev8xmJvZiU3pMYmQMJHo/wAay1VJjRGM2NaJp79XffVCDX7tkhRq6oi8QVG+0hp/W2d16+SofBejFwIv4vvEkYt1N0IyMnGWiLxi+emcIhKrweA9qD7FtZsfQHXNXQwTKBriP/X2zf5sHGkQvCWGcFKSyOkyTBdVjWBTTCv5tYxAFefhiefSysae0Fi17nmx3126X/CRQU/fh0lpJpaI/x0t9dEuS56tSi2WyaJdod7Fkkb2pCr6PxssdH+B0VHc5KqTE+v+JBwIIMFaYXa290vFwN8Rml18jIhd92KMe68ealH1gz+3gz60JiDtQFm0TaqfWZ6TJNZRTu39LL7/wdiYoN+PNJzfnI93LtIY7SLxBKiCfiIk7CIGQhXAWzDun02SPPUgQ6YYZmcWXmMl0zxJ3z60jNTfDdMksclLzdjkdDk/hRThrVTx2XXF1gPtj8HjB+XLzIYzSZL4mIbTz8Z4iCguQtUrX9VOuD5pggT32KTd+NnlIrJITayFveHVQc3XsoFHAq8z1p4W4zLVTiyl7/5ZaIYb+ltvIU/PfPzIqvH/qsLhCn/KKQpvPdw09KW+TyKvTk84iTRtfEJCuCAOVaSl+abWR2ufYlK3L/YrsoYhz5MPHGwqEmJQFnZs/4n8cc8kWzOJzk79L5ckL1x+MGVd89/+D+OaaJqRFLPko82nJbn73aXN7qAukxfFYnFOLbp+Ba1KvOqrtSw/aAmnIfYbLpFWxF95uPf8XnHEiB6riEvMOw8VkTSo2sy9SIz9lcXTR4eVH2pdMsSFEMOvivJ3dYHEGXIpMSPjT5ZkVW2IAmye0tsz+2V/5547RtaMMbdqFb7sMNHp/JuoIfpqSRRWqo+EqPvUG0IqxEifyAXqyxdojM+StLFONO7w3l9uxPylWFkVNWIwL7Mkv2CqCmvkS8trnxtj8CF8Aw3vzhLH3GxB3mr/iHXJR/xBE1sIZTHwMf8/yfpTKMSjoU+eZ/+F6Pii/isuwWTJQu/iK19GDMjpTwLssVmWXqohji1VQ4Whf9u8OwRP0a9IDYyMJX+GuFeHcIDIzjl683NfnJ/qf3DduolUnLxlOTlto8lg57bPDfbs/FxYewLt0x79ojS174zlgOWTzgC+V/xeKP1tabPamLn0a4fUyxueMBu+4BcGH5Q8R2IXqeK/iGmjLOs3JxRd/1dTW/37mqsCY2efnThJ/iz0uweRT43cGfZ3fxM/oLV69dnZSPOiUB3OtXSoRRFAMc5dV/X9H5fl4AN50yWJ2C+qD08/OIZIECvMzc6/wI52bm3Ygiydw7TbP4uYY2MYSjTDMOUqht8sGmx3YZZmv/E2yfJfWprDLKqI8VuG5NrGRAfTTIjbbl5vbeOLh68Zcbi2A/BpvzD/yzh7q0We5Vrtz4iThi91qpiXdxzuF75XHLkKMy5ZB/qCu0T8CNYYt/mgDrIOgieG+E9FlN8V0e1OIEsNLh2B6JE0O3V5zS+JQpT4H4WtiNWAfMbRnpz4Gxfj8T4unWRaH3Zg3e93Jh3V7DzqhRgMkgihLD4tyKfVRmJVEg0TRux7gcX+326NmTBiPw5y7IGdMKI2Ixp9eauT4ytlTEd+cGRk9JOLx0gdeF0lRv7Di1sQUxdUTJx9vxGesLTzGgO+pDu18Hp32hO7jZGMQa/YkDaSi0XMqoPPRBOihh0i/a/kzlEOBNexv2es+fUQlhPPENBpKfXHVncM1oXnRtLWctE4eo9K8lppjeAS9+zE8tFa+jrYel4NuruL2b3/I12zYdw5801E27pswVCNmKQZTeJ+wpm6Um6STrwwceasuKx8sbFCKLiq25t/y9hJQtJIqPoLrzImHznIcGot0SU/Nr9jB643/6g1z33Bt8PcVFqfo7bc6qwB4htVpS3Co0AccAdiLgr9/hc0RFxqnyAiHxFh46FT0ZqEQTH/v/b0bvtC03dodNYjromqe9vyICyxFt/vXq9V9Wd9LejYzpsS697h4wEjZN0PIMT/bawQqy46ZzLprPmaGpMeJhrpMpQ/VdXHiMgmwKvqNaBf1ChXSaODdfKrYt27Fl3sYcH/TDl17ydh3hccMaKXvekXt8bXEg5zntchovotGsOnw9z0/43qrqU9jjBAJSFdvRpNHCoW8eWYVn0WUwZDUWBHm98eXXsGLHQxs3Ovtca/MSxzQQzPQPu34OO1aEEoepgs2+Qyc3wV/VeNTTDO0tu7A5s0zmitXX1prKpmPWCCahxFuFL+X3tfHqVZVd3722e40zfWPPU8MkM3QUFmJQyaBAVUBMQkDjhkUJIYw3OAGJ+CUeNDTSJLDRoEDBEQXlSiKKPS0EADTXfT9FBVXV1d4zff8Qzvj6+qu7ohK75nZ628Zf/W+mqtqvrWveeee/YZ9v7t/eNs0UEOp1wBzc3PfVNVJ/fkTz4TIHVpZ6njLnDe1ueyNgORBABjAcZwd+AzZJrBF8FXOeNX6YVORy9APL1329Q9d95WPPUsBL0nLw8sHifB+40GrLFTxKgHAIRgqFXDu+MkRKFYQL7ofMLNieuNNvvH0nwV1SRJzkMp36LZaag4eYPIu5jfjhIRVBLfbPPBWNBdvlRY3NXWiDM1Yqy0//0YA8P571JXpy8E30QWiw+avK2FyBUQjey8Pnppc8V0Hg0KyigO0CfJcWHNgi2yYag1Z34nQQuB2wVuPDCGqxcubESErF75W8PF0/7iJesczh/VYcPPUjsMixoTOGE/VR+Y1lp/nYiD7bdKA204VBjB8eRnuJe7Dtq8gmLKuEAaN4db47uuzSUhCr19AA+gVfoaztnKgwyTSyT18TcTAX2lpR90JPtKliWwWqUkHWeBsceA/YFmBkgyV0r5OKSzal58Yv+9iSPJWg8pnd3lOYW7MP9/0y7/DcZXc0d8jUDntb8v0Go2bq8n4z/gpcOjy3bYCDOSOacvLJzQzk1jf0OgswD7bgBvtcasMxarjUqutUZtbgsctFd4HdbQ2jeKcGw3Wru3Ia1MTbOFZaIZyyjVm6gWgpF4j+wd+MeDnEztn2ma6Q/AKJAFZL5wjfScHcLhP3ek3MI4P8XAQHjub7uF/EajdLA/4gQLIlrGOT/IyNH2lGpLuIZ39oAYf59gdBc4g47CrSZNryUuFrSDrLb6njRTkEx+lzH+wUOdSSaOAMe/tvPcc5BbuuhUJPHTxHm/TRSSeuVyw7B9foeitYbjOJ/3gxKkcD/tFdlfg8wCKjqDtQbJ5MQlNo2fhhCw+S6Qm1sLc/BZkjE2IDl9gSlzF6yFiuO7rbVjC8sNG1grmHi37+R2wNrFh9aNJcZglKqbNPqs7OqBmy/CcdhRxGndwlWfCSBqpX8ZzvBRJ+uE5B6I2QDAuv2EIs6QpdnGqFL/C55lp5Z6+p5wy52BDkNkSfpGC/rFfMvakTcqwbJz5uPb2mhoZTuY0R9yCsUd3MtdZ43GoW2eGz9IqpUP6FaCvN8P+N1oJBmUxZlsAfWaM4awNnudzZVf8nr6P+k54qucC5gsuV0n8RcX5qoTYaPWqFllVwjP2wgh1hPNeWGsPeBcYARonGuVLVg75xeChiUcwzj/O87pJSKcB9h2dCJLN6ssuYLlAtB/Ur77V8VhW9FFsTxoswQgNhcyMkk9rV/vCk+7wn/k4HAbw0EdJiSy1gzSib1grg+TxGDd/fd5nT2fgDYAWVgDAYg3C0mrwdhN5pAdDREhicLLlDa1wPfAyV/DXPqHNh3WgjN2lLV2g7X0gFfuPh/AKxNb9ofwqGnRlg8iADpqJe7gopOY510KnX6MqJ1Uk0FcKHNuAdp8cT4mbmHBid3MHJzOGK17xVEGgDEKnPGc37v4KuZ63yFrQIIQR9FfWubcKX3/CyZse+atwax0WSQsfZ5Af24OcRgBQBolV6Vh6243n4dkBHgEgHKH8sGJ6DJGAiCCipMXibGvc8f5wULnKQBixK4B8KoGwzwf0cvbvhpv26z8Y06Gs3wAlDZ+m2ybdjpHF4fKMKK4vinX6yBwPXDOYKwtW2OKB1GRYbZ4Xb1Xi8C7VcUROGfIVHYD890XZamkbK3eZt20n9WTgv/MWHwPsKOcsZUAnc0IHZhnTs5HaQ6arAGTpVtkvvhD4Xlg0gOX7dAuMepe2Ettnr3UnMtbyeJqCw2TmQzcvdLx/I+agyZPLOac/b0g9i5izG8XybQw3LlSOOK9Jm6dM+/YdDx/vWP9bcaYewDSRPxkIjptf1vtnGZbHA8ntcqZfl8vAnTiPzjT/1/j8IXXVKoWFFuEJfYdkNRgsu1sWTDbay6hpAuidhqezjLIpWshlh8NrjIwY2CMftKk0c8Z8XPmad7CYXe3ncgHuVgAImiT/rXWyX2MBEx7Vl/J6ECV0wW01PPtnNzSIQQbkLXQRr8LhEHOxGfnXxzjPIAQT85t70GckMTsY/HY6LDm4Wv9xWvahJ72ZEaM+B+1Iz5z9zhEGomIgQR9jxwXMLpNG23af8uYvcm++ASyxWtflstWDpmoBRB8WBpmxLyDj0AAca7imcpblLX3c98H0wq61WyrxUpnkksHh8az235QgiFxtXRpjKyW1h7UvP0GzhwHVqn9EyIRoNMU2vJbRM8ygDGo2jQYaInwnIOuYbT5nw4XYA6BkUWWagCYYUI0AFXA3MTApXOVcHCVtQaME9JY/4C5HdfH255AODt5S/n0Cz9E9gDfYi4s/baFN7NzD0aMwWbZsMnSzcwP3nhgnBCs0l/j3Ac5BRhkUCoEjAUJOc6ZM38VWAsI17uxnc5rwUmgGs2eH6Yt25HvCjzHW6grv4Q4vX9+fAnfR7h34p7prc98t7xq+fLi4Opz1Fz+x5zi7gBx+sDB3uq5vm6HPZ9JwuR8o1QFaC8IhwuHbetOoBfaKwxra4PH4c1FxeDEMWwWwzgu4lwJSVAE1xm8Vg0yCdtVSIkQVCcQzE7AWI1UcPAsglHx5Rao7qcBvsK/0Y5ra61uNFp/CkQQjgvmegDjD0Ob8VeKzNtXuRCBuDBZlLw3btW/Hev4x7SQfDhPc7QW3JVII3Nz2qIbOWmoZnOjBfa2FVjnBgvm9MXaNM16lugLIOU+WvAdWAur29lbBmZDGpk3aQM0uySaQn+eHXC0+QAOMXKCsdiQxvp4k5n7yRowx0Pme4iyCIlOkJn0jldjTzIiJFHjtiRLNzYmdUMpgA45BraPVBzJ9OR1JolGMcfpJmKwabLLdPXtYsetB1wXZnw3bNSYwv6EGguAAxw/4QIAA1phjGhmBvHEeKLC1m38UJlgauuJa6MeTVrxxRYCrDwA5nVsUq3mjfSfyArT3CSksvRxTXKdLJa/QQvOyQTAcP5DLQiaWyijEGcJIpMhUeldZA/sjgDs14BrX1O/I9PZz6UwIKNum8toOnDzuWMEEYOGfSaNw0uz0VE0x3d9QTNsPZTDfujQY7ydk5A06l9LqjPrQXz6lWP21we//vrrD8uFbnrs6d2ciT8SrossiTe0ZiY+k6kYaauG2C9C5AoY2PIEBrZvxMDwZpS3b0Jh/GWU6xMY2P0Chl7ehO6Rl1CYnUDqemh09QEWLab1XSA6hRFbvCAChLkEmfGsWfuQseaLXEjoLIVwc3CCAqBNpuPW/eDiQgI6X9FgxuZX28Qac6fRuDwFe6DlCBid7XMNlUiI04jx9uLPOEAWql65Pkvsx3RGYKtWQCxbaUxt9mEO+04SjpwndxNjsFpt1ml6QcyDJ9TUvlFHirfSXDEBIgZiBJWm3zNWX2Scgk2ZA9E3CKHFdjKqzAU7lfZXRJ3zYBFGTZJ9Sin7HsvYNCUJtBDIGINTyAFeAF0oQ1izhStzLBg7dr6/GDHoLL0tqk9dpUSAqUmb+Z4dDQJ58QExRIIhVJVJr6y/tOsWcr0ev1w802oLIotWoq8NU/OszjLInAfZ1QXr+jvI2CsZoUBCQsWth9I9w1/SjSqiMII/MQrrOjBGQ0+NPcjzpbOZ4y7ZvyW3BirT31Bp8hbj5iGMhZQEtvQo2Pr0T8CYJMbPejXW91w4d4eOkk8onX1AZSpOK9WYOfIPuSPdduJLtrceVz6emRBJVkPGXUh/CcgpQVjeYDbdBsJlNH/uYAxkzR6d6ssVd+9pSAGYTlDkz9gsrroBu7Cd03BgPBpj78oYuzCemtCiexDe+hMVGtFtAuIkYlj1au1uv3/9U234+3Sr9hUY1abuZjFE4UAtvD/9raP/3w1z/n6Hq/BE+YZ/RFdn1yWuw15fr4WfTjWb4NAI/QKk0TjluR+ja+wlWC5hXB/1JIO1CjmrwaQDK1xYGDhpBgVgfNWx2H3iOQAJuFETYOwtDOwCEJYaYtOai59nkt+RVKstJ1cAkxJJ2IDMdcArlKDiECpsgMeR8AjXgNEbIJylhnNQlk4iS3YaTb8gRz4Ine2N/S649SnkxrZgemg5skIfCjo7V6TR5VbKxdBmaxpH/9SMm885XauAVKKruhkqH2DSKyLfai3zfO/PSMiTIJy9YRL+MAL9Ux4MsVNE+MKT6B3qX8OK5XeRtSeloH0a9l9Man7E+vvhPvEQlu5+HrtPvwx1r4Agm4Hw/ItI6yutMYPgbIdxvAeVFN83iU2Y64PBIpuZgXYYlj/3EEq1KVjPx+ziVZhafgIIHDJuXmoZv8BaIzhj9+kkvrueNGGCTjSGQ+SWdKKjyC9iUfROsraLGP9lkoVfUZxNzW6fgjvYh57e4h+jVVunyX1gTyLvSCwHGYvOkkAux5EoC5FEnW5mrmWB12pM7/mc2bXDZl4ei1szWLTxp9hSXoTkgsthxoch+peAd3Re7qn0HCJqpZX6nUolG/jgIDQ88G99EX2z21G79I/RHFgKUZuFzOfXgHAFgNOJqN8CM9p1N5tW+CDX+m6jjOG+RG3PCBq7xzB42muWSte9jhvpjmeNz1XU9FaQAARH72wFx0xUkToOZgdWod4/AJ601vpK/QGM6TVab+BS3NqS+UgkEYY2P4TM+NjV/1qkZRc9fvP1UPRuxtkSItqaVOrfp+7eHzJPIHzuGTQUwTt+GQo1BckdQOJCC3ozQCeB4AE0YpPkGcbZfWFknmLSBUtmAZVBOwWYsApvoH//cXfHNW/5te3z8Bn69begu6cT3CRo1GJABIj8HLhROOXJe9E1PYxWsRtEDIyAViuEIQvHcSDmSBoWgOUSLG2XfppceTy2nnkJyGg4rRqs8GHKndCtEE6rglxch9i1DVIrOLkAWisw4uBCttlvtVlM9S5F86Qz4XIGoVLo2UnEXYOwlSmIRhO8oxO6pw/utuex4hf3oCNuoVHuwq7Vr0HlmNdAzOyD4AwN14c3M4W+0RfRmq0BSYZjkykYzjAxtAq7VqyHdV04xTIYGMz4DsiwjpV7d8Jog6dKS+CtOgo+NNJCB6g2DdmoIFpyPPRTP0Fw25fwuqNWobnkaDx18sXIigUUsxbSKEIoc8hxBS9L4beqQKOBVhhBdQ8i8YpYuu0xLB55ASkJSFhIBuwJOjB89mVA3yLwqQkYo+BIhpC7aFWncOK2p1CYmMTUqqMxs+JoxOU+EBG8sIGa4GBpiGWP/ASmpxcTJ5yKWi6HUrWJwtZnkAsrMNwBFwTO2vyISv8yhPk+OJIQ1SYRT02is1XHCZMvoz4zja3PboQ5400wJ7wWTrkb8ByYYhe0lwMND8MGLnjvEMw3Pwv70A+xaM1KOIUSxi68GtHQGvhJHdoSrJeD9XyYJEIQ1ZCECdLOfkBrcGYQ7h1FsmsEPeuPh/GLUE4ZbOQFdO15FhIMqeOif2IMHTPjAOfIch0YW3E8xpYfB94zBFmdgq7MIlu8ErwyjWMe/Vf0zIxBS4Ga14nR1adg7Oh1cJtNBDYBSl1oxQzs+UdxzNQWFI3BVKETz558FjxRRB4MOudDKw2oDIwYMteFrVYRqBSJBog7oPj/E0PvuOEWdHV3QiBDsxohDDrBjMIpT9+H7tk9aOQ7QXPnVkaEVjOEYa80dLB2tQ1rDXKNWUwvPQpbzrgEaVBArl6Bv283unc8h46wAi9TiGcnoY1GUCy2PflpDKsVGOOwSYzpWGHmrIuxr9CD8N5bcWLZR/7sizDslNDoXQG3VEL8s3uw4umfoD+fQ1bqhhc1YMMmhletw9jxZ0D3DKK4YxOWbXoYPVED23e+hAwWi48+BUwlKEZVjC86ClvWvQGOYFj67EMoTI1CqBRCK4gswWSxD1t++ypwydE5vgv9256C06yi0bsEz//rP4PFIU656PdQCiuoeWVsOvttiAeWwJnci/zenVgythVeYxZuliBt1DAyPIzI8eGWO7GkEAC5IjQAAYKQHK3tL2K21IPqJe9D1LcCYna87ewijtUP3YOhsZehcwFgMsROgMrQSkwtOw6tnsVQUR2rNvwYy/Zsh2KEfQMrMbH8WAzu3oKe8e0gZgFiSBSgrIWwBiZXQhwUwIxuD1Ai8LABzjmmWyG2Pv0UbBLjuDPPRWdPL1TYRLOzH5NrTkZFlJAIgN/9Ldif/gC2tw9DK1eigxQyC+w9/2rEJ74ONmrCm96H3l2bkGtU4DdmoYxBbXAlGqU+qFIJUzM1TFUTDJ58PAKdofvl57Bo+0YEcQTNCGSBluMicVwIa+FlCVjYRM3PY8+Kk9A6aj1sqRfuzBhWP/p95CsTiIo9ACz8uAGZhNh27DkYPfZ0OIUcdK2K1h3/CDx0H84++0x0LVkGVGcwMrgC2044D04UQ1b2ojy2A/k5QZxWoROVzkVIegbRgAfGOERrAjxqQrslmFYF3uDAfkPf9Z7f/bXt87/E0GuNDLFXxCnP3I/+iR1oFLoX0AbpHMbYCa1m6+ca5jnXdcGJMOemEmDizbCm31jzHRBqubCG6aE1mO5fjo6RrVDPP4lyvuB5vf0fBZeFRhTdlqns2aDQrhPAtJmLsBAs0VBjcjzLmo3JlBii2Wl/cNnK/p7A3ZVwgT1rT8Oul7ZC3fcdrDzhRAysOaYAY/7MAD6y5J/CvcNb1LK1SAZXoPulp0EqBXX0XrRz184nVaamj1l9FDKjVlno5aLZ+Pe43ANhFPzadE75hQsNF8t0O4x4R6CSsVq+Ay1tUBzfDS7EElEqt9CozDz54jZo6RXXnXhiF5fOLrc+jXr3ECYWrUVx7050TY1AMLYoc7wPMunaVhTdPDIyss+kETwp0bdiNTgXMNpAMlrtuM411Vr9x42RHf/OghyqJ5+H+rozkPUM4Niffg+LtjyBRqkXIDAwXMxV2i2i5jcSxzON3iXwWw0E1WkkuSKI8DoRhztkGk8ox+3L/NxKWPs4wULZNu+OEfU6Rr+etBqygCKwbxJjjYwIkBJRq3nq7NT0DkaY6u/uguf5pFR2ukiiF42Qs1H/ckxNjKO68RcQ5S4QF/liqdCnGXbw2Slknf1Iz3gjvOkx5HZuRjGqw82X3qU9f41R2c08bOzTjgcrHVRlDvs6FqHHIZSq48hVJpB5+aOVdANrzUZgfzQLDFjLGT8D1ki0Gt8e3vJ8uM24GDjnQqzXdaAyhThXKjFrzwewxBJZniW3eo3KzL416zF25sXoeuAO0MP3Q/cMDpR6+qXkbATWws0STFqJNGyBVadR8hx0Dwz8VZYmUFH8JZMrxmH3AKY7liDqHkKmQsReDkbkYMIKvIEDhr7zfRf/2vZ52A1d2hR7dYDFe7fj5Of+Dc18JxYkcnCARgEMW2t7tdF/bi3uZkRgjGCBExixTRZ4FNZ2WLLvsKDn/aQFkcaIuEAl1uuLHZ0PwNonrLV1IrzRAjcYxr7IOANp2xY1B+B63p/MzE6dvndk+O39fX0o9/S9l3NxXhzHby96Lka3PI/nX9gMFMo4bt26M4aGhu4LW61HOOeRdJw3NhqNj0oV/b2rFSLpwzCBYrH4zO5du3ZXK5W3HH3ccZCcb86MfqLeav1hTiv4XoBUOpcQ7L8C+C7aIcxPgfGtvFVDliTIvADS9T6fRGGuWa9/MAVQLBT+phDku7Is/QC4gAjr4GEdSnpAseMy7vrfhFYPaGNIcHH+2Nied0xOTdzveT6WLVsB13WhtT6Nc/Zta/GYUtkxmVLvQNTa4VSnUDnhdCRL12L5Mw9CczGvwLIMxLZYa7eBaARGXy2SsAohoRyvHbIC7YbFxyxwBwhvJ+BzgF0OtI18rrDap5jFJ0B0J4isEPwjRGxKaQ2lFThjn/U9/wqVpUubjSZcz3MA7AbR75MxDzgqQatWQyQcAIR8ofhB4uz6mempXu644CpFCQoMhMwLYLzcZzjnv6cyNcoYRojo/WQMYAwkDFwYZJmCEg6U6wPWfoOANYA9E8CC8Cz9b4B+C4Rn84XiKdu3bb18w+OPPZAHcOYFFyDf3Yc0jq4B4R/m3iU3sH9BsKMiiVFNMjhZAlYoo1gq3Vuv15dNTOw7kXMBIkKRE7iUyBhnbpD7FwICIuoWXNyOTH1RJi0wa2CEg1S6SIJiu1lGt2nic964+//5W7+2fR52SSbNBZw4xuKxF5FJF/bAphxo611NGaNPs9Z+JPD9Lxtj79ZzA4KI+gA8bI05m4DHldIf11q/PdZAkgHMWKfU2XlPmqT/bI3+MOMCWZa9JpfLPWGVehRKbciURjanpqKMGuro6HxbsVB4V7PRiNMk+ZTjUd4ahUZiYcudWH3Ka8C48Eul4veTOL45TdJPer6DaqVyru/7D3LPfcQAL1CSQqcZ4ij68NDQ0L2zlVnsHh1ZsWzR4kU7X95+RhTFWLpsOYIgD0qTThA2wJor5x+dEyFiAnUVwtTr6OgUx/pB/qLJickPBrkcivnCdUT0S244GCdUMoNYCzicLe5g/HaVJldzxm5PkxgZF+/t7e+/M4mTpcaYaaMyOPkAqTW/xYVY1Wo0VltjEQSeq6QAlcro2fsynH07kAXFtvhEe7B3AfiltfZcWPskETshdXMPM9ZWc5lregXAPK85nfv9EFCnteZ+wejKNE0xunsMWZqif2gR8qUiVJZtj6NoiVLZL+M4PtX1vBRAA9amlgiZG4BKDJ4xMFoj09mb8kGxp6Oz8/yw1XqAXBctFkAICWMMJHAFWbyYJsmbhODwAh9GG1je1t9KAWCeVNl+ziaA6iubjcAacxOAL+wbH/vLjo6Oe88465zBLMsqRsh2olQ7YvNzGHNl+3ptyeaMS4i0hYQJoBX6xOhMIUVHIZ8bMsaMOdJBvliE0gYSlnEhLknj5I+V0V9RqRJkLRLuArAgY8HiGG6rMUd0YFhY6ORw4LAaOlmL0C9hcOeT6KqMIQyKOCRwGAKwjPE7ibBuZGTkpsmJCQwMDmJwaAhJkowT0VrO+WcAqPrs7D+0Wk0U8gV4fg5EdAYsVJokH5ZSgnMOY/QGrfW9ZO2HtNYblFKIohDWGkjpSBBDluk3Oa73I88PhrTOnhJC+rCIevv6QZxBcHFemqS1qNX6pOACxhK01j8zxvzIkfL9RPRHqWpibGwU1uKhxcuWTQ32D5zrSHmWUuoxgCqe50IKgTka8G4AxwH0ONruh3caa7cLKVEoFKGNAYytc85Q6ug4Np/LtaQUFMfJPsY5iAilcgeKxkBKeWUUR0+Pj++9vaPcgc6uLihjbmFEH+ofHHh7lqqvGmtRmZkB4/xmLsRix3XHORdf3js28rkkicCYgFYKvb29KDsOsmx/eugEgCWc8yestYOtZmNjlqbwggBeELSZY4AionZ2DoOaZ3HY+XIwAAC7nRh7twV7hBhr5gL/MiVFi2g/UWSZsfbvORdusVR6wVp7HBGNAuDEGJRSyOakkaXjvEVIuS8MwzcYrW+Io+gBznm7NDNX0FojFeKsfD5/Rz6f25oq9c4wU08C2N8ih7GDlxdAz30ORWKBktUGSZLc6JeDd646au2brbHfajYbSJMUjLGXAXwcRI8CMIzYZZzxSQUNlstBaA3PDz6ttLohbYaVzq6eG6v16lXGArOzFXiOA2OMUlqf1dndfXuaphdXZ2evUiqdYL+qrt1hwOFjxgGIckVInWLJ7ueghcD+2O8BEBEJxnhHq9X86K6du+5p1GvoHxiYI2mQVkrVGGPXWWs+Uijmf9bRWUKWKKRJBiJMW8fpcDyPM0aaMQYpJaSUS+q12gP1Wg35QgE9Pb1z9Ea2Og5bn07S5DICfdgP6K+I8TVh2DzFGvswonb5aS7EZBDkuuIkQT4vITiH77ngjC1WWj/CiCClA8fzkcQx4jC6aemy5d+O4mhmplp5d/fgIFxHwnc8qLYRDQDYBqJL5zpgup3swuD7PgjUo42lKAo/3tXV9WWtlA3D8BOcy+NarVafMWbCdRyI9kQ2TowG8/k8yuUSwjDC6PBuLF+xoq9YLOwzxmB6ahr7xsfR1dVFHV1dH43C8FY/8J/s7esna8xn5wo6zNWNP4ht5RERKaVu0Fq/zfdzX3Uc9/c555BCtPPgM5XLsqzSro5iKo7j5ISQgLVIdXvnBKJFVpvHNNk/YJxnHR2dLQJghIBSCgT4gjE3isJ3a6UfKxSLW5TWewhocsbQDENUpmfABUdXb8//4Fwsslbtcnz/DGvMiUkcb3JcF34hD2sNpXE6qq09XSXJh7kQDzmMr7XWjv6HSaD/MZid46R39/SAgfp3vLx9PI5ilMpllAolKK0WAXgWRG8FYCxhWsGiUasjjiJ4vgcm+J9Ixn4S+EElUeqKeq1+FayF7wXI50sw1jhh2HwkjsJFruvfXe7q+plW+piFJJ3/ahw2Ck7qBpDNOo556kcotKpI3Bxepdt9ACUQ3qONvifLEgwODWFw0SIkSQIAi7kQu9IkuYJx/jGVpstrMxXUqlUkcQpj8BwRbZBSvsS46CMiwYh9SSm1mlznC/muTrhBMEdeovWc81MY8MmcH/QVisUzpmemPqeybI3n++dI34Ub+MgV8nA99wkLs9l13efBWA8RuUTs69bafrLmK9ZoeI6LVavX4NjjjkdPb+8tqVaLms2m36xUNjZnZxA3GmjrZwIAcgBKxpqKsaZurbEEC6000iRFmqYXMMJ66cjPWGteq405I0vTv2GE9YKzcxkBRuv2Spcm35Vc6q7unnu4EPk0TYrljo5/18bMvPzyju/v3LETWZaht68XuVz+b7kQ9wshNnPOR+IkXT41M4tKtY6Z2QqSJAXnB60ieWutC2L/xjmPuOCvC3I5cMGxb+84hnftRhzHiRDiT+MwYkKIjyRxHI8OD2NiYgJmbvIAqATYwFo9bawJqS1pAzrQHwFjtMZYg3q9droxJuKMnQdg2ti5yZYzuJ53QS6XP04I+XVOvGC0/gXn/Cue44IRYWrfBKb2TTDB+SYh+OuVym4mgic4BZITBCcI9irLC1AAUD7oL+2G5RjREGP8aGPM00mS7DZK/Qgw7SpV7e8UARSMNbPGmkZmLCXGINUKaZbCgG7gjIcMbKNSepisnRoaGPxyb3c3yuUSNAy4K5ZJ192VJIkLwm2CiyHXlXAc8St9DgcO24r+2pceRaFZQS6sIs6V5rdsh0JZa7dqrXt9Pxg58aST4fsetFIwWgGgquNIZo2+PY2TNzDu3BhF9bdJ10F3bw9yuTyazdoFZHEX4+xHACkAbrVSOU0WC1NOEMC1bQoj52JtHEebwrCJQq7w9ZmZmce1yiCF2JIZXVQqAyOC53rtgg2t8PVBkPs+CA9YY5R0HAHCaYLzunQchM0WXnxuE6yxyLIUA0NDX+vv799C6AVgwbmEtvs3tJsswAj007k+fp8lbGJz6iJCykWtMHw2jkKUS+WPK6MNEwJciOfDKBqYnZ2BFBK9Pb1wHSczRr+Wkbg7y9RDhXwevX199empyTNHh4etdBwcddRaeJ4HC3wHwPeCILc5SZLtSdi6VhBAVoOsgbWvSN8cAzDDGW3kXKrZ6ZnfC6MQQggILuA4EkardxB53/NzuacY59Jac5nrOuCCAzAgwwCLx4nxiwA8CFgLzt8KYJ/d3x+0Rynteq4P6mDQWq9njN1LREut1jtyuQC5nA/p+u+v1ar/yyj9yUK+BGOUL6R8th621sRh9JLrOHC9QFttvgvObs3lC1Gz1fyzerWyjQvR3rVwhs7O7nYU4gDPfw8WLmr78yXoF8TY7wBYZ4zZE8XR2wrF4tyuiyHLMhDRBgB/MPcuuYC90gI7y6UyUCxJ6Ti/q7LsXYLJe+v1OurN6k8Hhxb9HZeOZ62J9+3biyiKdvR0dT9Y6ux8Lk1iq7W+ggl+uPJVfiUcNq/7ERzBEfz3xeFnzx/BERzBfzscMfQjOILfABwx9CM4gt8AHDH0IziC3wAcMfQjOILfABwx9CM4gt8A/B880/BJ4KbZHQAAAABJRU5ErkJggg==";
      doc.addImage(img, "PNG", 14, 5, 40, 25, "left");
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.setFontSize(10);
      doc.text("Fecha: " + moment().format("dddd, Do MMMM YYYY"), 14, 35);

      var columnas = [
        { title: "Id", dataKey: "id_p" },
        { title: "Titulo", dataKey: "titulo_p" },
        { title: "Fecha", dataKey: "fecha" },
        { title: "Hora", dataKey: "hora" },
      ];
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.text("Proyectos", 14, 69);
      doc.autoTable({
        body: this.proyectos,
        columns: columnas,
        styles: {
          halign: "center",
          fontSize: 10,
        },
        bodyStyles: {
          minCellHeight: 7,
        },
        startY: 70,
      });
      var finalY = doc.previousAutoTable.finalY;
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.text("Jornadas", 14, finalY + 14);

      doc.autoTable({
        html: "#tab_jornadas",
        styles: {
          halign: "center",
          fontSize: 10,
        },
        bodyStyles: {
          minCellHeight: 7,
        },
        startY: finalY + 15,
        tableWidth: "wrap",
      });
      doc.save("proyectos.pdf");
    },
    ExportarVol() {
      var doc = new jspdf();

      doc.setFont("helvetica");
      doc.setFontStyle("bold");
      doc.text("Reporte de voluntarios", 105, 10, null, null, "center");
      var img =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACWCAYAAAD32pUcAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAALiMAAC4jAXilP3YAAAdiaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDItMTZUMTU6NDEtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTAzLTEzVDE0OjQyOjMwLTA0OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTEzVDE0OjQyOjMwLTA0OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmQyZWE4YWIxLWY1M2UtZGQ0My04YWQwLWU1MmM0ZjBiYTJlNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjVmOWQwOTgxLThkMjAtMTQ0MS1iNGM1LThhZjY4NWQ3Y2M3MyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjA2YzcwOTQwLTJkYjgtMTc0ZC05NjY3LTk0MzU3MzY3YmEzMiI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1ZjlkMDk4MS04ZDIwLTE0NDEtYjRjNS04YWY2ODVkN2NjNzM8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNmM3MDk0MC0yZGI4LTE3NGQtOTY2Ny05NDM1NzM2N2JhMzIiIHN0RXZ0OndoZW49IjIwMjAtMDItMTZUMTU6NDEtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjVlZTRhM2UtZTUzMy0xNjQ4LTlhZmUtZmIyNDljNWUwY2NlIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTEzVDE0OjM4OjA4LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQyZWE4YWIxLWY1M2UtZGQ0My04YWQwLWU1MmM0ZjBiYTJlNCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0xM1QxNDo0MjozMC0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj/YnNYAAI/hSURBVHic7J13vGZXWe+/z1prl7edOjUzmUx6JQQCAUKHUCwoUgQUxIJUEbuCinoVLBe9oujlqtdCUZTeMQhSQkkhpPcyyfR2+lv23mut5/6x33PmzGRSuEySSXJ+n8+Z8r777L32Wuu31tOXqCorWMEKHt4wD3YDVrCCFdz/WCH6ClbwCMAK0VewgkcAVoi+ghU8ArBC9BWs4BGAFaKvYAWPALgjdaMfe+mP3+13EiM2VFz/2BcwvXYj6WAOkCP16IctVMGKR8SgSU6cnUIMkKaYyhN8QPIUSUcx4qn6CxiXr00z+6xYhaeJs4/BmM0oa+/hMQWqW2KM14m1l+H9N1Xk63HQC+rAZG2cGsqywiRAJUSEJDMogWK6IHrqdq3gnhGBpmCd4LIG81PbaczN8ZjbrkT780R7eDp+8hOf+L4ffcSIvoIHAaqoRqT+54+meeOnMfZ5KqYhmatXClUQWbr+MMgw5lRr7Kmq8cdwDkHulDT7ZJD4QVQvfgDfaAX3E1bW4YcqYgQRjElelSR811r5hEnSFxpjGqgiKGJsTXJViDoDbAGuB24GdqNUiAwXirjs5rrJZPmbXdL4thXzRVX9gTqwaiW46qGKlR39IQiNEcQ8IR0fexciT0HD0uciAoLGMnwllAtfM4m7nKjXg90raToHMSJgoBkME/R7xynmUabRerLE8HSEY0WkJr4KwAUYLnCp/TSivxpVb16SEFbwkMEK0R8yEIgRjQHXGf09I+b3xRo0BFQEEYgxXqchvK+K4cNaxtu0N0/SaSNqDye79RDpaai2xei+ITnv1RidGHlGCPGl1rqfFCstQkABa+0LFH2+2vDmGPg/D/z7r+D7wYro/lCBBnAuS9ojn7FJ+vuIoCEgYiCEW6IPPx01nhli+FNivE1EEOsA4R53YBHELH3vEf2vqOZ1xczsyeXs9B/hXK/e4RUgsal9r0vMe1dyJB5aWCH6QwE1qSaTzsh3TKP9Q1pViAhiDD5Wf+TLwWkawr8gMhTda71cYziY5KqIcxhn6+uAw3k/xFm0KneGQfd3K42nxBjeZ5YMemAdrxMjn2Ro62Pl577/PEhYEd2PeiiqjDhrLxH0BA0ekySEwWB7KHsvD3l6kRWDiKAcoK04Q9IZxTYywgAqr2Q5hO4CqgKJxbgE22gRo6Khqn9X6z/EGDAO0O2R8OpQ8nnr7D8bS6ZREZEfQcxnMPwwomBW9PajGQ8C0Vest/cNCmJR40gSd5GonqDDLdRX1bd8v/vD+HJKmg2gNsYJEFWJGknSBGdzkLqvo0YkdVTb9xEkIZkcx4iAWJAIMdT+8KG+v+Sao/7MB/MhLbpXJs30P8Wlx2qMGLE/lI6kf18Uxc9jLCvjeu9Qw6Lt9AHFA0Z0UaVojOBdiywsoGIfqEc/NGEsFDPYRv5RY9NHBV9hrEVi/O/uvv3PsonFWcsBp5iiCNXQYi461OFtvdMu7tZiLSLLRPclQkt9gQomNYgDDQd2aTEGDdX1oeRcY90lRmRz1EiSZK+JMXw7FuH/OuPQFbLfMyLIw5boIkRrWb39ejRroO0xXFU+II9+SEKE6BVJ0zda514UY8BZS78svhtjfFaSZcRYDS+ufeZRISwJ74eI0QoHu8mVQ41pBxE0VCQjI8QIsSprsVzqnT2q7o1lfELi3I1idUxjJHXZP5RV/4uVVnfKSojcvUKtYo0iD2B06ANCdBXBu5STr/8qaXcP12w+m0ZvbplBaAXLEauSZHTVMfm6TX8TqwJBIZqZfrd6prpA21hiUMQJ1qYIPeIyng5JfCYiP6PKeSYhJkYuQeWfovfXq7UYa59jRH4c1dNFpLBivxw0/A3ojIogLsGqIr6qVQgF12qQ5EKMskdjeK4il6CKiMFk6X8EDU90WV4vJA9W5z1EkOZtBsm+u4tWPOJ4YEX31git6X1U7YQBa0hCtRLyfgg0AuoZX9P6F7Sq41uaTYoq/GDSzmeNM0QE8Y5iz16ypIVxCTEMrR+qOOfebI37K6T+v3GQOXm6qv66yRuvclnzhCTL/2DRR27q7fpZpPILqvGF2q8uxgg4i01zqtn9xF5FaI0glQcgFNWlJNlvpSOdP4m+wqWNJzA//SK/b/vHxCYPZhc+JFCmKcXUXrKhGnV/0/0BNcYVNmGkP8+JzQW2n/RomnNT9+zjfQRCVTHWnp9m5oJYVRiX4u/Y8td+bt+3kiSBCGo9vnMM/Z6QjpaQNCBEjIJ19vlO0iWSq3KVesU4czYhkK1e+34BCGH4vV6CyGoROd5YWUfkoqryG6LKHte0YC1x0MP5gu50h3IAxkRQCy7+6XhevjpN3ekYA8J7prbc+DEjBuyKDeYeESNlmjKx/sQ60vF+xgNKdMUQrOP4Wy9i5phV+EaGK4uVXX05NJIkjb8gJhib4AlT2679+lv8nh2YRgsIZKZFeuokJk8Qa+qtPAS0LEjarb82AlG18qW+UuE/1CpSzr3Smfz9xqZ1eKt1OxVeGIO/RBSr/d6f2DT9NRHr7Ejj96u+vrGWLhTEIUmg2a6QymLF1YF6wVMV5c8lzn0z+gGu2Vm/5twLfjJU8YPAyrgug6iiYoguwTdaqBiSZpuwdydh0MXcz3v6A0p0QSmzBu3p/ay5/QZuefT5tAfdlRzHIZSIkeQxou4JSsSooKH67dbTnqdiHcYIIVTEaYcUBnq7gRaqiljzE8amL1fMSQoE9f+70uo/nM0QDMU8HyCPT8868hqJjoU9297s+91LWquOIboklEX31zPrLnCpO0dUXu+cpEL8gKp+BSAq5Fbxg4qFnsVKbfjrTg++JevsRc1O9pQYBWPc25XeB23qVrxtQ4hGvEvxNiftzrLm+ouxZYFPc5LBAhiD3s+xaw+4H11UGTTabLj9GvYfdwaDzjqy3tyKCE9t+bZi3ghD37Uv98UY3zvpxqgD3gzd2QHd+QVCkiARNPhVptX5qPjwNGMtGmMt/mNuyBtNdDCg3LMHWykyPvpNHWm9BvWkNrkmyZrEXhdf9CEESPI7JG+coz6KdfJzqubnxLq/0xBeRwiEoOS2JLYdmlqESBJBEv97GrMvRR+wzpyCbTylKvxFK0E0dS2GojGC5hmnXv0VRm+/kWxuPyb42rtiLINGB110b95PeFAi43yW05zdz4lXfoNrnvoixGSYUPFIl/UUEnHyUkUxYohB/48vK6IPiDWUcz0G0z1MkqBliU2T1Kb5xSLmBBElel8pfE1E5gS5WkNEXEq+bl39AGMTrWq3XLp6fS7WEcsBia9qPznyqeirqKrrEXniMFPmtbbV6mhlfkLFQSI0rVD6HPVgjVLN82XXCltsJpvFQLngX7MwM7jIGHgkj6nEQNEeQxZ6nHH9Z1m3+3oGahi02rUUe5DF/WEkui9CYqTfHmdy2w1suPZr3PmoJ9HslzySZT0FTIjPcJqMYoSokaIX/iV4gzG1VTZNUhprAQzRV9jW5LtN3johViUx8ung45swYWuapHWEnITaop4MDWMqtdVHFTUSMAJJChoXXXL/CPxjAOJg9kmNRuNDMcimdHT8FVXR+XBVxI+LFQgKwYFJEKndfGr9+yC+PXjIMvOiZI17rThXPlDuo6MNopEyH6NVFpx+0acY27mF3shqvA+1kP4A98uDF+tuhDJvccKNl7G/M8p03qLdm0Ufkfq6EoMnGz/mObRaECs06HVi5WY3FH9FhKzTRGxnSEpZherrCZ4Y9eqyHPyIsw0OylXxhiixJmOMKKZpbQJGGGy9PfHdeUyak67bgEsSdOiMd62M7qD6lp/On9wcl5vFkOOr3632bP24GFO78BoJ6cgIxLrKDUXySXWjbx+G33WI6TOouPCRSHNRqFyONy3OuvjTjO24g7mxNdhhHsGDIeU8eERXpUpz3GCB0797EVec83y8XUP6iDTOKSYELMkTkAgSiZJdaFwTYxRVg7F9ghZoWdtnReRp1riaz8H/YZRIGXokkiA4UKmTV6Lgix7RQpa0fqQmIohJflhN/l3bbNVpqroU+Ua1dQthtqKaj9ucjn+gsXbta2zqHp2vP2a1CnvFWDR4+ttvJ5ZF7QcWc3l782k7XbO9PsaI+PLZWvUvxDzCxlLrALGi1eC4736J8Ttvpje2BtHIg6nGPKjZa6KRftZktD/HWduv5crzX0qsBriy/4jb2QVxmOoMfFX7rmd2Xab9kmgNhIiOtom2gcaAKhhjMjEgCEXo3jLwPQBymjiT1UE1IkRf4OdmcasmXmOMPFtVISjZmvVvTZRPiOPqWJagijW1q85PzWHLLi4JSGhfFVUAMenIWMuYZC8AqsTuAmGwgFhXp8SiF6nqS4kBXPL4+Aj0pYsq/c4Ek7tu47ibLqNsdYZpww9uux70NFUBuvkI43dezSntBrec9wO4QUVSFegjyhKvm6WKqxSDqBAH1Y2x30WcAx+wIyPYpAFUtYitcVy13p2bzfYTcm18F1WM5GAyrAUtQ0tj+bhsdPwn0rT9Wj2gi6MaGiJcpmX8Q+A/gcs1hiAI2amPGS60gtXyfKoBJs2Yu+bK9mD/Lkyeo76idco5NI89mVj0hxJp+R2N1UtBEJUzjFori6l1jwCIRvqdCZpz05z6zc8QxeKTFDkK7BQPOtEBMELRHGXDtZcQouO2Ux9P1lvAxDB0OzzMoRGx7ljbbDHU10N+3KbtdSipEmOk7M8TBnNgDBJjmtnsdzCCBjy9/BLBgAi+mCL43WgE12j8QD4+8WGRRl1yKuqi9BhRNSipiPyhIH+osCkgWwGM77K4BYnof2Pcy0UVt2bt203D/rixCUrAa0V3fi+qnhgjaZLc3EwbRI0grEXjsRHd8uB06gMLUaXMm9hqwGnf/gzJoEevPY5o4GjwPBwdRFclWsegNcZxV/033sC2s55KY24fR0Mn3e+oZfHRoaIMqrN+dmoBAWMcvhowmNlb693Bk7TaL8zWbFpvBPqh9/beoLqcKFiX0LCCUYdXjxE6ANF7YtCPAPusk9erMlDVvxSRHwbOHjZBoPbVKwEfi/rfMfydVV7qxFzQmFj90kTdevVxJwBBkY6AZMMbyM64LJwzqm5U1S0P++QlVYJ1lEmDUy75DKM7bqE7uR55AEJb7yuODqJDTXZjKToTbL7pOywcdzpza4+jMbv34W+cqws95Dos4YzGvhaDAmq5V6yjNbKmzngJAdNoPVNECMFXpY9/J506VbWZGaLkJG6ctsspy/63if7Xyvn+t42VbySd1g9pDK8HmmLkHdGH3wZ5gbHmFBGdrptS70AaE0CI6jBq3oPVCzRWSKf1dFH50GK7jTEsLVDo1PLXMgwXL304E11BoeysYsMN32b9jd+hP76mDnl9sJu2DEcP0QFQqrSB6c1x0lc+wg3PfgWDkUmyhelHjnEuRhAr0llT14pQxSaCTc2wPoRAiBtj5VHRbY002y+SE3yFk4zphd0s9G/nuNWnYUWu98TrEYuxAuiJy2bfGQiXEfk0WpeeimUgqmASITfJ0qUKtw5deoiTDXGx8gwsqwevAOXy3du4YVD8wxiiUHYmae2+nY2XXUjV6KDGPuB+8nvDUUb0YaBBa4TG9F6O/9rHuOE5ryRkTUzRf5iHyepSdo9AS6PPUQoEYqFIOXTPqIKzfawgKi1rLIIQqFCNOJvSK+fYOnULx4wfj8GQtFMEQUNcMoypahRjlvrUL3RRckxigEjUiBqDsQnE0NAQMElKtXd74edmEGuQJCddu7F2r9Vi6kHzSTWGh/OIAQSXYKJn9Tc+i/a6hNFxJB5dJIejkOhQR84NRlfR3nE766/4Ktue8iPkg95Rt0oeUQizi6RTGDFGRhGZFSBEpUuCGEuMSu7kulQqNLCmLAaPV7jUONMU5R2JSadGOuv+METPTDHDRD6B0XD3JZ4MaIz4uVlMO61ryFHbBspqwNSu2+mMrn5msz2OxkjMGleH0XpJslkD02gu+eC1KscoC5Z85yEuPKzLQqvSb02w6YaLGd9+M8WqY8jjg+svvzsclUQHQJWiM86amy9n7oSzWJhcT7ow83AW4bcuBbUJYmzcKOidYgQJkWp6mhhri1lI3Md1fPT3xFogvBn0TxPX/pRx7oSkKsi37/5TopYh7qQ44UzykUlCVRz2oYvdaZJ0s0nkZWJ4FMoCwlcV/Teb51iX/BqqxOinkqzxjSRvIUlCmNnP4LpLEZegVYkdX7MuWbMRrcphlRm7/WGb2KIQGg2SuWkmrruU0OxwNBJ8EUcv0YGQ5rj5Hhu//Tluev6raxHeP2xrzW0B9gOTNnXMb9t1Sm+6+02bpWAdsvtW2LMFFcPA+yvtk5/zX9nG4y9IYngV8CrVSIweY+2dnckNI2jcpwrWZYToD/tAVaCKiOW0ZGLi+lq/VlQF1fg6Z5OfGh8/RgxmtcZIUVZ/UFR9b41FvcNFwLWJxqDWYYw7dZnUtd9k2RacO6Rg3cMAw1esxldx7Nc+SmNqB3Otifs9p/z7wVFNdNFI2R6jvfsOxm+5gj1nP43G1K6Hpa6uUCFcC/I0jMWkyeN0du8/x8SBMbg0Iz3rSZDmxGKAt/krXTG4VdBWbSczxKJ6L4a32I3HlkNfGToowfu79JlIXWh26o7IYCbeseqk9FP5iPmRUMbdwIiINKzY5xPrXJgY47dC1L8yJq9FjqCEVhMzNrZYqQZj7BPFV3Xsg+i1FN2KAo7mne7/B0KkaI7QvvNGVt/0XarW2LJKukcnjmqiAyBC1Wiz9oqvMnfMiZSr1tfx8A8zSJ0SejHF4GmxCuTN7AJZO1Knj8aAZE3MhlNqHVojoejv9sXggiRxXzEimY965aAMb0hzi/MVsapq3XnxRNVDUO/2QtYRZrbR973qpbGhL1SST6FMxBj+0ljzUhFDDPGGsiyfZQBrBMQggy7a69WLSX1DY8ZWP1OTDNGIevmmljwMC4AqwSYEL6y9/L9xZZ9eawKKw6tGRwuOfqKr4vMW2dRO1l/+JW4++xnE/bsfdmdJaQiYrPGfybpjfl19hTRapzZOf9xpiLkBgBiJgy6oR0RIElDc5aoYcQlxfs+HdXov3ibQGYWsgXiPa48O49DvCl8qrUlDZ60SPWUsq/8waUoV/Y7+oP/j7Ub7FjGciLAtTZPB0nFPQLF/nlgUw+ObKkyr82yT5hP1ia4w8HOfrWKFedjZVJSF1iqOu/FiVt95I72xiaMqMObucPQTnVqEH4ysYvVt17Cr8mzdcBLthZmHVSBN9BWm2frK2Nr108a6cUSo9u16ZTUz/TtiLRoiJk3I1qwbFi2ICLIaQhKDx2bNVj6+rj6wwSWEqqoPYLQGwl1F9/qhgAgTJySE7gCNdnieg5C4HGAfcKKIWbWoZ4vWNeTNmg3UZ7PUer2z8gaiRxAiZmeBvSg6kIfRkiyq9BsdmjO72Xz9N6gareEcXCH6EYRQuZSTF/ZRnvyj+LHVZP2Fh0/QlRg0+EBZ/Ss+vIkQkTR5nbaz38G6oYgs9LbfQSiLRZF+R/OYTbe7Zut4jfmrymDfJglkaUooZ+pojrsR3UXrjCr1YHKD2gpxjfq+gz4S4nmSZeeJKL7wVxdFrAtgKDAsNgGL0btsEJf8GKrYTFi4ff/f9bZ6XMOhDwES3BeIKsE4qqbltK2X0ap6zLdWHRUJK/cFDyGiK2WjTXNqL8d/9ZNcfc4FdAd97CEWXRXBBk9aDIa/9dCAADEGKpe8p7l+45vEGlzWWBWcvHZQ9v7OWgfWUuyeIUxPIS4hlH21rebfpCPj74q+t9FlfCPG+HoN8WpERhCpsK6PMRiXoDGoVmW9C8kwMd1SV35UMwIMUC2dS37AJLxfjBE0Upb73x2Dr/NgVEgbHYytrekxRpzL/udixbPghSQNfzO2vkDcQydxra7SKpR5m+jcMH/8AFQMJDmnXvVfrN1zHQsjEzXJHyI2iIcQ0YdpgCMTjG6/hc3dBWbGVpMc4m6z3tNrtZlevZ6s6JN4/5BJdzV1GukNunrVf5l09AJ8hVX7jl5v5u+8aH366dpVtE88A4tFNRDnZv68nNr3467TOc/B+Yhepei1rtk6hsg/x37xK2hksGMLJm/NJ2OTqK9QdM4YKEtPpUKe5l8y1mxUjQsmSU4SMXVhw7J4V4n5jnGOAKQuIzP58LhkJZhwtjHmFRojYixG7F83N27cK87AURghdngoRZJRuJRjb7uK0R23E9L8oCuidZiqYGzmdgaNTh2//9CYVsBDjOgAqDLIGhxbLnDqfCQeMpls8FTlHNtXj3P76WdSGEfbl8P65A9Sm+8zBI0eH+JbJPhriQFn7KrJ0Y1/3l+Y+VUzGEbJlvthfAJptWF2lmLQf6o0W/9hlB/VOvvtTGMsMYYXhbmZX7GdJtX0flwnPCldtRaCpz8YnGNVb9VygA+60YxPPI7l57aJUPZm/2Qw33tr1lpTV6XRgCm6lOUCMUYwhmxk7D9EFLEWX/Sq2TvveFt98VHf2bW9wVh6zQ4t7zl1962su+M6zKBHtIdQQyCGQJE2iEPPwkNgQi3hoUd0qCehWEy8a1SsuhRbVWy+4hKad97B9WTcaTPSEMiK7lEfWacaicXgulXnPev9jWNPeJXvzZPlzV+JO7Z9cLB71+Wm0SAM+sRuH3fyqYgxiMayrMILUyPPF8OPAK/XGEWMHCeZ/Siq/9Q567xzNVZviP0uYixZkv1D9KFjkjCfNpM/qhNUFEVvlij/5vsLHwm+uloJkCYQKmR+qq5wI6Y+H25s/C+NM6dG73HGsVAWr58u5hesSx7QAwS/ZwxF7n5zBDSyacsVnLFrK+NFn16rQ8hbd9W9pT6dVn11F7H+oQA5UrHIP/bSHz8i9wGWjvitlk5cVUI4oO+pRqxNyLL8LqeCLiIKNMsBWvTZNrKWbac+nrmJtTS6cyTl0V29RmNEOmONdGx8r0FbxACY3Qv9uCmipTFCLCtMO8N0pxGvmM4EicQ6+82Yj4iVFy/60Rfda7VPW2oj3bDbdLHkVPAYa8DaxxiNV1TzXSrfp1KLa62hvOrLFLbN2FmPwfqKUBY/mY60PqCxPmw1aPjvsgjPqo9kftC67l6g9bkCWYsqa7J6xy1svO27rNmzhWAsvTSvdfXDzallRF96waG7UaNSlhXGGvJGvrTI1fepA2mCRgxCqCrM9xgW/MlPfOL7emt4qO7o9wEC9NIcm+YcX8yydsvlbJWz2H7cKcw32jTmZ5G7czs9qKgnT1X0+row85JmY+Tz0RhEWNvI5QvV/MKz0k6LgSkAHRK7HkatIhpKxNmPic1eDBpVoxkWsyDGeGMo+r8gYjeZNPtfgo5ImkKM3jrjqn61Y2rH/is0KiMdIZ1sUS0MKG+4mGrnrYRjH0s0CWlTnm6y5AOqEWMNETvX7/deqBIwR+m596KRKsnpNccYmd3DSdd8mfVbrseGkm5rjCjykLGg///gYUt0GFqygbmsRTo3zSnf/jyrbr2K7Wc+jqlNJ2FMg2ave3Tu7mkLieELEuI7IPntECusyDOlkX/AqL4SDRAqaGQYLE49WDAmAeFCRKCqKHu9n0jHxkoD84PSX6hlASQYm34yb+RPqfbv66rljdnaY37M79/y2bDnZjAJpYxgW4K/6TvE2Wkkb6MhQghPNIl+JRARMUhZUAzCcwaSz5mj0JUmGqlcSr85Sqs7zebbLmXzlivozO2j1x5jYGsx/eFMcniYE30RopEqzSmzBp25Kc74+udYOOY4bjv7PHauO5bWwqI4b44e+0p9njFl0fud1DROzZL8JVEjJst/UoPvxqivMxaMUZCAiQ6Nta+dqPvEh0slTR8vRRl9t//RpDm0lBuDqAHM/iL0PtnrzdFsj/61FgNkZORLY+c9po5myzL6115FmO5iOhNo0SPvNM9J8+RrGgaICpImDKb2/mRVhEvM+Ho4mhKOhuXJuq0JsqLPqTd+k2O3XsPo7G7KrMX86GpE48Oe4It4RBB9EaJK0WhDjIxsv51T9+zAbzyR2044jWANjd7cUWes87FkNF/10kba+o4SH6sxIMa8Nksa+4oy/nYgQUXxMZInFrUGjYoY818iPN41mz8RSv/vwcdhxqiCEygWqGb2kY6MnOY646fFqiTBfp3oMA6quUBRnoRfdyqu2WNkrLu5uebYb8ZQJDEqIkLZ7/9aL2/8q+Yg2mV4QsGDijqwxdJvjmBDxabtV7P5titYs2cLZdZkfmTVcAc/+qSP+xOPKKIDSxbX7ugkaTng0ddcxrF7tnHVeRcwu+Yk2gtT1NEkR8fWHjVgXZsimmcmSXIHIYxpjGRJ422h9Jf3g/mosZZgwZdzyDC5Iibpt83ICCI8xeZWVEWdc6jrALWUk2QbEGPPJ3qCyo2V1x1iFBuguxciTSSx2Iaz+fqxr2qUhnqPtRZP8beVVH9uUksgDqudPrgQVSqXEiRlw7Yb2XTHtazZfSfRGOZGVj8iRPS7wyOP6EPUultCb3SC1bP7eeol/813H/8jzI1sorEwDchRobsLoIXSG8zNmdh/bnukdYkkGUGVvJV8WPoLq6mK/RIh+khM6wj0aLm0NovJRKj8aWi8XhVs4nDp0HgHRK+PM6qgfN3I0G4XhHQikK+qUB2QJsmHJJhN0VfYxFD24zfm9sqb1KTUZSkffPKIRrzNKFodHnvLFzj5tksoXYNuawQV84gl+CIesURfhKgyPzJJezDLmV/6Jy475enMNUdo9ObRo+Q4oUV3T1EUl7qTT/md1prOH/nBAIwVh/mXGHo/bK0QGzlls1PTLoSdMfrbrE1PkLJ8TKzK640FX6QMQhOos8zyEXmsWovV3necKxGx9KPiswgoTdv44dSal/gqIMYQQuiWVfVDkGCGEaBHg888WkeVtTnr+q9x/PbvstCexFv3iN7Fl+MRT3Soa9T1G6OYwR7OveNSrviBn6XKmuQLs0cN2UHr3VPMO6r+4GVGeJQGj23kP0S+/snB2G9oVJJSsUZQLAKXEsMJptk4U8ixiRDmI4Ppalh4QvK8484WUbzaa5QUEUfR71NVFcZETKf9j2HoexdrKXx8uWkms6Oj5igq4afMj0xwynUXc+a2rzDfmiQYt0LwZVgh+hCikX5zhJGFGU675PNc9dQfo2rmuLLg6DDFS31cua8oSnlFs9G4RmMA49D+4H8Wu247XzSQtkaQxhixHKAuudaMjqLenx5jJARwGaw6YRjQETlFI40YFB+TG8U0CGVJHAgSEhrN7I0uyVYH7zHWUnYXPuV7/c8Y5yiOEhKJKgudcdbcdC0nfvdrdPMxol0h+aFYIfoyiCq99gRrbr+GEzpj3PiYZ9Lwc0fdpKlUry0K/VCWNl4eQ8Ra+6RsfOQsxV+jxhLog/WYNL1xWKH1NLHJUlnmqh+GcTlyoqkV+TsTy17rDPO772Cwdxuu2SaZPOttqlKnrmqkuP2m14SFeSRJH+QeqCEaKdIGqb+ZU7ddhRFlkOaPOIv6fcEK0e8CpTu6iuOuv5S92Sjb1p1Me37/UeN2q8s/B7wrfz1d23i5SARnsJ31r4te3ywIFfNUWuDQLY26cuwJcX62RQhdSVM0b9YHQ4gcPyxhdYNoQEMga42TJC3E2mcbl26IwWOMUJXV35qNm/cmhyZ7PFhQJSQpiUt4zLc+RSsUdFtjKyS/Gxwlo3Z0IVpHlaSced23YMOJlMefTNqbPyqs8MAwfFq3RaOfNcoPqYLE8GMh9t6sBIxNadkJVMM2FYWoGaHapFV5vViDM4qGiIjdiECMbA2VAQKm0cI029g0+ykBNHg0SdBG9oeukQ9PXnrgX/ku9BWhyNtsvuJrjO/dRq89dtRJXkcTVoh+GIgqZdaiNb+fE676Mjc8/gfQ7txRc7qrABoDQczfysTkDwFg2ADubPX2KlGLsZGocY8qM8baMbdqzWqMuZ7Ko8Uwgk10U51XrXeKC9g0w1ghDgai5eB5pBkmyyin9n5hsG/XLvMAiuyiihpDmTTw1pHKsFbGsHTVIG2ybvZGjr/xEoq8tfT5Cg6PFaLfDUQj/fY447ddx6rOGnaddi6tuamjwi63lBPlzIWgMyBjxgBF+oxq3l6lyQDsHjSKd6MTO3DJmFRhnUqs02Bt/ftOZLWqYo3bkSUNutPbGSzsJx1ZdXZjbN1a9RWSWfr7pv514dY7cc3mA/J+opEqaxKsY2z6BtbP72bCRIy1LJ7WGkQYlUBMU/yKhf1esUL0e4AiVI0Wx91xJVNnnMPc5pNJDio1PcwKo64OY8vBAzfhRIgh+NT7ryQufaFGxTb1HJdWGGNB6kgwrN2NxjMiuipqRGCpMqsIkyJQ+XKqkkB/9166W26nc6I5tzW5geA9odeL+ebjv5ifdOpwR70fUdeNpmiP0QoVx176X6ztb6PRMIQIYiIMzxsXjVQ2oTTJil5+H7BC9HuEUuVNGvPTbLr0K9xx9lNJit4SmevDTQWrkSrJ6I2txsRQLwb3e0F/Rept+TIlvrDmtJyVuWHD4mLONNOqihjp2GHBUgmggoBMDK3yM1pVtE55FM3TzsWpf3Qs+gyF5eusYZeo5/4VjbU+hWZkksk7b+S471xIa3ofvSSjKylqFLOYT7+YUy/2/l98HiZYIfq9QIZnwE1uu5H0tqsIYpYKGMcQSBsN2o0GvV6f3olnsuvMJ7IwthrnS9Ly/q9oI8gtOizbbJL0eKoCohIq0KgYR89kQixphVKwCZgERGkojCgK0cwLBqsVVgrAnhCozz0X4SaC5/5ctEQjIckZtEZZc+vVnPz1jxG9p9eZIASPWyHz940Vot8nCFWSEwcD0APFJjXULqkgBsqCY267mtGtNzO3djM7HvtMplqrafWnSUJ1/1js6wSdKyRNwXuKfbvfY9ttolqgwjqHWNOvi05oy3slmog4JUZ1VpImYjBWC8UQB116lVKpe9foaPrDIpYY4zXK/Vc1RjRSNEYIYtl82YUcd+OlFC6laIxitA7DXcH3jxWi3yfUQd3qkjrufJHoYurPjCWkOYORUeL8HGtu/g7j8/u4ef3ZbJ04icLmNPuzS5lzR6xVChqqGyc3tP8MqPZfd+0frHnM4yDLmhKKnqKIpHs0gktlKskgRLJQxoLKz9HJIzFaMbJFI4QQxSVpE5WvlkV8YjOX19LvvieG+6essWhkkLWJC31O/O6FrLvjaqqx1VTGIeHBz4Z7OGGF6EcSqsQkZWF8HaNlj8fe8mU2N6/hho2PY9e6k2n0ZoEjqbsLEai6C7+ZjY0zce4Tfto4+wZD3EySTgfVv1Z00oghxvgUhX8y4p4nzvRAvotqBcxH1TMFXuwazReLkVZuzTXq4y9Oz4efm50VrHDkia6RqjFGqzfDU674BNnCNN3RVaRJini/so8fYawQ/X6AaKTMGhRJg7H+fp5w0xe4Yk2HfSeeQntmT20lPmLESQk+IDG+s9lqvtUPzybH2DUW3sOw2KGIPH+pfdaCcydSu6oqg3wdwYqxtR0v6DOdk6vVyiuk3fqQOcJl4ESVkGT45gibvvnfjMzvZWZkDcRw17K+KzgiWCH6/Qql2xwnHSxwyjc/iT33Oew//kyy/jyyvJro9wVBjMVr/JKUxVtFTJ0ffk+E0YO+7xz4uP5crKOCopktXDHatugRPfdKUWvxzZxjvvVx1m+5hIXJ9UiMK7v4/YgVot/PEI2UjTYyN8PZF32Uaxe63HjCeTQHs0gMR4DsNT28j19qN8LvdlrmD78v9dZYiBUyP/NiI+EGz5E7qECGfyyMr2PNJRex5uKv0ptYQ2YMPAROJH0oY4XoDwAkRsq8ic1zTrjkMyxUntlzn05zMH/EJrgC1sgfkbiflFiepvH/72Qal1gW9s5/bHrr3GfTzsgBf/wRaWSk155k7R3XsOmqr1CMjKPOrYjrDwBWiP4AQVTxaU7ZaHPmVV9kS7PJlsZaOnP7joyvXcD7QJnlL2lt2nCNWIN+j4tInclWDXwj/Slz3AYicXjowxFoXgz0OhM0u3Mcd/kXiBIIaY5ZIfkDghWiP4AQjfi0gdHISZddyNTmxzO/egONhVn0ezy943BQHxD11wZf/Unist/6nigkoEHpFf5n8tx1my05Yi5s0UjRnGCkGnDONz/JgJJ+Y4RMIw+nM+6PZqwQ/QGGaKRwOSN4Hj9/I999+hPx2cnkC7PE73PS14UlAmFQvtVo9jJj7PF6X06jUcU6Rynmv2Z7fMgFc8RywQTwLqf0hnO//Tk6u7Yy3RrFrOjkDyhWiP4gQFD6zQ5u315O+cKHuf7ZL6NMxkjL/vedBiskuLyB9ouXoPodcQl6L0kfYi2xrPDd3stbEQjfi3qveGOpxNax94cgGiGocM4VF7Jhx3XMj65BZme+t5dawfeNFaI/SBBVBu0xVu28g03//QmuWH8K2cLMMHHjEOjSH/ft3iJUC7OXd0466w2NjcefS79bqCCybBXRA3+pyfJksOf2j89/97L9Ns/vmydAhx6FtEHuDBNVn3CY3ytNwoZing3TWxi0xzkq8nwfgVgh+oOIurDhBMfecR2zacqtj3oije78IVcp0SbY4En6C9SZW/dyY1XMWAfajfeqL0cRmb37hUKQqmw1Rke69uxHI8bcK9FFlSiG+fYqxvbt4FHXfJkGAX83kTUueMqsSRCLXfGWPyhYIfqDjIgyaLY5oT/L2t1bsOXB55eZGAgoW08+i5lHnUvemyWpBkMR/+4JqQa0KJ0UxSfAPgNkbvnli/90jpG52fI9C4POm9PR1aDxXoQHpcjbaJqycfoWTtt5DZl6ekl+2OYIUIqtw/yPaPjvCr4XrBD9QYYAVd4knZ1mwxUXo8axvEKaYNCyR/u269h76mPZesoT6Nk2eW/u3jPiTOL78/1fSRtyuU3tiMbDMFiNitHfFxPQsnvX7xfboYp3Cf28QWNqByfecjHH774acYZeYxS9myOZamqv7OIPNlaIfhRAYiQkKb20yaG1zwTBt1swWODY736V8Vuv5+pH/yD7Vh9He27vvfjgAzHa7ybI2wy881AqirHMzOz5wRB7+9vp4YVq0bogRK/VwcTA2Vtv44TbrsF25+g1RwjWIboSvnq0Y4XoDwFIjPgkpTu2ms7cPs757se58mkvpb9qkqw7d7c69SL5vIY/lsgrrZgzFuPZjUuJJn6ELHxBYoI/zD1ElTLJ8MayascWjr3tBtbu3YVvtOg1J1aOO3oIYYXoDyGIKgsjq8hn93L6Nz/J5Re8nLKZkpaDu99RRYgx4jW+xCWt67SqEOeIRa/v56Z+KjcCcmAayDAhJlpHLx+h40s23/pd1t96LYihNzIxrDa9QvCHElaI/hCDaKTXmaA9N8XpF/8n1z36mcSqj/N3X8XGAhr0et/w73St9tvUOIqZ7quKXfv7Ns2W3VtREQbNDqIFG3d9g83776BZ9ug320Rj6138AXrXFRw5rBD9IQhRZdAaZd3uLUx99bPcMHIcLeEeq6HGqoDGyG+veuL5b7MyuCmOtD6ajJ2xdCCDaK0e9LMGE7u2cvxNl7B6/x144+i2RusT41d28YcsVoj+EIUC/bTJ6eU+umYdt3fWk4dymYVbUI2kMeBQpJETq0D3pqufZjetmQrW15FsOtTF0wzvlDOu/QbH3nwV+ECvOYIiK1bzhwFWiP4QhhdLleScvv8G7PQ2KjFLASlSV5lhf9JkAUtTPa4sKHuNr8eJHGMsGgNGlSLNKQmce9mXOGHLDXQ7Y/gsGYrpKyR/OGCF6A9hCEohlsQZzhjM4ENARDCAD548b9BLlNtosCNpUuJo5g3Euro8tCplluGTjMdd9U1O2HoL86OTRJEVMf1hhhWiP8QhKB7BG4eqICJ1EI4KahxjoeTc2GVzyLmSNjNmhLbU4niRZlRJxmOv+iYn3Hkj8+3RoV9+heQPN6wQ/WGEw9GzJxYVWBUGPMEXXBbaTKU56hJM8Jx71Tc5/o4Vkj/csUL0hzkW4+zmTErDes6b38GeqyqCS2j1Flg9tXNI8pXTSB/OWCH6UQRrLYcLgY0h1iWbl3mwDyrxdB/SSgWlcCkuBo7beUftTjOOfn7XsNsHBcOy1Mv+e7+dDvNIxINB9AzIgfJuvhegAqrFgb/bAb/7+ZkALaC4h3bI8BmVHnnD0+nAY4BJIAA7gO8AWw8bTy5CjMpgMMC5BJbFjgtClLjeIAPq97GozsflWWbDDhI5oKNrTRyhLuesxpgRDXGHV9TnzWVMWjyEeQn3Nj6Hwg7fcXDoje4Ni+G4AGLMY41yNjAiQmGM3IHq5aq653u55xD3ZfwPB0c99waH/fYeFp4YI2IEQR4DPBoYqZ8vW4BLVXXqwVy5jhjRv4dX+BDwdO5+EASoRGS7c+5rMcb3xhhuO/SSGAMhRowxHIaovyzwNqB/t61QBMRneb7dGPNNjfGfVeOViKl3y2W3lKVTPO/mVqrEGNEYX5bn+VtQfdKhbUqc88aYT4L+qapeetDbiGCtYefO7UxNTeHcgWEpBgUbjt347A0bN75/MBjsNsa4qih+vxj032MXK6gOF4qatrpYGmo8SdKLNcZJZ22rKAb/VnT7PyNGGB65TNZokDUaxIPrQ/+jwA9yd5P9rnDALKrnAVOH76DDfBQjguCce4uI/Lyx9kyLHR42YbAWVLWb2PRTGuOfgVxx15vcbZTerwO/wT2N/+GRALeJyBNZlkKogBHBR71Lom099oG8kb/RGPN6EXnUgQ1qcd7ojDP2w6r6p6p66+IdROQBK4ArR2o3e9FLf/y+XnoV8CgY7kDGLE0EkXplXDzfbNihviyLn/Fl9QFZVkBRY8SlKUmaH65U0p8L/Mrif8xiMYUD2yQ6fM7iQqEoVVH+Yqj8XxtrDiE6xKj0+t3FU0+A+jTVJM9pdToQ4r/ZxL18sdUH96ssLeYxRkKMv21ifKegYMxSGytf0e/1kWUZaTFGsixL8mbzFmBT/VmgLIoJg0wv9ZPUuz8Cg8GANMv/NWs0XqExYq1lev++M6IP11tnF3d7mp0RkixDDyb6N4Dz730YD0bQuA7YfejnonpQX1pr2T+1H4H14+OTHzfWPGGxr5YTRIYx+nUdvIjCWzTGv5KD6swrYpJlkskS/gn46bu0ReRwm8LhcJBVsl74laosDvQzEFUx1q4G+Xiapk+OyySUw70L4H1V/SwxvF/Mfa8P+MlPfOI+X3t3eDBE92moOyB4v9V7f62xJkdBUbXWBhGzRuBsra9zSZq9P4Z4o6heujTGUhf9v5t6aHVitQhEnS/6/UsQETFihmWZ1FgXxZgNip4GgApZnv9VP3SvqMrq62bZQIgRgveo1rvQQYOpirPuy8bJM4eDSQzxYoRPADcADuLjVOUVIrLJGIO17h3Bl61iMPjtuKxIojGGRrOJNRYx9cIkRqjKqhr0us9ttNo3xBixNiFN+bvu/NxLjal3DXEWMCCQN5uPds69QmPEJQk7t2/7pam9e69P0rRe0MqKkdFRxlevOXQ3B5hZ9u95avIuGg8OBwvMo3p4Uf8QXtXtt6OtVvtS4+yGxQVXo35eDJ8B2VZVVVNjfHqW568FjIogyLuRuB/kgwdLXFq/tx5Ux/56YBdDqUQVjBGvqpPA+PCaEti22PXDvx2whWVKoaqSJEldfz9JDiJuWZZNY92lxpjjwjCGwXt/oap+2ll7JyIN7/2TReSnnXOdGKNL0vR9ZTGgHAzef1+KBR0pPHjGOBHEyAcG/e7bgg9Yawkx0mi2cElCCP6ZWZZ/TFXHRIQsy/4kBP9sI4fGamlN+sOt1DVRro0xXNDrdjHGLA1Su9PBphndhe6L8jz/V2ttpihplv+2s+H5y41dRgx9BhADiyuxEaHs97HW/bEz9pmVrxZ3+l/XGN+lAqbW2QghfkThD5rN1t9HDT/pywrrkreF2P+qxnihc27plKSqLPHG1KGnw+k2XPBu9N7/L+fcL0eNGOdeUnj/+OCrS5Mkpez3iRGCr1izZs2/ZJkjxkgM8abuQvfdkXoHAvAhkqQZzloK7+9+jJR/V/h5uMdyNgaIcsiKa40hqNbDMvxNAbz3jIyMftJau2Go7mgI/iUoH3MmGbavApUP+ap6j6JfSpJ0ba0D2w8E7z8notNLTdKIdQ5lqL7Uz3oX8FdAqao45/Dex7nZmd8dn5j4H8Pd9katbQKL7wBL9oYD75LnObt27uS2W28lS9O6fd6TZimnnX7GR511x4XgsdYyGAxeVlXVfzhrwTqMMfT7/X/3vvrjkdGxD1trnxxCIG+03tftdS8qBsXtLnEPiB30QSuqXYuULh8ZGydJU6IeOCxguGL/dwzhbcsI9+SyqNq9/oDBoGDQH9DvD4jhng4ZUEBds92m1enU+pRqrR8ag3OWGPzHgvd/X4uIihg53aZOTGKpfxwmsfjg0RCXfqqyotVsHdceGfktPxzo+bm5d87Pzb1LjGFJIlDFWkuapv07b7/9lfOzcxe5NCXGSKvV/sdWs0We5TTy+qfZaJImKfML80xNTzMzN8vs3CxT09Ps3r3rV3wI+4zU5ZhXrVr1/marhXOWLElIDKxdu+Ynms3mo733iAj79+19RbPZYM2atYyPjzM2Ps7atWsYHx/H3xPJaxTDyq5KrbMe7sfXfx9s1CvKkrKqqEKF9/VPWZUYa3/AWvv0RbHcV9ULow8fW66WidTqxdTMzLVT09M/tDgnrLVUVfXGqalpZmdnmZ2dZXp6irnZ6TrS78A9IjBQ1eici9bauHPHdvr9frHM/hGWzZrFd6lYppsbYyiLgn379hJiwA9/Sl+R5o1nJ1n2fNVaIvHevzzE8B+1mlaPvVALlSKyc++e3U9ZWFjYWj9fabU6/8cm9QKFMff8cwTwoLrXYgzGWEt7ZITu/Dy+qhAB5xxZkhHRi0KoJywiWZJlJyp65ZKGpgx1/LvP2lJFQgjkzWZdHbUs6xrmZcWOHTsAYWR05NK80UCMIXif9Hu9+peXLTy97gJlWWCHBRArX9LI1v5y4hxVVeF9taOqyt+uRb2ULM9qG4C1eB/Ytu0O7txyO6tWr/mpMx71qNtEBGPNhtmF+Rf0er1P22WFFUUg+oBBMcMtXYYGtEGv++rR8YnPVmVJo9E4deeOXa/dsuW2vzv15JNptVpWxPxtjBFjLWVR/LOvqsvrBJeahCEGEpdgnWO52nA3SFmUiO9BxlRg8SAG5xy9bo+tW+9cEnPrcagNlpuO2/w7eZ7XC24IXzTIp8S6gzY1YwwhePI8A/iO9/6/rbXPNMag8PRur/uORcKqKt1+jyTNaLZahOHitbiTW2vZsX0bU1NTrFu3Llv2GLv4Wve0ofbLgvWbjuX4k09eshnEEMiz/LcYbhyoXhTK8t8Ta4lS23t0KM2kaYazBmcEa81bFD4WQiDL0ufkaX6SxnjL96Kv///iQfejx6Fu0x4ZHU48JYbAQm8eY4xttdtLHZxl6cEKpQghhOUi2z0+J8sbZHkD4xz9bpfRsXH279tLjHG1MZboK4zIlDP2gDl3KHquXrsWe4iFX8T8SFmWw8GP/9RqtTDG1H7vGKiPIVaqqsBZw6mnn47A7cWg/80kSc9XVbI8f5l1yaft8sEeGnxCqDjExkuM8XNFv3+hS5LnFkXBmjVr3t1qtf41sbLQaLf/WIwd1VokXtize/cbqqqqdcwhqrKkuapFkqRU1b160Hr3UoNyWV/UUylGSNKM4zZvPpykdYxz6fneewQYFMXfhipgTL0QpTlYZzFGSPMca+sUHQ3hhapxU+Ur0iwtVq9efdC96/mhS0dQLSf59m3bmJ7eT5Zld+unPRzZhzYkBCF3KRpi3Q2qGDGTGuOzwvA3ReQ9Lk2XjH0qghFDWRX4ymMQrE3QGD9eFsVu59xaI4Yky148Nz//p/ZIn0t9GDzYRC/hgEvXOEf0gRAqFhYWyLL0ZzsjI/VAIr1i0L9VY1yyyMcYsUmKvcdDCnToJlqyfKLeY4B2p0PUKI288ZoQPNZYgvDhrJkPxa8DRrcYI96HpUkhsMlYOX7xe4GvOOtAap2+NjItvpth7br19eQJAVW+qKrnK+Cce2wtkRxQZoe7PTt37KbXXSBJ0gMdVhZ0RkZftfnEk3b7qiLJkrxjO7/Y63bfHaP+uqHWWefn5l6XZumg0Wwc6AqBLE9J84wY79ORq6sRNnD380So1b+doP3FsbS2JuviAr3YR8aYJyx9biSmaXKxJo46nKf2gBhricOdMoSwaGqbA65ZfKJz7iDOqtqDLOpLJN9ekzxNM6qquscXXU722siutXQQwkH16rV2XT5BhvJ5jKrz8/MXs5TQW3tl2u0Oxhi897UaF4e/m/A1EXmpGIOvqifOTE+TuPufhg820dNFwVBV6+2gJtWx64455rXGmDdXVYVLEop+78KFubm+sXZxJAChneX3In/JGuA51FfVS2dtPg8a46mr16x5ffThNIBud+GWbrf7x8YeWGFDDLSbrYP8zUNR9sSDH8MdS5u9AFovRtbaOuJtaCm2zoDqLcskg/WIaQK9xQ8UMMYyPjJCf35+caEDwFpHr9vbMzsz/WtjY+PvqqoKRX+j2W6/om6X0O92v200/uv4yOghfVP7qE2aEu7L2crCK4CXcM/zxIjybODLS5+oDhdeXWYjVVR1sw5tFt777XPzCzsPWJ6FqBEjQqvVRu7uLDrlbiQ4YejRQDWyY/s2pqemyLL83t9z6Q5DS8OwzTZJMIk7KCJxuGCdsMx9tquRN7Yvl/SMtVT9Pr3BAJskS30dQsQl/qYkTfHe02w2jztu06YjdpDlPeFBJrr8NPDDHCCgihFJ03QDqknwtZFLo7J79+7f6C4s4IZiqK9K8rzJ6MTEvRktTwYuXP6BquKSFAWqokREgqq+Z//+fb9EVJrNZm2xjoqxhjTL6l3qoJWd9jIpIpgkmT90uFQZ2g+GU2jJNajdZbt3kmVZiyHR1RiSQY+kN0c+OYkJgQGCcQmLu4b3FWVR/nmI8Q3GmBNjjKMCo4s+fhHzky5JEWM5aAVUvWsc3D1DxJj0br9dJIS1I4fOVR9r4+aSnQNQ1XbdDEVEZpuNxvC7A7u+INSeFV3qMkHQ+gYYY8kbd/X2iQh79uzGVxVRle7CQi2uf49YvujosrYtf45CS4b/DiHMRtVqiawiaAiYUNFJDD7LDnLHusTNaYzEOtgrbzZbfE8j8v+JB3tHHx3+LGHRMKEHxL47y7L46aqqbk6SZMmaHRBGxkaxNqGqvtdIx4MDWlRVQwjZ6tWrxxJrZ1ziiLGmhLUOFUNZLwgH2in0l20rJlS+oYu+3MUJasyy4JcD5muBbFE8NMYEY0zt7zWGbGY/veYIt579NHbnTVZtvYUNV13EIE1gqMtZlxFCYGZ66uUjndFLZajjGmPoLXT/NMmy25IkIS4tMouNHv7vPhxwWLshw81VUX7TiEkOf1EtuvcG5S0hhqWIQlWl2W6RLPXjogVa+nEYrCNIM03T5Q9cCmJaLoUcbq9bHmS1iDRNsdaya8cO8kbjILvE94raG+BZ9I0vh8aIc66wWba4YLXSNDEiEpX6wA1TDrjp3OewZmo7q7feQNEaWUZ2mosLsqqWVVnczVseWRwxoidFHzQSrSO6egDv9YAB2IHqzUAKICISqkrEmBLYWvnqKwZ5nxEpjKn97EBtkW00GBufIIR7dRHdBPwiB3zBChJj8A3r7BOTJP2Nqqqcc8nrTZq+ZN+eXcf3er0FZxeNSwHrUprt9kHGHjGydVEPU1UJvtqoUW+vPQQQfCDNcgZln0ExqMNah7p+nufHNZtNFPBVtW9ubm4eY0ln9zEYX8Vtz3wp+1dvpLf9ZhZOPZdy/x5Gr/42RWesLv90QIe8LEuz97fanVcF74kxbo1GfmtQFRT+8Ia2PM3uYlQ8HBRFMJ/SoL9WhIOj9RaxGKwzPT3FYDDAWkuMEWct1lmCT5ZsAbXI7ranWT03osaNvYXuJKr7kbrslYghbzYOkp+HMQRjwIn1bbTnK3/DoW2JURkbH2dhYYFycF+jd+/m3VVJnMOlhxdmBO5c7D9jzDFlUazz3u/AGPL5Gfad9UR2nvEkulM7aG+/Fen1CC6F2g5xvAwjL1V1RwjxAQmBP2JE746tJhpLOuiS9hewocKEQJm3CO7wq6uKvN/48reSolc79JOUmTJg0owkSerAhGQxxHEIEWK/y9jkKpIso+j3703H2Qv6n4eumtZaer3eJ3u9vZ8bG5v4WlJHPa1C7E/5yN8uzmsfwRlDo5Gi8aAMq1sE9iisQQSXJE8M3n9dpNYVxVgikKQJzijqI9E50EiaJE9f1FXLEK6eX1igMejRy5vsfNbLYGIdnX3boTdPdA32Pf5ZHF/1yMs+RZrXJp8DYvPVIfha1IU78/yedVID90ryenBAkE6WNZBK6gX1kG4WMUuRY87ZWv83hqIo2LZ1Wz1sw7Hx3pPn+WWbjz8eaw0iNhWRc0rvvySmjnJs5CnOOBa68wRVrDWEEMmz7DcbLv8tBSpffbvb7T3pLjq8GBpFl7ToUdyNAHJfoCKYEHC9eTRJiM3OXdy3ApcqSxKZnV+Yf3Qx6O/INDJrLLtOPpfWwjSD0Ul2n/IYjr3mm2jeYGhIfuqiuxTVy0X03ubvEcERI/r1T/5RorXkgy7J9DSu6DMyu43JXVtp9ecok5wyyZZKFKkYkrKfgDK97niiWJqhxG6/nUasEGlRHJpCIAadnyGbWM1Ep4Od2Q+N9gHryeExnPnLrdpgMAy6feZmZr8+0hn9L8myC7z3TK5efc746lXLfr32mzorJK4Wh4e2tkDkQl+FV9a7jvlZEfmfQj2pxdU114wxYBMKUSR6EDNqrH3OUEdjdHz8kxOtJuXsFFc988fxG06gsX8XwRhUhGTQY2F0kt3Hn8EZN30HTdOlVxl6HkaXETe/e0dNLcx8L9qgoiIKaZIR7F13dBn65ycmJrDWsLh4DQYDms1mbR0fhvLGmrg3i8j1MerpAFmj8XPGmi8hgnMJiTGEGMiynF6/S3ehBwrNvPGDdSxABOW6VqNxwJovggmexsI0+05+DN3kdtwt18D4qvukohz6Rq4qUWPY8qQfYvT6S8nvvInByMRBa1yMcWuj0bg8y/PHhhAZGx19XWy3Pp/3Fpg97lR2joxhp/dTpTnF2o2Eaw2DbheXpuenaXr84iJRDAafqN3L5sAQwaJxh7usrN8HjhjR1RhMjBStEXquQ+kcO7IzGNm7l86dN7Np6zW05/bRa46phIq0vwBGZm55yo+x45iTiAs9Ws02bs8ttO+4mdVTO0iLabKqjxiHnZvCzE1Rbjqd6R97I33tsvn6S+js2cqg0blbH+khrWSx8yrvGZ+cZPWatfjgL/XeXyCAxmjM8qwiI2TWML9zK71BnyWRXiMW88eTY+M/LtakVdo4zWT5a/rdhX8IPpIn6TCGO0KaEpOcztROrEveG2J0ttFgfnZ2cOmll/5be3aK8KM/zswxmxmd3oMu86mrCHnRY+uqY1m//RYa/QXK9O537Xsiclr2Ee8pGu064ured/a4lA13D77eoT6/5D5sNBo0W238rm1E6/CdMUQj0QcG/f5f5M3m32uMJNa+Qo39U0WvTIZi//CGWLHkaU6SJOcbY86Oi7tqjB/UGFEjIIakt4DzBXeecT63nvEk8jMHTP7DO9CFObTVuS/veFDvpf0FtjzmmWx79NPZu/541v/nvzK57UYGY2sOXFW38y/FmPcRPS7JfrTvq/P6RXmJRh0eUSWIRpIY8FVFz5eMZtnfLKYR+xCu9SFctrhiG1/hygLjK9TautrPEbTRHTGim6GubMuIHZRYUdRbikabnceezr5VGzll961M3nFVUbYnWJhcx95jT3v6rpMesy3fv3MulOUVsdW5tXfMCeyplN2rNjMZCtpT2zGq9PNVqBF6Z5xPmbbojU2ysGoTp3z5Q6zZv41ue/w+trQWe42tM9qCBhBmlxbTGNO4bHKIjwQRbj/5mUy7Jmms6h1KDGkWrtM4981m9M/Id2/FDLp/vyB2V4jVZ3SZ5OK6CzhbUIyu+l3TGXt5vnc7zcow1e//st9+x2Df6edQPOFZdOamEexZwEbQi6PGaauQVAVzrVG2rd3Mo2/49j0S/e7QnNvP9hPOphwZZ/PVX2eQd9DFNNe776vBgViCe7hqyZ1WI/gKqwW3nfgYqluuZeyqSylHJqmMw1nzD8ced9zvOJccF0LApdmF3lfPCjFcu5QVNozss85tanc6H/FVRYyRRqNxQ7PZ/LLWsi8ytYdeI+fGc36UqVMeTbZzC3LMsfTPfx6Nz/4b2uzc5/5RMTTmp5hecyxbTzuP5t5txGabPS96PeNf+wjr77yB/thqQLBG6Pf77x/0+7+dZ9mpQSNp1vi8uPlnV4PuFcQIxp6CSCW+ul000Bkd+8c0Tc+pFzNBNb4ubzSw0ZMuzFA1OnTXbWQwtor5NRvwLsHct1iH+4T70epei4pJ0aM9vZdycv3qW877wZ/Yd9wpj6mao/TbY6jqsxsze58t1mHbDkLxRVMU/zOfm/4ieYfpY05i39rj65XRGkK7AzMzuKnd5G4ULxnXn/dD2OsvYvz2a+iNTN5L9dJ6laXo4V0Cw6AYERPMgR1rjbG2DnpBafTn2bXmRPaf/8MkArFOuAC0RYtPbvHF46MYRvfv5PhLPs9Id+7TRav1AeCjauzNjfkpW41OPmbnuc95dW/V+mf6JGNs33bWfuszH2pr/71PePFLufm5L2Ofgp3r/i+y9i+BYo2dSm3648EXXwIhL/psO+YkxuenWbfrVvrN+17jrTm7n/3Hnc7Nj34GfnQSW3k2X/UVfJpTNDuosYdnsvBikBOoi1HcnchkAIO4NwPXIkK6MENvbDUzz/sJzFPnGfvuf3PcDZfU0XB5m0Gv/4ONlrl2KH6vcc5drarvRvWzwA4RaSVJ8jxj7W/5qmotJiPddtttLyuKAisQd20jOekMZl/4OmbHNtKe3YtWBTqzn+IJzyG98Qrs1luJo5P3aVe3viSkOVvPeCKo4oKHhRnKRocrz3kum/btZ9VNV6ONuivKKiLNkR/KVq+5SeqY3Ym20e/OTaz5K3XpKUnDPz8KlGnzfWln9Djr0qcvWttD8H8SQ/xG3psjJim7T3kcu084h97IONLIKNOUqEf2RJz71b1W5xHLeD6x6jfTPHkT/dn2zKpNGF9i+wsH9HUYrgv+OS5rPieZXPMH2u39vpvdhw2hlm5CwJZ9otehaCOkRZfSZlz/tJdweq/L+K7b6I2tQWJYbi5tLmsRCBTNUbK5/RiNlHkLdSYgtf82hHDenl27CCFgjCGd2cf06DEkyQLp3H50GP2UGPebybx7dgCMwq6Np9Ca3s3mS7+AdiZeGVRfmc1PU02u48ZnvYKFzjjJwgxSDJhat5m9T3zRl8zUFNVEm153hk4lz2w0xn8pDFdxCWGiM7b2/wTnTgLBoPT7Pa4+/XzUOdZtv5l+axSUg99VDBI8WblAEjxSluw47ixuPP9FuO402cwetpz5ZBbGVrH6zhuY3HkbUYSy0V4chGXigmxE2HhfxlpEjgGuNSGAS7jzMc9E+12sBu580guY3nAqZ3z7k4x0Z9hnG9cF759mnfskIuNSM/6XEPklgaUsw+F9AfDev+jOO++4as+2bWRAcuajSZ//ahqja2nO7kES6jLVRR+dXMvgsU+nfdv1h5L8sPNCxZB3Z9l6+hPYv+Ek2rP70TQDDGl/nsrD9me/gHDZOHH/AjFvkEhJe2HvrWF26vw0VB/P0fW7Tz+PLY9//i+6YgBab3Izq479qfm1mxnZfgtlo40a+2du0Htr2p1n34mPYueZT6S/7gS0KHC9WVwYIElCLfwfOdw/RF90PYj8jMsbf2KcW1PHX3vSwcLd/E79V/QlzY3H/15v185dC9d/970ura3uOujhTj4Tm49BNUxcEEM6mMeznpvOfS7nfOn9NOb20x+ZCHLAEFPV1wqt+SmmRldz01NfTHMwz+QtV7Lu1itRuMS3xxEjWJHxNM9fWAX/CWsMMjrGaHeaXncOnzaxvgQUI+bZtcu3bnhSDlD0tmRhdsZHTmuEqlmNTHDD01/CfHOE1tTuWvdWJe3N0Vu74aSZ5iQNHTAReohLnh2XW3etRYtBGvfsqP/faNLIEoIvuenc59MZdGnu3U6/MxZlGCUooaqy/gIxy9m57nT6NiNppOw45bGIr0iKHpJmoF12HX8m+489nfHtN7HxhosZ2b8TVCkb7cDQCo4xxPsah63aVzE05vax/cRz2bfxVJqz+xCBvNdjavVmrn76yzjryx+gNb0f71Z/fTDon95s5O9AeZWIpIhgkpSgOsxKhBjj58qqfBvKlU1naQCjP/gymq98PX5hAZndf/DR0caQLOxndvNjkTUnMDJ7J0VnSb9e1sFSSQwIiqv6VDZhx4aTccXgINlFxZD05rBjwtYn/DCzOyxYYWQiMGrnSHfvvnj8liuPydutT9z6uOf+aAiBzBfDNkk9p6oC2+9+qzTune1y8JngUm47/4fYedq5GAytuSmCD7X6c3cRgd8njhzRF8NSVVFRrEveZ617FQpxKR1yWcAJB4TOgyp/qBKLgrTd/t+ccPLHRNgzDKuCsUl0rnvgmVp7e/PuNHPNEa57yks446IP05rd9+5Ba+wjClFF5m3ZJ+vNMb/6WG4+/SmULqPcuJapzmr2ja1nw+5bv9HetyMPLl2XFd3JY5rZvE9qa75rJmBgxitF1oBhAQpFv6qG8+tQVyXtzzPVnnjW9ec88w4a7U8lSfqCubWb6DY6NOf2LRnYJEmpuvPb5i/+8tsbJ5xGe9UxmKpNkHCRLu9HEUIM/+YlgjXYoQM97S3gV1tuPPU8zt71YdJ+9y+ic/+eD7px4PJ928bXM/voJ7G7cxL7B5Hx8ZSx/jRuME+Q2i4hqrTm9oNJ2LvhZGZXHcP43u2M7tnC2I7bf9gGPx6tMzb4TqM7Z4OxlHlryYBXh+ga0v4CUhZGjRiMudUWffrtUbad9HjsoF+/h6nVi9bsbrrja7juWa/kuC9+kEZVUiG7A/KaKvjfylzyGGJ8bH/H1k15llZ2bPJGL+ZrRVFcq4CLHt2znfS5LyL/yV8m7tuCVhWStA9MpMWw1Kog2BZ7H/U8Rr/yt7jBHKWkqPIeV5WfsPMzUUNY8EmGT3NMqLjj7KfSHVtNc7AAh8QMqDFIVZKUc7hBgkjENoVqvDFRnPio1y6ccOYmDdUmW5bLSA7RpWSz+/6rHHR/dmZkcms6u5/exGpue+KPMrVhM+nsHlyMYFIWQ6TvLxyxUlKn/Mt/Egd9TAgtEfNlMXLeobdejMVW9IYY9Vsg14qqwXGBNea5sVqMilJMs0mxY9vv9LZue4e4FJs60hNPQmdmCaXHTraxAajKU934qtzPzFwzmFwXmv0ZjrvoU6zeu224g0Z6nTH2n/Aodp38eLq9PiOhh3Y6VAt9irRxXLPd3tiY23tLd8/O3Z25GY6d2Y5bmEFtgqsG3HTcKdx5/BkkvmQ0GyMxjmgMYsz/FZGfEGW26M//j9K4/23G1nzeGJ4VkcQWA7Kie9COI9YSet3Plnt2v9mtOmaHa7qirGrdLTH6ZhF+F7Gd4MMHq1i9zjSSUE7PkHRGSSpPuXf3aL56Q3uf+u2jO2/iSVdehHc5t206g7mTzmLepsfYRr5L5nyc6xaMjOc0tCKKJZZ9JE1RsSARowYNFSHN8M0RDNE1p3ZnJlT9kORRp3Yzsm8bqxZmGd21pc7Ea43SlPokmH2jawmtDq6s6An41igLG09mdnQdjWIW6ko566KPIVRhrzPgO+PE6Smyud3EUGGbI4hLSFJHCJF4x02sndnNuvk9JN15ej5SOQe9BW49/jHM/8BPYvfvx/b24l2OcS2A9S5hdViYmZE8vzPJErpznl2DUVbf/i02fv19lP0+k2vWMXH62exvT2BiYGbzWewreviFGdKzzifOTWPFYESQNGuBjgA7y9l5kkZJ6VvMT+dApD0an9ocNR9XL5MqMrSyBw4SB8QgVfG2oP5dZUXVmp6mt2qU0FlDszdNZRQj7gQnrhVC3KKhmreJUCXpQaL77a954ffNzyNG9DWvfjOdc5+YJK3xy9VXZx2sGwkiSoj61yH4fxfMN9QKgsU56O6ZJbHu3/LVIy+PQ7HcWPClXNibjs8Dg02UZBz8zt2IuKZbNfLr1mUvI4TTMYKGeLsonys6o//Uv/KS76yjJB+bRH3F/Kpj6K7agC0G6LbbSRq5yOjY6ymrnxKR89Q6E/ImobdwS4X+QTIYfKDRrHVWVeHW7h34+X1YY9g4dgLNxgjV/CzlwjzJ2PiI64wF3+t2DVxmnD1X78l/q4pYh0lzQtHbEmM4PgawlkZZlX1bVCSd9tqqirsrEzAz0wz27SPdfBytRudNoap+3yXZ6KA3/7+nxb9l7d7dhCplz7EntcZHsg9l/e7zrOidvXn/+9O98IGRsYw2FeFwRI9C1JiINa8wYl6IyLk+zTeqMSLKTu+LLxch/EXDpt+d2HM762/6Lp3dd7I7wE3zA8rnvZz22Y9vxLle2tu9fdaNdkjzFsncfkjsjxpjfgV4AqiPgQ9qjK93YrWnlkoHmN4cydjqH7NZ402IPlmhR9b4d18Wb0p3366r9m0n37OD9u4t7BzdwNSPvAbTn8PvncLZEskaP2uS5k+LxPOADCUo8esukT+dnyq/sHdXQZhcz5obvsjE7RehI2von/k4ykedj1PWmyzbOX/btZTzU6w7/gzKuVlM3jzDGvk1rP0hVEfF2mvLufm3YwafTfKUSBOSfLXx1R4RvWc7X53Kh7qEsoz/XEj6MybO0/R+nbHuLWrkBYKcObx6n8bwKSH+rm+1dkRrlk7Hve1VP/j/T8whjpwffdBDIp8TY846KGfbCDGET4RK344x60XMq43Kr0bR31KtbtJoSNMUxPyDxvjyxd+LAYxjcmTtsNDDoMCXFttoPCtpNP/JJNmmONQjUcVYezzwprzovUkbjdfuG9/09+6Y41BfkVQDGjN7CSrEZvs5JnXvkcgpDPOdJQZcd44kSU/KY3j/AJmeH5SfNQrRgKkGGDGIWETk6Sh/bbJ8nUX+o3ft5b+QtTvkp56BqrlWQ3wMcg+Ve0TQGNBYQQgXhplZl6xa9SmJ/jxrk8tLX7wQaewmA3ZuIe7dC4nBiH27uPQPjBhCCKTNzi+ukXjFzFj8p8GN17F61fiH09aaHwhAVDkxa7n3jzrZY1UvDIvB98PswCXjp5G3WEl+FeHYpQlRLoWPHpNY98oG8soQypfv23zGvy8cezLm219m++49lG1lrZVX573ZP/FVkbmM/6vzM78uMSBp8i4RfnVJPxPJrJPXxshxHv0B6fc0KfukjebfO9HXUPYWVbfcDHpvsHBKf+3xF2w99gxSIm7Ljcxu20Zrei8QMM6c6xoj75XEPW7RXVrrE2JF7TNE5BnG2p9r5vyjidNUp5/NzOY1lIVHnG2ODhY+hPJ8G/1tRTV4U/TFl1AwiXujTZK/GcanDidifKxrNj+j6p5j8uS/Zr74ecod2+Kal/7s9TRap1IWdz/Wpq4EZEIk8bNfUx9waesNJkn+TDDtQ0KYVol1P2usfaHfvesc3+9ttcnd5xN9rzhiO/rJf/3vP+9aI38XyzrBpA7xE6r+wsskMZ80Nv9LEV5vhmJOjPEvUf/LRjxYQTX5NaL9n8iBJAiFryrmGSEWhMEAlzZf7fL0n9E6pPTwGQ/D4n1F8XeSJFeq6i5EerW5PD5RXPJ2QevKp4cJsjFphp+bubZ383VniQLtFrp+DRoUjYF2Z7K0JklUwLqU/t7tvz2Yn3lnY+06kqxJ9DzVGPkKy8p0Lca/66IPFa7Xfv8fNYZ3iUs+7JqNl8QQh/nL5X8H9FkihjizQAwRm9pnpSOdLyEHYtTrpBn7D2VV/rz3/sRGnt1ysBAlGNHp6Pm9GPydYgzqq7Xi3CaM2QycK0ZOO6xeuJQGTK2varhegz8jpjkhzUljwATfjN4PDSaKTVK6+/Y83Taap2d58713zXev+6Cc23tOFdMrG632h22evkRDuIv7yxrHXHf/M3v9ua9Iu42b6uL27ic7+XRcnrxCkH8VY7gnyUlDxKR2s2lmd2hZEbr9YXqreatN03fW+QoWX/Znfdkby5pjbxIx7zlcXYPahiSXS6N1bu+6y5n50mdY/fKfx01M/ipl8a5Dr4WlMOOI9xdXvvwjkyWfE5G/sZK8cdn3d4FJHMX+qW/198+eL8P6Bjve8Ya7fc/7iiNX113sX7KYqSRC1LAnRn28cdlW48wWEdmkWlePcZ0RChY+1N8/D2GUNBOaCb+ksuzlBbQK12sjJ/o+iPy4S5J/1hCHxqq7aUiMqLGYLH+txmXZR7XfBmJgyei1+Chj6+d5TywLbKO5tv3o87DWMSjn6M3vA2CksepNzuaJjxUSFaXAja/dnLYmiVLifYXBnSNizIF8ZYhi+zGEHzYa5lTsvJ2cvHH3N/8T5uc2b3j2i19SDWuexagkLjkmjT2Cy6nWbkTKIk0T/RjeL8ZKL7W9KHp/jRjSvDFZ79jLFi9VojKO5a+MqYdZXAMWHYSLu+DyMRy6DoehoxERIxCq4P8o4KG3l2pqjl5UGu31r2g1RvBVURsOq4psZPRjIjJ5+KIWCmKxkk3aLP1Jm6Uv0WFdu0OnfNRImmSPlWTiK1IUxN3bidGAkZdZl/xrDOEeSQ5gmw3KfbvfWN649TdjPsn8YARnI6tOGHsDRusSkMHj0nzKKH+oGn+nXoyWDsCIDBfreix1Y1iYkfZZj9bGGWfjuz3iYPAsaw9EURoxFFX/YsH8okszjf3uXj/ob+k56GjjXxLrfiocpm/EOjTWC16sKtKJiSfJ6OQ5GuMVR8rHdsSKVZksb8ZqcTc3W0IVjo0h7HJZ2gOzaSnbpz1K9+rv/HXv4/9ysXanKGzEqLzLiNmw/H4qhujshxYu+TJx69YzGxNr//0gkWoIsXJwkQIR0LqU012wfB0Z7vwKXyz78y+sZqf/VKyteaJybayUsqjozwlFfwzjRickT98VNSwZFWOMoP7fE+OoppXBrO8YK39xUPvSnN5N1/xmccctX7Yj45dJkty4cOWlkOeMP+5pH40L80vkNEboVcVHp8vA7O3bmL/mCqzvvVt0GM8+bDNRqxjikxS5SoiI710Vq/JmOZwrbJhAIQA6FN3vspnUO7gavR5j3+QHg8ngvVVkbdRwouL/VdVRTucUO3KYMUlq5U+DxoMWTGPsJJi6+u1hJqigAWd/3ab2AyzWX4vhVlU9KAVRNZKnnZnxzjrSmOKTFm7VmnPTPP3QoRLA8JCEvir/Tn0iTn2PEDEuPTNrj+Oajmy8R2MsvsqoHru0adepsWskzX7HGINYg0nzyyofXq9RFw4mmcwnWa69nXuZvv5GQtG/IEmTH1xqSoxImlJq49VBsktM4i4lybdo0qDVGH2ns+Zgki8u2NZ8Jwy6H1Lvh30p4D2W6nFGPJZ7zc68TzhiRNdQN9QYs78qi7NDCGXi0h1RY77IMBFBhd3dvXveUs2DSVpMNMIFzcz8aogHG+9Mmt6gvv9VP7Ufl7Y/e2jxfWMEse5vurtnTi/nB5eYwyRdLN6LQ/YuEQgh7PU+vjTG+NxK/SfV2s5icsGg7P6PIi7gJZDlbdp5m0468mmLzVXrwTLWEsrymv7uvV/ygx7WJmRp9utijDuwmxtCWWyTsdG/TtauJe7bR/eKyxhcfzVjduQdzYn1j/XD0GERQQNU1dxfVjpHLAc4rU4y1rz+IGIaQxWrF3j13xaJ+OlZ+jt2D6qF3qtYVhkHEWRYcinEeENQ3XJYTQfBGJnzxJ8fzM2fEQbV39pmfoqx9geIukej3pEkDcrpBWb37WNgEprrT3hfkjcnNRxcnqkWh6Ho+98oe+WfH5phpiGIa3aeLy4DIiFULx0MihcenJxYi/gz++e+suvOvewJGdUJZzZaJ5x84XCnPehaH/1l3vvTYogvB51Z+tKXaKO9ENaeAKOraY+N2dE1E+/WuqHLm9USAOPws3N/uXDtdx4vGvtibWcpJ14EQS6PxhD68/jtW5Gi+mNZVgLKtlr0tt3xb92L//vG4pZr6G/dQm/LLVhjnp+l+VsPbfdQavqLarb3uGLv9BuWF4hUQFTn7FD6OhI4gqJ7LcJUoXjeQn9qvuFaX7RJMhn8gcmggM7sf/HIE5+q0TwDnZ5+VELz81EPXunEWIpdO147c+ttdM571lsbG445rpqZWiq8UBv4+KwKvxC8Ynx8AuiFiDznoEFUfXdQf7ER+3Yj5jTViDiLqvlOWfSfb63sc6mh2eg8U6x7Iz7iQ/idBVn4sg4WMHfsQhQ6J5/9VtMcPz+UJYs6gwKY9JVGUso9d+KaSZJObvrlYXjs8PEKvvzV1tqNxBiYvuFKqqldjJz12POap5z1tmp630ERYBX+l5p5Z29LLf6UnDTP/oJ+n8XVXsTge71/q8ref+IEU0QIirgMm2UvOSidMgR00P9odO5viqC7siT5zEHBC8OXiCZeTAgvIeo2a9zTRPSDRtxGNRHQOwnyZKPJtkbHAYE0D8/NW/Hl9bAuU3/EoBor1eqFVVF9zrrso3JogV4Rg0Y0xG6l1fMI+o0szb4gcmBxRCBWfNtYuS2xigmRpuW9on5i+WYwLHJxUYj+abEUddb+KIk5Y1lwBib4b8VQMVjwZEnyt5oxfqi+IgJibVH1y5/s7t/9UbMwe47Lsn85IPnU/u2FYvqfq3mPGx1l8hlPfXyi8rhqWYq0hoAm5lfy9asRNVQzs2BIjJV/P5QrJm9Qzc//dqz67zRmQDIy+n8lSdFFrtSBQt+sj9k6MrL7kbO6q16DyOfKQfhOmoz9dN5sXLCc5MYKg154T6zMN6x4oDwv64x8GaJbzk1nLYP+wt/2Zua/bic2ttNW8w9Dd36J5HWhB7993+yuH8YljG1Yg1Ul+rj+IHlR2B+QXzIYROQvFEWsJQ4G27wPj0saTRxK1EjwfMdq/BsRPh9FP0sVCdsa9Peso7nOnpw2s3dqWHaiijVU1cIfVj5c6cabkE1ixfw0atq6XHqBLVHsf5gqMrf/DuYanvyk48hXr/tYLMulwBhrDYOi+ubeBf/uVmZpJqB+cGL0/gVmKOKJMYiROLjz5l+o9u3Grd6I3Xw6MfNYG5/hMvdri0crDe0CujBXvCTrKHmWf80YOWF5UJLUef4Xlt255xU7Z0marae3Nox9Jfphxp0qxplNhbgXd+d67w4LLbKRcduekH8LpV/aFWsPkgGN+6sQnxEj1zQ6yYutNS+K/q67kRg7G8riPPX+Jpfmv2kT97wlfbuOCcI48/vNRgNxYGw8HZWfCv5A/4sIVeW3aNCn2sRhMz3eGvfBg0ic5KivPhD607Ry9/S03Xxt9HcpIoxG3eZ9eE6x0LvBTq42I2ee/eXY7S2pfmJAWqO3I/5zLixgNSUOwu9ocnCYbtXv/oOMT+zqbNiIKT1+UGJc+ttGdCRW5ZKoLiL0ttz8V6Y18k7TbGKb+RtE3YsWSW6dYdCtPje7v7etMVqXPT8SOHJEj/ooX3Rx2LG02fyn5dbL2jin29TEN9c7hfupLEn+ZagjLV1nnaOsyi8FjW9qbjwGl+ZvMKiN/oCRSYAQ44vS9gix22Wwdwcubz250R4/a2lwBILnKo0KiQJasSgEiag18iZjWKOR0xBRrHy66A1+Ickcrt1EvvVl4rU3kW44kfHTX/QJySKxNxiSUvBlvGJuJ2+3idKaDDTGxsG4X1UfOGg3D+GtFvChwOUjrJKUrD3yHtse3RAGvQMegqi+6PofTYtImjh0UOKy5Desq0tHAxAjVaV/4449dSrddDJJo4G4hKLrW87aj7FsuxabEOf2/U+SgGTpr1prn7q8hrtkGX7/nsul0X6eyxvEZq+TjrU+H8OBkskYg0aI266/vvQpPb+afJS/1eAmlouh1gmDQZjqTs2e1xxxtyl5Ii79v4dar009B3xBPF+y9CYLZ1pn/mT5+ItzhF73Yom9/9RGk74X0uj+KHWHJO8oOzTEk+pwUftj1uo/IrSWRG1rCDu3/8pcYfYXNrp1zexjhxr9xBiUeGuMPNFXxb7goJG23q+93rgu2h6MATH0vnvRLyaSkm06DTWhI4n5kXiQdAFi07c7Vaq9C/ieRzJDc9T9Rh2dfGBBiJX/cKzKtySJaxiX/i5VfKvKgT5QVYoivNk5kBjWibUB2Mv3iSO4owe0KnBZ428xoOGAKKaRsor+FGfEmIb7FyP2lbVdbfm5Y0LR7X95rhpckLsMg0Vi+BkVljrKWWF2vvrIdL91SacosN/6Ar25aUZf8IrfNas3ELrzw2cakP5nDAVSp0B8WMT8ioaAJNmxJpX36GKyDIKz5mVY86aIv8BF3+uceR6tE88i6TR+0yWDM0J/sQ214a/05QsDFmvAigUfX4fxpy69i0uoegs7u3vu/JB1DjeyjqS9Ftuuzk+seVMo+ksuLEkSQtSfzlvpvjQtMQlIX89E488tTaUhh0PBO6MmmEyoCiFOzZCP2M/j8vFFwgybOVgI8lt5nmapTd510KQ0BvWh52e7F4SdO7CrJ2lu3vxx7Q8ay12Wxlh8KC8r+uWFtp2xelP6g03nXrt8ZwWw1mi/P3jKwNvbWs5gie81RkaXm1xEBHFQDsKz5++4+bokyxjZcPxHai/N8vBz0Kg/3d3Xx41nNEebz1avL4qHWA+VuJBmyR8q/ABwzqIxEeq68GU5+Ohgevf/aq3eSGdi9edBJ2JVHSCcEeJgsAvHE33l9nX3Kflo9rSsZX8iVAfPyVDFr/W2b/9MsnqCWMyTOPe+JG+jcTGwy1IOev8xmJvZiU3pMYmQMJHo/wAay1VJjRGM2NaJp79XffVCDX7tkhRq6oi8QVG+0hp/W2d16+SofBejFwIv4vvEkYt1N0IyMnGWiLxi+emcIhKrweA9qD7FtZsfQHXNXQwTKBriP/X2zf5sHGkQvCWGcFKSyOkyTBdVjWBTTCv5tYxAFefhiefSysae0Fi17nmx3126X/CRQU/fh0lpJpaI/x0t9dEuS56tSi2WyaJdod7Fkkb2pCr6PxssdH+B0VHc5KqTE+v+JBwIIMFaYXa290vFwN8Rml18jIhd92KMe68ealH1gz+3gz60JiDtQFm0TaqfWZ6TJNZRTu39LL7/wdiYoN+PNJzfnI93LtIY7SLxBKiCfiIk7CIGQhXAWzDun02SPPUgQ6YYZmcWXmMl0zxJ3z60jNTfDdMksclLzdjkdDk/hRThrVTx2XXF1gPtj8HjB+XLzIYzSZL4mIbTz8Z4iCguQtUrX9VOuD5pggT32KTd+NnlIrJITayFveHVQc3XsoFHAq8z1p4W4zLVTiyl7/5ZaIYb+ltvIU/PfPzIqvH/qsLhCn/KKQpvPdw09KW+TyKvTk84iTRtfEJCuCAOVaSl+abWR2ufYlK3L/YrsoYhz5MPHGwqEmJQFnZs/4n8cc8kWzOJzk79L5ckL1x+MGVd89/+D+OaaJqRFLPko82nJbn73aXN7qAukxfFYnFOLbp+Ba1KvOqrtSw/aAmnIfYbLpFWxF95uPf8XnHEiB6riEvMOw8VkTSo2sy9SIz9lcXTR4eVH2pdMsSFEMOvivJ3dYHEGXIpMSPjT5ZkVW2IAmye0tsz+2V/5547RtaMMbdqFb7sMNHp/JuoIfpqSRRWqo+EqPvUG0IqxEifyAXqyxdojM+StLFONO7w3l9uxPylWFkVNWIwL7Mkv2CqCmvkS8trnxtj8CF8Aw3vzhLH3GxB3mr/iHXJR/xBE1sIZTHwMf8/yfpTKMSjoU+eZ/+F6Pii/isuwWTJQu/iK19GDMjpTwLssVmWXqohji1VQ4Whf9u8OwRP0a9IDYyMJX+GuFeHcIDIzjl683NfnJ/qf3DduolUnLxlOTlto8lg57bPDfbs/FxYewLt0x79ojS174zlgOWTzgC+V/xeKP1tabPamLn0a4fUyxueMBu+4BcGH5Q8R2IXqeK/iGmjLOs3JxRd/1dTW/37mqsCY2efnThJ/iz0uweRT43cGfZ3fxM/oLV69dnZSPOiUB3OtXSoRRFAMc5dV/X9H5fl4AN50yWJ2C+qD08/OIZIECvMzc6/wI52bm3Ygiydw7TbP4uYY2MYSjTDMOUqht8sGmx3YZZmv/E2yfJfWprDLKqI8VuG5NrGRAfTTIjbbl5vbeOLh68Zcbi2A/BpvzD/yzh7q0We5Vrtz4iThi91qpiXdxzuF75XHLkKMy5ZB/qCu0T8CNYYt/mgDrIOgieG+E9FlN8V0e1OIEsNLh2B6JE0O3V5zS+JQpT4H4WtiNWAfMbRnpz4Gxfj8T4unWRaH3Zg3e93Jh3V7DzqhRgMkgihLD4tyKfVRmJVEg0TRux7gcX+326NmTBiPw5y7IGdMKI2Ixp9eauT4ytlTEd+cGRk9JOLx0gdeF0lRv7Di1sQUxdUTJx9vxGesLTzGgO+pDu18Hp32hO7jZGMQa/YkDaSi0XMqoPPRBOihh0i/a/kzlEOBNexv2es+fUQlhPPENBpKfXHVncM1oXnRtLWctE4eo9K8lppjeAS9+zE8tFa+jrYel4NuruL2b3/I12zYdw5801E27pswVCNmKQZTeJ+wpm6Um6STrwwceasuKx8sbFCKLiq25t/y9hJQtJIqPoLrzImHznIcGot0SU/Nr9jB643/6g1z33Bt8PcVFqfo7bc6qwB4htVpS3Co0AccAdiLgr9/hc0RFxqnyAiHxFh46FT0ZqEQTH/v/b0bvtC03dodNYjromqe9vyICyxFt/vXq9V9Wd9LejYzpsS697h4wEjZN0PIMT/bawQqy46ZzLprPmaGpMeJhrpMpQ/VdXHiMgmwKvqNaBf1ChXSaODdfKrYt27Fl3sYcH/TDl17ydh3hccMaKXvekXt8bXEg5zntchovotGsOnw9z0/43qrqU9jjBAJSFdvRpNHCoW8eWYVn0WUwZDUWBHm98eXXsGLHQxs3Ovtca/MSxzQQzPQPu34OO1aEEoepgs2+Qyc3wV/VeNTTDO0tu7A5s0zmitXX1prKpmPWCCahxFuFL+X3tfHqVZVd3722e40zfWPPU8MkM3QUFmJQyaBAVUBMQkDjhkUJIYw3OAGJ+CUeNDTSJLDRoEDBEQXlSiKKPS0EADTXfT9FBVXV1d4zff8Qzvj6+qu7ohK75nZ628Zf/W+mqtqvrWveeee/YZ9v7t/eNs0UEOp1wBzc3PfVNVJ/fkTz4TIHVpZ6njLnDe1ueyNgORBABjAcZwd+AzZJrBF8FXOeNX6YVORy9APL1329Q9d95WPPUsBL0nLw8sHifB+40GrLFTxKgHAIRgqFXDu+MkRKFYQL7ofMLNieuNNvvH0nwV1SRJzkMp36LZaag4eYPIu5jfjhIRVBLfbPPBWNBdvlRY3NXWiDM1Yqy0//0YA8P571JXpy8E30QWiw+avK2FyBUQjey8Pnppc8V0Hg0KyigO0CfJcWHNgi2yYag1Z34nQQuB2wVuPDCGqxcubESErF75W8PF0/7iJesczh/VYcPPUjsMixoTOGE/VR+Y1lp/nYiD7bdKA204VBjB8eRnuJe7Dtq8gmLKuEAaN4db47uuzSUhCr19AA+gVfoaztnKgwyTSyT18TcTAX2lpR90JPtKliWwWqUkHWeBsceA/YFmBkgyV0r5OKSzal58Yv+9iSPJWg8pnd3lOYW7MP9/0y7/DcZXc0d8jUDntb8v0Go2bq8n4z/gpcOjy3bYCDOSOacvLJzQzk1jf0OgswD7bgBvtcasMxarjUqutUZtbgsctFd4HdbQ2jeKcGw3Wru3Ia1MTbOFZaIZyyjVm6gWgpF4j+wd+MeDnEztn2ma6Q/AKJAFZL5wjfScHcLhP3ek3MI4P8XAQHjub7uF/EajdLA/4gQLIlrGOT/IyNH2lGpLuIZ39oAYf59gdBc4g47CrSZNryUuFrSDrLb6njRTkEx+lzH+wUOdSSaOAMe/tvPcc5BbuuhUJPHTxHm/TRSSeuVyw7B9foeitYbjOJ/3gxKkcD/tFdlfg8wCKjqDtQbJ5MQlNo2fhhCw+S6Qm1sLc/BZkjE2IDl9gSlzF6yFiuO7rbVjC8sNG1grmHi37+R2wNrFh9aNJcZglKqbNPqs7OqBmy/CcdhRxGndwlWfCSBqpX8ZzvBRJ+uE5B6I2QDAuv2EIs6QpdnGqFL/C55lp5Z6+p5wy52BDkNkSfpGC/rFfMvakTcqwbJz5uPb2mhoZTuY0R9yCsUd3MtdZ43GoW2eGz9IqpUP6FaCvN8P+N1oJBmUxZlsAfWaM4awNnudzZVf8nr6P+k54qucC5gsuV0n8RcX5qoTYaPWqFllVwjP2wgh1hPNeWGsPeBcYARonGuVLVg75xeChiUcwzj/O87pJSKcB9h2dCJLN6ssuYLlAtB/Ur77V8VhW9FFsTxoswQgNhcyMkk9rV/vCk+7wn/k4HAbw0EdJiSy1gzSib1grg+TxGDd/fd5nT2fgDYAWVgDAYg3C0mrwdhN5pAdDREhicLLlDa1wPfAyV/DXPqHNh3WgjN2lLV2g7X0gFfuPh/AKxNb9ofwqGnRlg8iADpqJe7gopOY510KnX6MqJ1Uk0FcKHNuAdp8cT4mbmHBid3MHJzOGK17xVEGgDEKnPGc37v4KuZ63yFrQIIQR9FfWubcKX3/CyZse+atwax0WSQsfZ5Af24OcRgBQBolV6Vh6243n4dkBHgEgHKH8sGJ6DJGAiCCipMXibGvc8f5wULnKQBixK4B8KoGwzwf0cvbvhpv26z8Y06Gs3wAlDZ+m2ybdjpHF4fKMKK4vinX6yBwPXDOYKwtW2OKB1GRYbZ4Xb1Xi8C7VcUROGfIVHYD890XZamkbK3eZt20n9WTgv/MWHwPsKOcsZUAnc0IHZhnTs5HaQ6arAGTpVtkvvhD4Xlg0gOX7dAuMepe2Ettnr3UnMtbyeJqCw2TmQzcvdLx/I+agyZPLOac/b0g9i5izG8XybQw3LlSOOK9Jm6dM+/YdDx/vWP9bcaYewDSRPxkIjptf1vtnGZbHA8ntcqZfl8vAnTiPzjT/1/j8IXXVKoWFFuEJfYdkNRgsu1sWTDbay6hpAuidhqezjLIpWshlh8NrjIwY2CMftKk0c8Z8XPmad7CYXe3ncgHuVgAImiT/rXWyX2MBEx7Vl/J6ECV0wW01PPtnNzSIQQbkLXQRr8LhEHOxGfnXxzjPIAQT85t70GckMTsY/HY6LDm4Wv9xWvahJ72ZEaM+B+1Iz5z9zhEGomIgQR9jxwXMLpNG23af8uYvcm++ASyxWtflstWDpmoBRB8WBpmxLyDj0AAca7imcpblLX3c98H0wq61WyrxUpnkksHh8az235QgiFxtXRpjKyW1h7UvP0GzhwHVqn9EyIRoNMU2vJbRM8ygDGo2jQYaInwnIOuYbT5nw4XYA6BkUWWagCYYUI0AFXA3MTApXOVcHCVtQaME9JY/4C5HdfH255AODt5S/n0Cz9E9gDfYi4s/baFN7NzD0aMwWbZsMnSzcwP3nhgnBCs0l/j3Ac5BRhkUCoEjAUJOc6ZM38VWAsI17uxnc5rwUmgGs2eH6Yt25HvCjzHW6grv4Q4vX9+fAnfR7h34p7prc98t7xq+fLi4Opz1Fz+x5zi7gBx+sDB3uq5vm6HPZ9JwuR8o1QFaC8IhwuHbetOoBfaKwxra4PH4c1FxeDEMWwWwzgu4lwJSVAE1xm8Vg0yCdtVSIkQVCcQzE7AWI1UcPAsglHx5Rao7qcBvsK/0Y5ra61uNFp/CkQQjgvmegDjD0Ob8VeKzNtXuRCBuDBZlLw3btW/Hev4x7SQfDhPc7QW3JVII3Nz2qIbOWmoZnOjBfa2FVjnBgvm9MXaNM16lugLIOU+WvAdWAur29lbBmZDGpk3aQM0uySaQn+eHXC0+QAOMXKCsdiQxvp4k5n7yRowx0Pme4iyCIlOkJn0jldjTzIiJFHjtiRLNzYmdUMpgA45BraPVBzJ9OR1JolGMcfpJmKwabLLdPXtYsetB1wXZnw3bNSYwv6EGguAAxw/4QIAA1phjGhmBvHEeKLC1m38UJlgauuJa6MeTVrxxRYCrDwA5nVsUq3mjfSfyArT3CSksvRxTXKdLJa/QQvOyQTAcP5DLQiaWyijEGcJIpMhUeldZA/sjgDs14BrX1O/I9PZz6UwIKNum8toOnDzuWMEEYOGfSaNw0uz0VE0x3d9QTNsPZTDfujQY7ydk5A06l9LqjPrQXz6lWP21we//vrrD8uFbnrs6d2ciT8SrossiTe0ZiY+k6kYaauG2C9C5AoY2PIEBrZvxMDwZpS3b0Jh/GWU6xMY2P0Chl7ehO6Rl1CYnUDqemh09QEWLab1XSA6hRFbvCAChLkEmfGsWfuQseaLXEjoLIVwc3CCAqBNpuPW/eDiQgI6X9FgxuZX28Qac6fRuDwFe6DlCBid7XMNlUiI04jx9uLPOEAWql65Pkvsx3RGYKtWQCxbaUxt9mEO+04SjpwndxNjsFpt1ml6QcyDJ9TUvlFHirfSXDEBIgZiBJWm3zNWX2Scgk2ZA9E3CKHFdjKqzAU7lfZXRJ3zYBFGTZJ9Sin7HsvYNCUJtBDIGINTyAFeAF0oQ1izhStzLBg7dr6/GDHoLL0tqk9dpUSAqUmb+Z4dDQJ58QExRIIhVJVJr6y/tOsWcr0ev1w802oLIotWoq8NU/OszjLInAfZ1QXr+jvI2CsZoUBCQsWth9I9w1/SjSqiMII/MQrrOjBGQ0+NPcjzpbOZ4y7ZvyW3BirT31Bp8hbj5iGMhZQEtvQo2Pr0T8CYJMbPejXW91w4d4eOkk8onX1AZSpOK9WYOfIPuSPdduJLtrceVz6emRBJVkPGXUh/CcgpQVjeYDbdBsJlNH/uYAxkzR6d6ssVd+9pSAGYTlDkz9gsrroBu7Cd03BgPBpj78oYuzCemtCiexDe+hMVGtFtAuIkYlj1au1uv3/9U234+3Sr9hUY1abuZjFE4UAtvD/9raP/3w1z/n6Hq/BE+YZ/RFdn1yWuw15fr4WfTjWb4NAI/QKk0TjluR+ja+wlWC5hXB/1JIO1CjmrwaQDK1xYGDhpBgVgfNWx2H3iOQAJuFETYOwtDOwCEJYaYtOai59nkt+RVKstJ1cAkxJJ2IDMdcArlKDiECpsgMeR8AjXgNEbIJylhnNQlk4iS3YaTb8gRz4Ine2N/S649SnkxrZgemg5skIfCjo7V6TR5VbKxdBmaxpH/9SMm885XauAVKKruhkqH2DSKyLfai3zfO/PSMiTIJy9YRL+MAL9Ux4MsVNE+MKT6B3qX8OK5XeRtSeloH0a9l9Man7E+vvhPvEQlu5+HrtPvwx1r4Agm4Hw/ItI6yutMYPgbIdxvAeVFN83iU2Y64PBIpuZgXYYlj/3EEq1KVjPx+ziVZhafgIIHDJuXmoZv8BaIzhj9+kkvrueNGGCTjSGQ+SWdKKjyC9iUfROsraLGP9lkoVfUZxNzW6fgjvYh57e4h+jVVunyX1gTyLvSCwHGYvOkkAux5EoC5FEnW5mrmWB12pM7/mc2bXDZl4ei1szWLTxp9hSXoTkgsthxoch+peAd3Re7qn0HCJqpZX6nUolG/jgIDQ88G99EX2z21G79I/RHFgKUZuFzOfXgHAFgNOJqN8CM9p1N5tW+CDX+m6jjOG+RG3PCBq7xzB42muWSte9jhvpjmeNz1XU9FaQAARH72wFx0xUkToOZgdWod4/AJ601vpK/QGM6TVab+BS3NqS+UgkEYY2P4TM+NjV/1qkZRc9fvP1UPRuxtkSItqaVOrfp+7eHzJPIHzuGTQUwTt+GQo1BckdQOJCC3ozQCeB4AE0YpPkGcbZfWFknmLSBUtmAZVBOwWYsApvoH//cXfHNW/5te3z8Bn69begu6cT3CRo1GJABIj8HLhROOXJe9E1PYxWsRtEDIyAViuEIQvHcSDmSBoWgOUSLG2XfppceTy2nnkJyGg4rRqs8GHKndCtEE6rglxch9i1DVIrOLkAWisw4uBCttlvtVlM9S5F86Qz4XIGoVLo2UnEXYOwlSmIRhO8oxO6pw/utuex4hf3oCNuoVHuwq7Vr0HlmNdAzOyD4AwN14c3M4W+0RfRmq0BSYZjkykYzjAxtAq7VqyHdV04xTIYGMz4DsiwjpV7d8Jog6dKS+CtOgo+NNJCB6g2DdmoIFpyPPRTP0Fw25fwuqNWobnkaDx18sXIigUUsxbSKEIoc8hxBS9L4beqQKOBVhhBdQ8i8YpYuu0xLB55ASkJSFhIBuwJOjB89mVA3yLwqQkYo+BIhpC7aFWncOK2p1CYmMTUqqMxs+JoxOU+EBG8sIGa4GBpiGWP/ASmpxcTJ5yKWi6HUrWJwtZnkAsrMNwBFwTO2vyISv8yhPk+OJIQ1SYRT02is1XHCZMvoz4zja3PboQ5400wJ7wWTrkb8ByYYhe0lwMND8MGLnjvEMw3Pwv70A+xaM1KOIUSxi68GtHQGvhJHdoSrJeD9XyYJEIQ1ZCECdLOfkBrcGYQ7h1FsmsEPeuPh/GLUE4ZbOQFdO15FhIMqeOif2IMHTPjAOfIch0YW3E8xpYfB94zBFmdgq7MIlu8ErwyjWMe/Vf0zIxBS4Ga14nR1adg7Oh1cJtNBDYBSl1oxQzs+UdxzNQWFI3BVKETz558FjxRRB4MOudDKw2oDIwYMteFrVYRqBSJBog7oPj/E0PvuOEWdHV3QiBDsxohDDrBjMIpT9+H7tk9aOQ7QXPnVkaEVjOEYa80dLB2tQ1rDXKNWUwvPQpbzrgEaVBArl6Bv283unc8h46wAi9TiGcnoY1GUCy2PflpDKsVGOOwSYzpWGHmrIuxr9CD8N5bcWLZR/7sizDslNDoXQG3VEL8s3uw4umfoD+fQ1bqhhc1YMMmhletw9jxZ0D3DKK4YxOWbXoYPVED23e+hAwWi48+BUwlKEZVjC86ClvWvQGOYFj67EMoTI1CqBRCK4gswWSxD1t++ypwydE5vgv9256C06yi0bsEz//rP4PFIU656PdQCiuoeWVsOvttiAeWwJnci/zenVgythVeYxZuliBt1DAyPIzI8eGWO7GkEAC5IjQAAYKQHK3tL2K21IPqJe9D1LcCYna87ewijtUP3YOhsZehcwFgMsROgMrQSkwtOw6tnsVQUR2rNvwYy/Zsh2KEfQMrMbH8WAzu3oKe8e0gZgFiSBSgrIWwBiZXQhwUwIxuD1Ai8LABzjmmWyG2Pv0UbBLjuDPPRWdPL1TYRLOzH5NrTkZFlJAIgN/9Ldif/gC2tw9DK1eigxQyC+w9/2rEJ74ONmrCm96H3l2bkGtU4DdmoYxBbXAlGqU+qFIJUzM1TFUTDJ58PAKdofvl57Bo+0YEcQTNCGSBluMicVwIa+FlCVjYRM3PY8+Kk9A6aj1sqRfuzBhWP/p95CsTiIo9ACz8uAGZhNh27DkYPfZ0OIUcdK2K1h3/CDx0H84++0x0LVkGVGcwMrgC2044D04UQ1b2ojy2A/k5QZxWoROVzkVIegbRgAfGOERrAjxqQrslmFYF3uDAfkPf9Z7f/bXt87/E0GuNDLFXxCnP3I/+iR1oFLoX0AbpHMbYCa1m6+ca5jnXdcGJMOemEmDizbCm31jzHRBqubCG6aE1mO5fjo6RrVDPP4lyvuB5vf0fBZeFRhTdlqns2aDQrhPAtJmLsBAs0VBjcjzLmo3JlBii2Wl/cNnK/p7A3ZVwgT1rT8Oul7ZC3fcdrDzhRAysOaYAY/7MAD6y5J/CvcNb1LK1SAZXoPulp0EqBXX0XrRz184nVaamj1l9FDKjVlno5aLZ+Pe43ANhFPzadE75hQsNF8t0O4x4R6CSsVq+Ay1tUBzfDS7EElEqt9CozDz54jZo6RXXnXhiF5fOLrc+jXr3ECYWrUVx7050TY1AMLYoc7wPMunaVhTdPDIyss+kETwp0bdiNTgXMNpAMlrtuM411Vr9x42RHf/OghyqJ5+H+rozkPUM4Niffg+LtjyBRqkXIDAwXMxV2i2i5jcSxzON3iXwWw0E1WkkuSKI8DoRhztkGk8ox+3L/NxKWPs4wULZNu+OEfU6Rr+etBqygCKwbxJjjYwIkBJRq3nq7NT0DkaY6u/uguf5pFR2ukiiF42Qs1H/ckxNjKO68RcQ5S4QF/liqdCnGXbw2Slknf1Iz3gjvOkx5HZuRjGqw82X3qU9f41R2c08bOzTjgcrHVRlDvs6FqHHIZSq48hVJpB5+aOVdANrzUZgfzQLDFjLGT8D1ki0Gt8e3vJ8uM24GDjnQqzXdaAyhThXKjFrzwewxBJZniW3eo3KzL416zF25sXoeuAO0MP3Q/cMDpR6+qXkbATWws0STFqJNGyBVadR8hx0Dwz8VZYmUFH8JZMrxmH3AKY7liDqHkKmQsReDkbkYMIKvIEDhr7zfRf/2vZ52A1d2hR7dYDFe7fj5Of+Dc18JxYkcnCARgEMW2t7tdF/bi3uZkRgjGCBExixTRZ4FNZ2WLLvsKDn/aQFkcaIuEAl1uuLHZ0PwNonrLV1IrzRAjcYxr7IOANp2xY1B+B63p/MzE6dvndk+O39fX0o9/S9l3NxXhzHby96Lka3PI/nX9gMFMo4bt26M4aGhu4LW61HOOeRdJw3NhqNj0oV/b2rFSLpwzCBYrH4zO5du3ZXK5W3HH3ccZCcb86MfqLeav1hTiv4XoBUOpcQ7L8C+C7aIcxPgfGtvFVDliTIvADS9T6fRGGuWa9/MAVQLBT+phDku7Is/QC4gAjr4GEdSnpAseMy7vrfhFYPaGNIcHH+2Nied0xOTdzveT6WLVsB13WhtT6Nc/Zta/GYUtkxmVLvQNTa4VSnUDnhdCRL12L5Mw9CczGvwLIMxLZYa7eBaARGXy2SsAohoRyvHbIC7YbFxyxwBwhvJ+BzgF0OtI18rrDap5jFJ0B0J4isEPwjRGxKaQ2lFThjn/U9/wqVpUubjSZcz3MA7AbR75MxDzgqQatWQyQcAIR8ofhB4uz6mempXu644CpFCQoMhMwLYLzcZzjnv6cyNcoYRojo/WQMYAwkDFwYZJmCEg6U6wPWfoOANYA9E8CC8Cz9b4B+C4Rn84XiKdu3bb18w+OPPZAHcOYFFyDf3Yc0jq4B4R/m3iU3sH9BsKMiiVFNMjhZAlYoo1gq3Vuv15dNTOw7kXMBIkKRE7iUyBhnbpD7FwICIuoWXNyOTH1RJi0wa2CEg1S6SIJiu1lGt2nic964+//5W7+2fR52SSbNBZw4xuKxF5FJF/bAphxo611NGaNPs9Z+JPD9Lxtj79ZzA4KI+gA8bI05m4DHldIf11q/PdZAkgHMWKfU2XlPmqT/bI3+MOMCWZa9JpfLPWGVehRKbciURjanpqKMGuro6HxbsVB4V7PRiNMk+ZTjUd4ahUZiYcudWH3Ka8C48Eul4veTOL45TdJPer6DaqVyru/7D3LPfcQAL1CSQqcZ4ij68NDQ0L2zlVnsHh1ZsWzR4kU7X95+RhTFWLpsOYIgD0qTThA2wJor5x+dEyFiAnUVwtTr6OgUx/pB/qLJickPBrkcivnCdUT0S244GCdUMoNYCzicLe5g/HaVJldzxm5PkxgZF+/t7e+/M4mTpcaYaaMyOPkAqTW/xYVY1Wo0VltjEQSeq6QAlcro2fsynH07kAXFtvhEe7B3AfiltfZcWPskETshdXMPM9ZWc5lregXAPK85nfv9EFCnteZ+wejKNE0xunsMWZqif2gR8qUiVJZtj6NoiVLZL+M4PtX1vBRAA9amlgiZG4BKDJ4xMFoj09mb8kGxp6Oz8/yw1XqAXBctFkAICWMMJHAFWbyYJsmbhODwAh9GG1je1t9KAWCeVNl+ziaA6iubjcAacxOAL+wbH/vLjo6Oe88465zBLMsqRsh2olQ7YvNzGHNl+3ptyeaMS4i0hYQJoBX6xOhMIUVHIZ8bMsaMOdJBvliE0gYSlnEhLknj5I+V0V9RqRJkLRLuArAgY8HiGG6rMUd0YFhY6ORw4LAaOlmL0C9hcOeT6KqMIQyKOCRwGAKwjPE7ibBuZGTkpsmJCQwMDmJwaAhJkowT0VrO+WcAqPrs7D+0Wk0U8gV4fg5EdAYsVJokH5ZSgnMOY/QGrfW9ZO2HtNYblFKIohDWGkjpSBBDluk3Oa73I88PhrTOnhJC+rCIevv6QZxBcHFemqS1qNX6pOACxhK01j8zxvzIkfL9RPRHqWpibGwU1uKhxcuWTQ32D5zrSHmWUuoxgCqe50IKgTka8G4AxwH0ONruh3caa7cLKVEoFKGNAYytc85Q6ug4Np/LtaQUFMfJPsY5iAilcgeKxkBKeWUUR0+Pj++9vaPcgc6uLihjbmFEH+ofHHh7lqqvGmtRmZkB4/xmLsRix3XHORdf3js28rkkicCYgFYKvb29KDsOsmx/eugEgCWc8yestYOtZmNjlqbwggBeELSZY4AionZ2DoOaZ3HY+XIwAAC7nRh7twV7hBhr5gL/MiVFi2g/UWSZsfbvORdusVR6wVp7HBGNAuDEGJRSyOakkaXjvEVIuS8MwzcYrW+Io+gBznm7NDNX0FojFeKsfD5/Rz6f25oq9c4wU08C2N8ih7GDlxdAz30ORWKBktUGSZLc6JeDd646au2brbHfajYbSJMUjLGXAXwcRI8CMIzYZZzxSQUNlstBaA3PDz6ttLohbYaVzq6eG6v16lXGArOzFXiOA2OMUlqf1dndfXuaphdXZ2evUiqdYL+qrt1hwOFjxgGIckVInWLJ7ueghcD+2O8BEBEJxnhHq9X86K6du+5p1GvoHxiYI2mQVkrVGGPXWWs+Uijmf9bRWUKWKKRJBiJMW8fpcDyPM0aaMQYpJaSUS+q12gP1Wg35QgE9Pb1z9Ea2Og5bn07S5DICfdgP6K+I8TVh2DzFGvswonb5aS7EZBDkuuIkQT4vITiH77ngjC1WWj/CiCClA8fzkcQx4jC6aemy5d+O4mhmplp5d/fgIFxHwnc8qLYRDQDYBqJL5zpgup3swuD7PgjUo42lKAo/3tXV9WWtlA3D8BOcy+NarVafMWbCdRyI9kQ2TowG8/k8yuUSwjDC6PBuLF+xoq9YLOwzxmB6ahr7xsfR1dVFHV1dH43C8FY/8J/s7esna8xn5wo6zNWNP4ht5RERKaVu0Fq/zfdzX3Uc9/c555BCtPPgM5XLsqzSro5iKo7j5ISQgLVIdXvnBKJFVpvHNNk/YJxnHR2dLQJghIBSCgT4gjE3isJ3a6UfKxSLW5TWewhocsbQDENUpmfABUdXb8//4Fwsslbtcnz/DGvMiUkcb3JcF34hD2sNpXE6qq09XSXJh7kQDzmMr7XWjv6HSaD/MZid46R39/SAgfp3vLx9PI5ilMpllAolKK0WAXgWRG8FYCxhWsGiUasjjiJ4vgcm+J9Ixn4S+EElUeqKeq1+FayF7wXI50sw1jhh2HwkjsJFruvfXe7q+plW+piFJJ3/ahw2Ck7qBpDNOo556kcotKpI3Bxepdt9ACUQ3qONvifLEgwODWFw0SIkSQIAi7kQu9IkuYJx/jGVpstrMxXUqlUkcQpj8BwRbZBSvsS46CMiwYh9SSm1mlznC/muTrhBMEdeovWc81MY8MmcH/QVisUzpmemPqeybI3n++dI34Ub+MgV8nA99wkLs9l13efBWA8RuUTs69bafrLmK9ZoeI6LVavX4NjjjkdPb+8tqVaLms2m36xUNjZnZxA3GmjrZwIAcgBKxpqKsaZurbEEC6000iRFmqYXMMJ66cjPWGteq405I0vTv2GE9YKzcxkBRuv2Spcm35Vc6q7unnu4EPk0TYrljo5/18bMvPzyju/v3LETWZaht68XuVz+b7kQ9wshNnPOR+IkXT41M4tKtY6Z2QqSJAXnB60ieWutC2L/xjmPuOCvC3I5cMGxb+84hnftRhzHiRDiT+MwYkKIjyRxHI8OD2NiYgJmbvIAqATYwFo9bawJqS1pAzrQHwFjtMZYg3q9droxJuKMnQdg2ti5yZYzuJ53QS6XP04I+XVOvGC0/gXn/Cue44IRYWrfBKb2TTDB+SYh+OuVym4mgic4BZITBCcI9irLC1AAUD7oL+2G5RjREGP8aGPM00mS7DZK/Qgw7SpV7e8UARSMNbPGmkZmLCXGINUKaZbCgG7gjIcMbKNSepisnRoaGPxyb3c3yuUSNAy4K5ZJ192VJIkLwm2CiyHXlXAc8St9DgcO24r+2pceRaFZQS6sIs6V5rdsh0JZa7dqrXt9Pxg58aST4fsetFIwWgGgquNIZo2+PY2TNzDu3BhF9bdJ10F3bw9yuTyazdoFZHEX4+xHACkAbrVSOU0WC1NOEMC1bQoj52JtHEebwrCJQq7w9ZmZmce1yiCF2JIZXVQqAyOC53rtgg2t8PVBkPs+CA9YY5R0HAHCaYLzunQchM0WXnxuE6yxyLIUA0NDX+vv799C6AVgwbmEtvs3tJsswAj007k+fp8lbGJz6iJCykWtMHw2jkKUS+WPK6MNEwJciOfDKBqYnZ2BFBK9Pb1wHSczRr+Wkbg7y9RDhXwevX199empyTNHh4etdBwcddRaeJ4HC3wHwPeCILc5SZLtSdi6VhBAVoOsgbWvSN8cAzDDGW3kXKrZ6ZnfC6MQQggILuA4EkardxB53/NzuacY59Jac5nrOuCCAzAgwwCLx4nxiwA8CFgLzt8KYJ/d3x+0Rynteq4P6mDQWq9njN1LREut1jtyuQC5nA/p+u+v1ar/yyj9yUK+BGOUL6R8th621sRh9JLrOHC9QFttvgvObs3lC1Gz1fyzerWyjQvR3rVwhs7O7nYU4gDPfw8WLmr78yXoF8TY7wBYZ4zZE8XR2wrF4tyuiyHLMhDRBgB/MPcuuYC90gI7y6UyUCxJ6Ti/q7LsXYLJe+v1OurN6k8Hhxb9HZeOZ62J9+3biyiKdvR0dT9Y6ux8Lk1iq7W+ggl+uPJVfiUcNq/7ERzBEfz3xeFnzx/BERzBfzscMfQjOILfABwx9CM4gt8AHDH0IziC3wAcMfQjOILfABwx9CM4gt8A/B880/BJ4KbZHQAAAABJRU5ErkJggg==";
      doc.addImage(img, "PNG", 14, 5, 40, 25, "left");
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.setFontSize(10);
      doc.text("Fecha: " + moment().format("dddd, Do MMMM YYYY"), 14, 35);

      var columnas = [
        { title: "Correo", dataKey: "correo" },
        { title: "Nombres", dataKey: "nombres" },
        { title: "Apellidos", dataKey: "apellidos" },
        { title: "Cedula", dataKey: "cedula" },
        { title: "Dirección", dataKey: "direccion" },
        { title: "Ocupación", dataKey: "ocupacion" },
      ];
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.text("Voluntarios", 14, 69);
      doc.autoTable({
        body: this.voluntarios,
        columns: columnas,
        styles: {
          halign: "center",
          fontSize: 10,
        },
        bodyStyles: {
          minCellHeight: 7,
        },
        startY: 70,
      });
      var finalY = doc.previousAutoTable.finalY;
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setFontStyle("normal");
      doc.text("Jornadas", 14, finalY + 14);

      doc.autoTable({
        html: "#tab_jornadasvol",
        styles: {
          halign: "center",
          fontSize: 10,
        },
        bodyStyles: {
          minCellHeight: 7,
        },
        startY: finalY + 15,
        tableWidth: "wrap",
      });
      doc.save("voluntarios.pdf");
    },
  },
};
</script>

<style lang="scss" scoped></style>
