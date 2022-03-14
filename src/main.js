import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueSweetalert2 from "vue-sweetalert2";
import axios from "axios";
import VueAxios from "vue-axios";
import IdleVue from "idle-vue";
import VueTippy, { TippyComponent } from "vue-tippy";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
import wysiwyg from "vue-wysiwyg";

window.$ = require("jquery");
window.JQuery = require("jquery");

const socket = io(process.env.VUE_APP_RUTA_API);
Vue.use(VueSocketIOExt, socket);
Vue.use(require("vue-moment"));
Vue.use(wysiwyg, {
  // { [module]: boolean (set true to hide) }
  hideModules: { image: true, code: true },
  // you can override icons too, if desired
  // just keep in mind that you may need custom styles in your application to get everything to align

  // limit content height if you wish. If not set, editor size will grow with content.
  maxHeight: "500px",

  // set to 'true' this will insert plain text without styling when you paste something into the editor.
  forcePlainTextOnPaste: true,

  // specify editor locale, if you don't specify this, the editor will default to english.
  locale: "spanish",
  locale_shorthand: "es",
}); // config is optional. more below
// import 'roboto-fontface/css/roboto/roboto-fontface.css'
import "@fortawesome/fontawesome-free/css/all.css";
import "sweetalert2/dist/sweetalert2.min.css";
require("dotenv").config();

const ignoreWarnMessage =
  "The .native modifier for v-on is only valid on components but it was used on <div>.";
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
};

Vue.use(VueTippy, {
  directive: "tippy", // => v-tippy
  flipDuration: 0,
  popperOptions: {
    modifiers: {
      preventOverflow: {
        enabled: true,
      },
    },
  },
});

Vue.directive("capitalize", function (el, binding) {
  el.querySelectorAll("input")[0].addEventListener("input", function () {
    // this.value = el.querySelectorAll("input")[0].value.toUpperCase();
    let test = el.querySelectorAll("input")[0].value;
    // primer letra de cada palabra
    // test.split(' ')
    //   .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    //   .join(' ')
    //  primer letra de la oracion
    // str.charAt(0).toUpperCase() + str.slice(1)
    try {
      this.value = test
        .split(" ")
        .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(" ");
    } catch (error) {
      console.log(error.message);
    }
  });
});

Vue.directive("upfirstletter", function (el, binding) {
  el.querySelectorAll("input")[0].addEventListener("input", function () {
    // this.value = el.querySelectorAll("input")[0].value.toUpperCase();
    let test = el.querySelectorAll("input")[0].value;
    // primer letra de cada palabra
    // test.split(' ')
    //   .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    //   .join(' ')
    //  primer letra de la oracion
    // str.charAt(0).toUpperCase() + str.slice(1)
    try {
      this.value = test.charAt(0).toUpperCase() + test.slice(1);
    } catch (error) {
      console.log(error.message);
    }
  });
});

Vue.directive("focus", {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    let childData = el.querySelectorAll("input")[0];
    childData.focus();
  },
});

Vue.component("tippy", TippyComponent);
const eventsHub = new Vue();
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 600000, //600000 10 minutos para detectar inactividad
});
Vue.use(require("vue-moment"));
Vue.use(VueAxios, axios);
Vue.use(Vuex);
Vue.use(VueSweetalert2);
Vue.config.productionTip = false;
// console.log(process.env.VUE_APP_RUTA_API)
axios.defaults.baseURL = process.env.VUE_APP_RUTA_API + "/api";

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
