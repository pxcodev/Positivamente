<template>
  <div>
    <v-sheet
      :elevation="elevation"
      v-if="$store.state.DataUserStore.nivel != 3"
    >
      <span
        ><h1 class="text-center display-1 mt-5">
          Bienvenidos al panel de control Positivamente
        </h1></span
      >
      <p class="text-center my-5" v-if="$store.state.DataUserStore.nivel == 1">
        Aqui podras gestionar proyectos, jornadas, usuarios, noticias, entre
        otras actividades, ademas de visualizar el cronograma de jornadas.
      </p>
      <p class="text-center my-5" v-if="$store.state.DataUserStore.nivel == 2">
        Aqui podras gestionar jornadas, noticias y visualizar el cronograma de
        jornadas.
      </p>
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="4" v-for="(item, i) in stats" :key="i"
            ><v-card :color="item.color" dark>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title
                    class="headline"
                    v-text="item.titulo"
                  ></v-card-title>
                  <v-card-subtitle class="mt-5 text-center headline">
                    <h1>{{ item.contenido }}</h1>
                  </v-card-subtitle>
                </div>
                <v-avatar class="ma-3" size="125" tile>
                  <v-img :src="item.src"></v-img>
                </v-avatar>
              </div> </v-card
          ></v-col>
        </v-row>
      </v-container>
      <v-container class="ocultar">
        <v-row>
          <v-col cols="8" class="mx-auto"
            ><canvas id="jornadas"></canvas
          ></v-col>
          <v-col cols="8" class="mx-auto"
            ><canvas id="voluntarios"></canvas
          ></v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet
      :elevation="elevation"
      v-if="$store.state.DataUserStore.nivel == 3"
    >
      <span
        ><h1 class="text-center display-1 mt-5">
          Bienvenidos al panel de control Positivamente
        </h1></span
      >
      <p class="text-center my-5">
        Aqui podra visualizar jornadas activas, participar en ellas, entre otras
        actividades.
      </p>
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="6" v-for="(item, i) in statsvol" :key="i"
            ><v-card :color="item.color" dark>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title
                    class="headline"
                    v-text="item.titulo"
                  ></v-card-title>
                  <v-card-subtitle class="mt-5 text-center headline">
                    <h1>{{ item.contenido }}</h1>
                  </v-card-subtitle>
                </div>
                <v-avatar class="ma-3" size="125" tile>
                  <v-img :src="item.src"></v-img>
                </v-avatar>
              </div> </v-card
          ></v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
import Chart from "chart.js";
import moment from "moment";
export default {
  data() {
    return {
      stats: [],
      statsvol: [],
      jornadas: [],
      voluntarios: [],
      numJornadasMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      numAsistenciasMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      numInasistenciasMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      numVoluntariosMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  },
  components: {},
  mounted() {
    if (this.$store.state.DataUserStore.nivel != 3) {
      // Proyectos
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/proyectos" })
        .then((resp) => {
          this.stats.push({
            color: "#0096B1",
            src: require("@/assets/imagenes/InicioPanel/project.png"),
            titulo: "Proyectos",
            contenido: resp.length,
          });
        })
        .catch((error) => {});
      // Jornadas
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/jornadas" })
        .then((resp) => {
          this.stats.push({
            color: "#0096B1",
            src: require("@/assets/imagenes/InicioPanel/interest.png"),
            titulo: "Jornadas",
            contenido: resp.length,
          });
        })
        .catch((error) => {});
      // voluntarios
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/voluntarios" })
        .then((resp) => {
          for (let i = 0; i < resp.length; i++) {
            var mes = resp[i].fechareg.split("T")[0].split("-")[1];
            this.numVoluntariosMes[Number(mes) - 1] += 1;
          }
          const ctx = document.getElementById("voluntarios");
          const myChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: moment.monthsShort(),
              datasets: [
                {
                  // one line graph
                  label: "Registro de Voluntarios",
                  data: this.numVoluntariosMes,
                  backgroundColor: [
                    "rgba(231, 109, 206,.5)", // Blue
                    "rgba(83, 230, 255,.5)",
                    "rgba(13, 188, 121,.5)",
                    "rgba(231, 109, 206,.5)",
                    "rgba(231, 109, 206,.5)",
                    "rgba(231, 109, 206,.5)",
                  ],
                  borderColor: ["#0096B1"],
                  borderWidth: 3,
                },
              ],
            },
            options: {
              responsive: true,
              lineTension: 1,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      padding: 25,
                    },
                  },
                ],
              },
            },
          });
          this.stats.push({
            color: "#0096B1",
            src: require("@/assets/imagenes/InicioPanel/volunteer.png"),
            titulo: "Voluntarios",
            contenido: resp.length,
          });
        })
        .catch((error) => {});
      // Jornadas por fecha
      this.$store
        .dispatch("GeneralPost", {
          Datos: {
            fechaInicial: "2020-01-01",
            fechaFinal: "2020-12-31",
            id_p: 0,
            asistencia: -1,
          },
          EndPoint: "/fechjornadas",
        })
        .then((res) => {
          this.jornadas = res.jornadas;
          for (let i = 0; i < res.jornadas.length; i++) {
            var mes = res.jornadas[i].fecha.split("-")[1];
            this.numJornadasMes[Number(mes) - 1] += 1;
            for (let j = 0; j < res.jornadas[i].voluntarios.length; j++) {
              var asis = res.jornadas[i].voluntarios[j].asistencia;
              if (asis == 1) {
                this.numAsistenciasMes[Number(mes) - 1] += 1;
              } else {
                if (res.jornadas[i].estado == "Finalizada") {
                  this.numInasistenciasMes[Number(mes) - 1] += 1;
                }
              }
            }
          }
          const ctx = document.getElementById("jornadas");
          const myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: moment.monthsShort(),
              datasets: [
                {
                  // one line graph
                  label: "Jornadas",
                  data: this.numJornadasMes,
                  backgroundColor: ["rgba(54,73,93,.5)"],
                  borderColor: ["#36495d"],
                  borderWidth: 3,
                },
                {
                  // another line graph
                  label: "Asistencias",
                  data: this.numAsistenciasMes,
                  backgroundColor: [
                    "rgba(71, 183,132,.5)", // Green
                  ],
                  borderColor: ["#47b784"],
                  borderWidth: 3,
                },
                {
                  // another line graph
                  label: "Inasistencias",
                  data: this.numInasistenciasMes,
                  backgroundColor: [
                    "rgba(41, 184, 219,.5)", // Green
                  ],
                  borderColor: ["#386AF7"],
                  borderWidth: 3,
                },
              ],
            },
            options: {
              responsive: true,
              lineTension: 1,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      padding: 25,
                    },
                  },
                ],
              },
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/jornadas" })
        .then((resp) => {
          this.statsvol.push({
            color: "#0096B1",
            src: require("@/assets/imagenes/InicioPanel/interest.png"),
            titulo: "Jornadas",
            contenido: resp.length,
          });
        })
        .catch((error) => {});
      this.$store
        .dispatch("GeneralGet", { EndPoint: "/voluntarios" })
        .then((resp) => {
          var asistencias = 0;
          var inasistencias = 0;
          var inscripciones = 0;
          for (let i = 0; i < resp.length; i++) {
            if (resp[i].correo == this.$store.state.DataUserStore.correo) {
              for (let j = 0; j < resp[i].jornadas.length; j++) {
                inscripciones = resp[i].jornadas.length;
                if (resp[i].jornadas[j].asistencia == 1) {
                  asistencias += 1;
                } else {
                  if (resp[i].jornadas[j].estado == "Finalizada") {
                    inasistencias += 1;
                  }
                }
              }
            }
          }
          this.statsvol.push({
            color: "#0096B1",
            src: require("@/assets/imagenes/InicioPanel/volunteer.png"),
            titulo: "Inscripciones",
            contenido: inscripciones,
          });
          this.statsvol.push({
            color: "#0096B1",
            src: require("@/assets/imagenes/InicioPanel/handyes.png"),
            titulo: "Asistencias",
            contenido: asistencias,
          });
          this.statsvol.push({
            color: "#0096B1",
            src: require("@/assets/imagenes/InicioPanel/handnot.png"),
            titulo: "Inasistencias",
            contenido: inasistencias,
          });
        })
        .catch((error) => {});
    }
  },
};
</script>

<style scoped>
/* Extra large devices */
@media screen and (max-width: 2559px) {
}

/* Large devices (desktops, less than 1920) */
@media (max-width: 1920px) {
}

/* Large devices (desktops, less than 1920) */
@media (max-width: 1600px) {
}

/* Large devices (desktops, less than 1200px) */
@media (max-width: 1199.98px) {
}

/* Medium devices (tablets, less than 992px) */
@media (max-width: 991.98px) {
}

/* Small devices (landscape phones, less than 768px) */
@media (max-width: 634px) {
  .ocultar {
    display: none;
  }
}
</style>
