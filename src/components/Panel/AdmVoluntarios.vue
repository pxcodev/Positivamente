<template>
  <v-container fluid>
    <v-switch v-model="expand" label="Expandir uno"></v-switch>
    <v-data-iterator
      :items="voluntarios"
      :items-per-page="itemsPerPage"
      item-key="correo"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      :single-expand="expand"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="principal" class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="$search"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="$search"
              label="Ordenar por"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn
                large
                depressed
                color="principal"
                :value="false"
                content="Orden Ascendente"
                v-tippy
              >
                <v-icon>$arrow_up</v-icon>
              </v-btn>
              <v-btn
                large
                depressed
                color="principal"
                :value="true"
                content="Orden Descendente"
                v-tippy
              >
                <v-icon>$arrow_down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="{ items, isExpanded, expand }">
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.correo"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between mx-auto">
                <div>
                  <v-card-title
                    class="subheading font-weight-bold text-center"
                    style="padding-bottom: 0px;"
                    >{{ item.nombres.split(" ")[0] }}</v-card-title
                  >
                  <v-card-title
                    class="subheading font-weight-bold"
                    style="padding-top: 0px;"
                    >{{ item.apellidos.split(" ")[0] }}</v-card-title
                  >
                </div>

                <v-avatar class="ma-3" size="125" tile>
                  <v-img :src="item.foto ? item.foto : img_pred"></v-img>
                </v-avatar>
              </div>
              <v-row>
                <v-col
                  ><v-switch
                    :input-value="isExpanded(item)"
                    :label="isExpanded(item) ? 'Expandido' : 'Cerrado'"
                    class="pl-4 mt-0"
                    @change="(v) => expand(item, v)"
                  ></v-switch
                ></v-col>
                <v-col>
                  <v-switch
                    :input-value="item.estado == 'Habilitado' ? true : false"
                    :label="item.estado"
                    class="pl-4 mt-0"
                    @change="(v) => cambiarEstado(item, v)"
                  ></v-switch>
                </v-col>
              </v-row>

              <v-divider></v-divider>
              <v-scroll-y-transition>
                <v-list dense v-if="isExpanded(item)">
                  <v-list-item
                    v-for="(key, index) in filteredKeys"
                    :key="index"
                  >
                    <v-list-item-content
                      :class="{ 'blue--text': sortBy === key }"
                      >{{ key }}:</v-list-item-content
                    >
                    <v-list-item-content
                      class="align-end"
                      :class="{ 'blue--text': sortBy === key }"
                      >{{
                        item[
                          key.toLowerCase() == "dirección"
                            ? "direccion"
                            : key.toLowerCase() == "ocupación"
                            ? "ocupacion"
                            : key.toLowerCase() == "telf. casa"
                            ? "tel_casa"
                            : key.toLowerCase() == "telf. movil"
                            ? "tel_movil"
                            : key.toLowerCase() == "telf. emergencia"
                            ? "tel_emergencia"
                            : key.toLowerCase() == "fech. registro"
                            ? "fechareg"
                            : key.toLowerCase()
                        ] == ""
                          ? "S / D"
                          : item[
                              key.toLowerCase() == "dirección"
                                ? "direccion"
                                : key.toLowerCase() == "ocupación"
                                ? "ocupacion"
                                : key.toLowerCase() == "telf. casa"
                                ? "tel_casa"
                                : key.toLowerCase() == "telf. movil"
                                ? "tel_movil"
                                : key.toLowerCase() == "telf. emergencia"
                                ? "tel_emergencia"
                                : key.toLowerCase() == "fech. registro"
                                ? "fechareg"
                                : key.toLowerCase() == "estado"
                                ? "estado"
                                : key.toLowerCase()
                            ]
                      }}</v-list-item-content
                    >
                  </v-list-item>
                </v-list>
              </v-scroll-y-transition>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Voluntarios por pag</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn dark text color="principal" class="ml-2" v-on="on">
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
            >Pagina {{ page }} de {{ numberOfPages }}</span
          >
          <v-btn
            fab
            dark
            color="principal darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>$angle_left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="principal darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>$angle_right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      cancel: false,
      img_pred: require("@/assets/imagenes/perfil.png"),
      expand: false,
      itemsPerPageArray: [4, 8, 12],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "nombres",
      keys: [
        "Correo",
        "Nombres",
        "Apellidos",
        "Cedula",
        "Edad",
        "Dirección",
        "Ocupación",
        "Telf. Casa",
        "Telf. Movil",
        "Telf. Emergencia",
        "Habilidades",
        "Disponibilidad",
        "Idiomas",
        "Fech. Registro",
        "Estado",
      ],
      voluntarios: [],
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.voluntarios.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== `Name`);
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    cambiarEstado(item) {
      var estadoactual =
        item.estado == "Habilitado" ? "Deshabilitado" : "Habilitado";
      var editedIndex = this.voluntarios.indexOf(item);
      this.$store
        .dispatch("GeneralPost", {
          EndPoint: "/estadovoluntario",
          Datos: { correo: item.correo, estado: item.estado },
        })
        .then((res) => {
          var vol = item;
          vol.estado = res.datos.estado;
          Object.assign(this.voluntarios[editedIndex], vol);
          this.$swal.fire(
            res.datos.estado + "!",
            `El voluntario ha sido ${res.datos.estado}.`,
            "success"
          );
        })
        .catch((e) => {
          console.log(e);
        });
      // this.$swal
      //   .fire({
      //     title: "Estas seguro de esto?",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonColor: "#3085d6",
      //     cancelButtonColor: "#d33",
      //     confirmButtonText: `Si, ${estadoactual} ya!`,
      //   })
      //   .then((result) => {
      //     if (result.value) {

      //     } else {
      //       var elem = this.$els.est;
      //       elem.click();
      //     }
      //   });
    },
  },
  mounted() {
    this.$store
      .dispatch("GeneralGet", { EndPoint: "/voluntarios" })
      .then((res) => {
        this.voluntarios = res;
        for (let i = 0; i < this.voluntarios.length; i++) {
          this.voluntarios[i].bool = false;
          this.voluntarios[i].fechareg = this.$store.getters.FechaFormateada(
            this.voluntarios[i].fechareg
          );
        }
        console.log(this.voluntarios);
      })
      .catch((e) => {
        console.log(e);
      });
  },
  created() {
    if (this.$store.state.DataUserStore.nivel == 1) {
    } else {
      this.$router.push("/panel/inicio");
    }
  },
};
</script>

<style lang="scss" scoped></style>
