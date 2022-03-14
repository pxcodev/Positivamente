import Vue from "vue";
import VueRouter from "vue-router";
import goTo from "vuetify/es5/services/goto";
const jwt = require("jwt-simple");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/nosotros",
    name: "nosotros",
    component: () => import("../views/Nosotros.vue"),
  },
  {
    path: "/contacto",
    name: "contacto",
    component: () => import("../views/Contacto.vue"),
  },
  {
    path: "/noticias",
    name: "noticias",
    component: () => import("../views/Noticias.vue"),
  },
  {
    path: "/voluntariado",
    name: "voluntariado",
    component: () => import("../views/Voluntariado.vue"),
  },
  {
    path: "/noticia/:id",
    name: "noticia",
    component: () => import("../views/Noticia.vue"),
  },
  {
    path: "/proyecto/:id",
    name: "proyecto",
    component: () => import("../views/Proyecto.vue"),
  },
  {
    path: "/registro/:token",
    name: "registro",
    component: () => import("../views/Registro.vue"),
  },
  {
    path: "/recuperacion/:token",
    name: "recuperacion",
    component: () => import("../views/Recuperacion.vue"),
  },
  {
    path: "/error/:err",
    name: "error",
    component: () => import("../views/Error.vue"),
  },
  {
    path: "/panel",
    name: "panel",
    redirect: {
      name: "pinicio",
    },
    component: () => import("../views/Panel.vue"),
    children: [
      {
        path: "/panel/inicio",
        name: "pinicio",
        component: () => import("../components/Panel/Inicio.vue"),
      },
      {
        path: "/panel/noticias",
        name: "pnoticias",
        component: () => import("../components/Panel/Noticias.vue"),
      },
      {
        path: "/panel/proyectos",
        name: "proyectos",
        component: () => import("../components/Panel/Proyectos.vue"),
      },
      {
        path: "/panel/perfil",
        name: "perfil",
        component: () => import("../components/Panel/Perfil.vue"),
      },
      {
        path: "/panel/jornadas",
        name: "jornadas",
        component: () => import("../components/Panel/Jornadas.vue"),
      },
      {
        path: "/panel/jornadasvol",
        name: "jornadasvol",
        component: () => import("../components/Panel/JornVoluntario.vue"),
      },
      {
        path: "/panel/admgestores",
        name: "admgestores",
        component: () => import("../components/Panel/AdmGestores.vue"),
      },
      {
        path: "/panel/admvoluntarios",
        name: "admvoluntarios",
        component: () => import("../components/Panel/AdmVoluntarios.vue"),
      },
      {
        path: "/panel/cronograma",
        name: "cronograma",
        component: () => import("../components/Panel/Cronograma.vue"),
      },
      {
        path: "/panel/reportes",
        name: "reportes",
        component: () => import("../components/Panel/Reportes.vue"),
      },
      {
        path: "/panel/mensajes",
        name: "mensajes",
        component: () => import("../components/Panel/Mensajes.vue"),
      },
    ],
  },
  {
    path: "*",
    redirect: "/error/Pagina no encontrada",
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const PaginasPublicas = [
    "home",
    "nosotros",
    "contacto",
    "noticias",
    "noticia",
    "registro",
    "recuperacion",
    "voluntariado",
    "error",
    "proyecto",
  ];
  const authRequerida = !PaginasPublicas.includes(to.name);
  // const loggedIn = localStorage.getItem('DataUser') ? DecodificarToken(JSON.parse(localStorage.getItem('DataUser')).token) : false;
  const loggedIn = localStorage.getItem("DataUser");
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequerida && !loggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router;
