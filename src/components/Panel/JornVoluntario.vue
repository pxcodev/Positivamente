<template>
  <v-data-table
    :headers="headers"
    :items="jornadas"
    sort-by="calories"
    class="elevation-1"
  >
    <!-- Tabla header inscripcion -->
    <template v-slot:item.inscripcion="{ item }">
      <v-chip :color="getColorIns(item.inscripcion)" dark>{{
        item.inscripcion
      }}</v-chip>
    </template>
    <!-- Tabla header Estado -->
    <template v-slot:item.estado="{ item }">
      <v-chip :color="getColorEst(item.estado)" dark>{{ item.estado }}</v-chip>
    </template>
    <!-- Tabla header fecha -->
    <template v-slot:item.fecha="{ item }">
      <v-chip light>{{ $store.getters.FechaFormateada(item.fecha) }}</v-chip>
    </template>
    <!-- Tabla header hora -->
    <template v-slot:item.hora="{ item }">
      <v-chip light>{{ $store.getters.HoraFormateada(item.hora) }}</v-chip>
    </template>
    <!-- Tabla -->
    <template v-slot:top>
      <v-toolbar flat color="white">
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
                    content="Cupos disponibles"
                    v-tippy
                    outlined
                  >
                    <v-icon left>$users</v-icon>
                    {{ editedItem.cuposrest }}
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
                    content="Inscripción"
                    v-tippy
                    :color="getColorIns(editedItem.inscripcion)"
                    outlined
                  >
                    <v-icon left>$user</v-icon>
                    {{ editedItem.inscripcion }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="
                  editedItem.inscripcion != 'Inscrito' &&
                    editedItem.cuposrest > 0 &&
                    editedItem.estado == 'Activa'
                "
                class="ma-2"
                @click="participar"
                tile
                outlined
                color="success"
              >
                <v-icon left>$hand</v-icon>Participar
              </v-btn>
              <v-btn
                v-if="
                  editedItem.inscripcion == 'Inscrito' &&
                    editedItem.estado != 'Finalizada'
                "
                class="ma-2"
                @click="CancelParticipacion"
                tile
                outlined
                color="warning"
              >
                <v-icon left>$user_cancel</v-icon>No quiero participar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-toolbar-title>jornadas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <!-- Acciones -->
    <template v-slot:item.action="{ item }">
      <v-icon
        content="Visualizar"
        v-tippy
        color="principal"
        small
        @click="VisualizarAct(item)"
        >$eye</v-icon
      >
    </template>
    <!-- Template no se encontro informacion -->
    <template v-slot:no-data>
      <h1>No se encontraron jornadas</h1>
    </template>
  </v-data-table>
</template>

<script>
import { tippy } from "vue-tippy";
import moment from "moment";
moment.locale("es");
export default {
  data: () => ({
    estados: ["Activa", "En Proceso", "Cancelada"],
    mindate: moment(new Date())
      .add(1, "days")
      .format("YYYY-MM-DD"),
    Datepicker: false,
    HoraPicker: false,
    BaseUrlApi: process.env.VUE_APP_RUTA_API,
    Imgselected: null,
    ImgselectedUrl: null,
    dialog: false,
    dialogAct: false,
    headers: [
      { text: "Titulo", value: "titulo" },
      { text: "Fecha", value: "fecha" },
      { text: "Hora", value: "hora" },
      { text: "Cupos", value: "cuposrest" },
      { text: "Ubicación", value: "ubicacion" },
      { text: "Inscripción", value: "inscripcion" },
      { text: "Estado", value: "estado" },
      { text: "Acciones", value: "action", sortable: false }
    ],
    proyectos: [],
    jornadas: [],
    actaux: [],
    inscripciones: [],
    editedIndex: -1,
    editedItem: {
      titulo: "",
      descripcion: "",
      fecha: moment()
        .add(1, "days")
        .format("YYYY-MM-DD"),
      hora: null,
      ubicacion: "",
      cupos: 0,
      proyecto: { nombre: "", id: "" }
    },
    defaultItem: {
      titulo: "",
      descripcion: "",
      fecha: moment()
        .add(1, "days")
        .format("YYYY-MM-DD"),
      hora: null,
      ubicacion: "",
      cupos: 0,
      proyecto: { nombre: "", id: "" }
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva jornada" : "Editar jornada";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {},
  sockets: {
    connect() {
      console.log("socket conectado");
    },
    ActsIniciales(val) {
      console.log(val);
      this.actaux = val;
      this.$socket.client.emit("InsVoluntario", {
        nivel: this.$store.state.DataUserStore.nivel,
        correo: this.$store.state.DataUserStore.correo
      });
    },
    NuevaAct(val) {
      this.jornadas.push(val);
    },
    VerAct(val) {
      this.editedItem = Object.assign({}, val);
      this.$socket.client.emit("InsVoluntario", {
        nivel: this.$store.state.DataUserStore.nivel,
        correo: this.$store.state.DataUserStore.correo
      });
    },
    InsVoluntario(val) {
      val.forEach(element => {
        var foundIndex = this.actaux.findIndex(acts => acts.id == element.id);
        Object.assign(this.actaux[foundIndex], element);
      });
      this.jornadas = this.actaux;
      var foundIndex = this.jornadas.findIndex(
        acts => acts.id == this.editedItem.id
      );
      this.editedItem = Object.assign({}, this.jornadas[foundIndex]);
    },
    EditarAct(val) {
      this.actaux = val;
      this.$socket.client.emit("InsVoluntario", {
        nivel: this.$store.state.DataUserStore.nivel,
        correo: this.$store.state.DataUserStore.correo
      });
    },
    ParticiparAct(val) {
      this.editedItem.cuposrest -= 1;
      this.editedItem.inscripcion = "No Inscrito";
      this.$socket.client.emit("EditarAct", {
        jornada: this.editedItem
      });
    },
    CancelParticiparAct(val) {
      this.editedItem.cuposrest += 1;
      this.editedItem.inscripcion = "No Inscrito";
      this.$socket.client.emit("EditarAct", {
        jornada: this.editedItem
      });
    }
  },
  mounted() {
    this.$store
      .dispatch("GeneralGet", { EndPoint: "/proyectos" })
      .then(resp => {
        resp.forEach(element => {
          this.proyectos.push({ nombre: element.titulo, id: element.id });
        });
      });
    this.$socket.client.emit("ActsIniciales");

    this.$socket.client.emit("InsVoluntario", {
      nivel: this.$store.state.DataUserStore.nivel,
      correo: this.$store.state.DataUserStore.correo
    });
  },
  methods: {
    participar() {
      var no = false;
      // console.log(this.jornadas);
      this.jornadas.forEach(jornada => {
        if (
          this.editedItem.fecha == jornada.fecha &&
          jornada.inscripcion == "Inscrito"
        ) {
          no = true;
        }
      });
      if (no) {
        this.$swal.fire({
          icon: "warning",
          title: "¡Espera! No eres un pulpo",
          text: "No puedes participar en otra jornada el mismo dia"
        });
      } else {
        this.$socket.client.emit("ParticiparAct", {
          id: this.editedItem.id,
          correo: this.$store.state.DataUserStore.correo
        });
      }
    },
    CancelParticipacion() {
      this.$socket.client.emit("CancelParticiparAct", {
        id: this.editedItem.id,
        correo: this.$store.state.DataUserStore.correo
      });
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
    VisualizarAct(item) {
      this.$socket.client.emit("VerAct", { jornada: item });
      this.dialogAct = true;
    },
    close() {
      this.dialogAct = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  }
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
