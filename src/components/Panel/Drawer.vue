<template>
  <v-navigation-drawer
    id="app-drawer"
    :expand-on-hover="drawer"
    mobile-break-point="960"
    :value="drawerOn"
    dark
    app
    src="@/assets/imagenes/panel.jpg"
    @transitionend="test($event)"
  >
    <!-- permanent: el drawer es visible independientemente del tamaño de la pantalla 
       temporary: gestionar el drawer con un boton a traves del v-model(true:visible, false:oculto)  
       mobile-break-point: recibe un string o entero de la resolucion movil que se desea detectar
    value: gestiona la visibilidad del drawer y recibe true o false-->
    <!-- v-overlay__scrim -->
    <template v-slot:prepend>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              :src="DataUserStore.foto ? DataUserStore.foto : img_pred"
            ></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link two-line>
          <v-list-item-content v-if="DataUserStore">
            <v-list-item-title
              class="title names"
            >{{DataUserStore.nombres.split(" ")[0]}} {{DataUserStore.apellidos.split(" ")[0]}}</v-list-item-title>
            <v-list-item-subtitle>{{DataUserStore.correo}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
    <v-divider></v-divider>

    <v-list nav dense text--white>
      <v-list-item-group id="single-navigation-drawer" v-model="item" color="primary">
        <router-link to="/panel/inicio">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>fab fa-microsoft</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Panel de control</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link to="/panel/noticias" v-if="DataUserStore.nivel != 3">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>$newpaper</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Noticias</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link to="/panel/proyectos" v-if="DataUserStore.nivel == 1">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>$projects</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Proyectos</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link to="/panel/jornadas" v-if="DataUserStore.nivel != 3">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>$act</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Jornadas</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link to="/panel/cronograma">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>$calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cronograma</v-list-item-title>
          </v-list-item>
        </router-link>
        <!-- <router-link to="/panel/mensajes" v-if="DataUserStore.nivel == 2">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>$sms</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Mensajes</v-list-item-title>
          </v-list-item>
        </router-link> -->
        <router-link to="/panel/reportes" v-if="DataUserStore.nivel == 1">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>$clipboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Reportes</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link to="/panel/jornadasvol" v-if="DataUserStore.nivel == 3">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>$act</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Jornadas Vol</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list-item-group>
      <router-link to="/panel/perfil" v-if="DataUserStore.nivel == 3">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>$user</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list-item-group>
      <v-list-group
        id="core-navigation-drawer"
        prepend-icon="fas fa-users"
        v-if="DataUserStore.nivel == 1"
      >
        <template v-slot:activator>
          <v-list-item-title>Usuarios</v-list-item-title>
        </template>

        <v-list-group no-action sub-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Gestores</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="(admin, i) in Gestores" :key="i" link :to="admin[2]">
            <v-list-item-title v-text="admin[0]"></v-list-item-title>
            <v-list-item-icon>
              <v-icon v-text="admin[1]"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action sub-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Voluntariado</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="(volunt, i) in Voluntariado" :key="i" link :to="volunt[2]">
            <v-list-item-title v-text="volunt[0]"></v-list-item-title>
            <v-list-item-icon>
              <v-icon v-text="volunt[1]"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  data: () => ({
    img_pred: require("@/assets/imagenes/perfil.png"),
    Users: ["Gestores", "Voluntariado"],
    Gestores: [["Administrar", "$users", "/panel/admgestores"]],
    Voluntariado: [["Administrar", "$users", "/panel/admvoluntarios"]],
    item: 0
  }),
  computed: { ...mapState(["drawer", "drawerOn", "DataUserStore"]) },
  methods: {
    ...mapMutations(["drawerState", "LoadData"]),
    test(e) {
      if (e.path[0].classList[1] == "v-navigation-drawer--close") {
        this.drawerState();
        // console.log("cerrando");
      } else {
        // console.log("abriendo");
      }
    }
  },
  mounted() {
    this.LoadData();
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: white;
}
.v-list .v-list-item--active {
  color: white !important;
}
.v-application .primary--text {
  color: #2697af !important;
  caret-color: #2697af !important;
}
#single-navigation-drawer .router-link-active .v-list-item--active {
  background-color: #0098b1 !important;
  border-color: #0098b1 !important;
}
</style>
