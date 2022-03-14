import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import moment from "moment";

moment.locale("es");
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: false,
    drawerOn: false,
    windowWidth: 0,
    DataUserStore: JSON.parse(localStorage.getItem("DataUser")) || false,
    DataUserMedStore: JSON.parse(localStorage.getItem("DataUserMed")) || false,
    loaderpp: false,
  },
  mutations: {
    drawerState(state) {
      window.addEventListener("resize", () => {
        state.windowWidth = window.innerWidth;
      });
      if (state.windowWidth > 959) {
        state.drawer = !state.drawer;
      } else {
        state.drawer = false;
        state.drawerOn = !state.drawerOn;
      }
    },
    LoadData(state) {
      state.DataUserStore = JSON.parse(localStorage.getItem("DataUser"));
      state.DataUserMedStore = JSON.parse(localStorage.getItem("DataUserMed"));
    },
  },
  actions: {
    SubirArchivo({ commit }, Data) {
      return new Promise((resolve, reject) => {
        // commit("auth_success", { user: user, token: token, pass: pass }); llamado a una mutacion
        axios
          .post(
            `/subir/${Data.carpeta}/${Date.now() + "-" + Data.titulo}`,
            Data.formData
          )
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e.response);
          });
      });
    },
    SubirArchivos({ commit }, Data) {
      return new Promise((resolve, reject) => {
        var ruta = "";
        console.log(Data);
        // if (Data.imgedit.length > 0) {
        //   ruta = `/subirmultiple/${Data.carpeta}/${Data.subcarpeta}/${Data.id_jornada}/${Data.imgedit}`;
        // } else {
        //   ruta = `/subirmultiple/${Data.carpeta}/${Date.now() +
        //     "-" +
        //     Data.subcarpeta}/${Data.id_jornada}/${undefined}`;
        // }
        if (!Data.imgedit.length > 0) {
          Data.imgedit = undefined;
        }
        ruta = `/subirmultiple/${Data.carpeta}/${Data.subcarpeta}/${Data.id_jornada}/${Data.imgedit}`;
        axios
          .post(ruta, Data.formData)
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      });
    },
    EditarArchivo({ commit }, Data) {
      return new Promise((resolve, reject) => {
        // commit("auth_success", { user: user, token: token, pass: pass }); llamado a una mutacion
        axios
          .post(
            `/editarimg/${Data.carpeta}/${Data.subcarpeta}/${Data.imgvieja}`,
            Data.formData
          )
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e.response);
          });
      });
    },
    EliminarArchivo({ commit }, Data) {
      return new Promise((resolve, reject) => {
        // commit("auth_success", { user: user, token: token, pass: pass }); llamado a una mutacion
        axios
          .post(`/eliminarfolder/${Data.folder}/${Data.subfolder}`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e.response);
          });
      });
    },
    AgregarCrub({ commit }, Data) {
      return new Promise((resolve, reject) => {
        // commit("auth_success", { user: user, token: token, pass: pass }); llamado a una mutacion
        axios
          .post(Data.EndPoint, Data.Datos)
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e.response);
          });
      });
    },
    EditarCrub({ commit }, Data) {
      return new Promise((resolve, reject) => {
        // commit("auth_success", { user: user, token: token, pass: pass }); llamado a una mutacion
        axios
          .put(`${Data.EndPoint}${Data.Datos.id}`, Data.Datos)
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e.response);
          });
      });
    },
    EliminarCrub({ commit }, Data) {
      return new Promise((resolve, reject) => {
        // commit("auth_success", { user: user, token: token, pass: pass }); llamado a una mutacion
        axios
          .delete(`${Data.EndPoint}${Data.Datos}`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e.response);
          });
      });
    },
    GeneralGet({ commit }, Data) {
      return new Promise((resolve, reject) => {
        axios
          .get(Data.EndPoint)
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e.response);
          });
      });
    },
    GeneralPost({ commit }, Data) {
      return new Promise((resolve, reject) => {
        axios
          .post(Data.EndPoint, Data.Datos)
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            console.log(e.response);
          });
      });
    },
  },
  modules: {},
  getters: {
    count: (state) => {
      return state.count;
    },
    FechaFormateada: (state) => (fecha) => {
      return fecha ? moment(fecha).format("dddd, Do MMMM YYYY") : "";
    },
    FechaFormateadacorta: (state) => (fecha) => {
      return fecha ? moment(fecha).format("DD-MM-YYYY") : "";
    },
    QuitarHtml: (state) => (html) => {
      return html ? html.replace(/<[^>]*>?/g, "") : "";
    },
    HoraFormateada: (state) => (hora) => {
      return hora ? moment(hora, "h:mm:ss A").format("hh:mm:ss A") : "";
    },
    Toast: (state) => (tiempo) => {
      const Toast = Vue.swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: tiempo,
        timerProgressBar: true,
        background: "#C5F8FA",
        onOpen: (toast) => {
          toast.addEventListener("mouseenter", Vue.swal.stopTimer);
          toast.addEventListener("mouseleave", Vue.swal.resumeTimer);
        },
      });
      return Toast;
    },
  },
});
