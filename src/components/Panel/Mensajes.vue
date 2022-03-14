<template>
  <div class="grey lighten-5">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Legal first name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Legal middle name"
                    hint="example of helper text only on focus"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Legal last name*"
                    hint="example of persistent helper text"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Email*" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password*"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Age*"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="[
                      'Skiing',
                      'Ice hockey',
                      'Soccer',
                      'Basketball',
                      'Hockey',
                      'Reading',
                      'Writing',
                      'Coding',
                      'Basejump',
                    ]"
                    label="Interests"
                    multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="Cerrar()">Cerrar</v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-container>
      <v-row
        class="mb-2"
        no-gutters
        v-bind:key="index"
        v-for="(mensaje, index) in mensajes"
      >
        <v-col cols="3" class="centrarv">
          <v-img
            :src="
              mensaje.estado == 'no leido'
                ? img.received_mail
                : mensaje.estado == 'repondido'
                ? img.answered_mail
                : mensaje.estado == 'leido'
                ? img.read_mail
                : mensaje.estado == 'leyendo'
                ? img.reading_mail
                : false
            "
            max-width="130"
          ></v-img>
        </v-col>
        <v-col cols="9">
          <v-card class="mx-auto" color="#26c6da" dark>
            <v-card-title>
              <v-row>
                <v-col
                  ><v-icon large left>
                    $sms
                  </v-icon>
                  <span right class="title font-weight-light">{{
                    mensaje.correo
                  }}</span></v-col
                >
                <v-col
                  ><span class="caption" style="float: right;">{{
                    $store.getters.FechaFormateada(mensaje.fecha)
                  }}</span></v-col
                >
              </v-row>
            </v-card-title>

            <v-card-text class="font-weight-bold">
              "{{ mensaje.mensaje }}"
            </v-card-text>

            <v-card-actions>
              <v-list-item class="grow">
                <v-list-item-avatar color="grey darken-3">
                  <v-img
                    class="elevation-6"
                    src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    >{{ mensaje.nombre }}
                    {{ mensaje.apellido }}</v-list-item-title
                  >
                </v-list-item-content>

                <v-row align="center" justify="end">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" class="mx-2" fab dark small color="blue">
                        <v-icon dark>$eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Mirar</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        class="mx-2"
                        fab
                        dark
                        small
                        color="pink"
                        :disabled="mensaje.estado == 'no leido' ? false : true"
                      >
                        <v-icon dark>$delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                  <v-tooltip top v-if="mensaje.estado != 'respondido'">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :disabled="mensaje.estado == 'no leido' ? false : true"
                        v-on="on"
                        class="mx-2"
                        fab
                        dark
                        small
                        color="green"
                        @click="Responder(mensaje)"
                      >
                        <v-icon dark>$paper_plane</v-icon>
                      </v-btn>
                    </template>
                    <span>Responder</span>
                  </v-tooltip>
                </v-row>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Mensajes",
  data: () => ({
    img: {
      received_mail: require("@/assets/imagenes/received_mail.png"),
      read_mail: require("@/assets/imagenes/read_mail.png"),
      answered_mail: require("@/assets/imagenes/answered_mail.png"),
      reading_mail: require("@/assets/imagenes/reading_mail.png"),
    },
    dialog: false,
    mensajes: [],
    IndiceMensajeEditado: -1,
    MensajeEditado: {
      id: 0,
      correo: "",
      nombre: "",
      apellido: "",
      mensaje: "",
      estado: "",
      fecha: "",
    },
  }),
  methods: {
    Responder(mensaje) {
      var sms = mensaje;
      sms.estado = "leyendo";
      this.$socket.client.emit("CambiarEstado", sms);
      this.dialog = true;
    },
    Cerrar() {
      var sms = this.MensajeEditado;
      sms.estado = "leido";
      this.$socket.client.emit("CambiarEstado", sms);
      this.dialog = false;
    },
  },
  created() {},
  mounted() {
    this.$socket.client.emit("Mensajes", null);
  },
  destroyed: function () {},
  sockets: {
    EstadoCambiado(sms) {
      console.log(this.mensajes.indexOf(sms));
      this.IndiceMensajeEditado = this.mensajes.indexOf(sms);
      this.MensajeEditado = Object.assign({}, sms);

      // Object.assign(this.mensajes[this.IndiceMensajeEditado], sms);
      console.log(this.IndiceMensajeEditado);
      console.log(this.MensajeEditado);
      console.log(this.mensajes);
    },
    Mensajes(data) {
      if (data.length) {
        this.mensajes = data;
        this.mensajes.reverse();
      } else {
        this.mensajes.unshift(data);
        console.log(this.mensajes);
      }
    },
  },
  computed: {},
};
</script>

<style scoped>
.msg {
  padding: 30px 0 78px 0;
}

.avatar-msg {
  max-height: 60px;
  border-radius: 50%;
  max-width: 60px;
}

.box-msg {
  padding: 10px 20px 30px 20px;
  background-color: #ffffff;
  box-shadow: 0px 3px 40px #0000001a;
  border-radius: 0px 10px 10px 10px;
}

.box-msg h1 {
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 900;
  font-size: 18px;
  color: #373d41;
}

.msg-content {
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  color: #9d9d9c;
  font-size: 16px;
  margin-bottom: 20px;
}

.msg-btn {
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  color: #9d9d9c;
  font-size: 16px;
  text-decoration: underline;
}
#create .v-speed-dial {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}
</style>
