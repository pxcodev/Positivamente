<template>
  <div>
    <Header />
    <div
      class="et_pb_section et_pb_section_0 et_pb_with_background et_section_regular"
    >
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="centrarv">
            <div class="light text-center">
              <p class="display-2">
                Conozca todo sobre nosotros
              </p>
              <p class="title font-weight-light">
                En esta sección podras encontrar información relevante sobre la
                fundación
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-img
              class="nosotrosimg"
              src="@/assets/imagenes/Nosotros/nosotros.png"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Wrapper Start -->
    <section id="intro">
      <v-container>
        <v-row>
          <v-col md="7" sm="12">
            <div class="block">
              <div class="section-title">
                <h2>Acerca de nosotros</h2>
                <p>
                  Somos una fundación que va más allá de los límites para ayudar
                  a los demás, especialmente a los más necesitados, solo
                  queremos una sola cosa: el bienestar para todos.
                </p>
              </div>
              <p class="text-justify">
                Proyecto positivamente promueve diversas ideas para el bien
                general de la comunidad, nuestras actividades son realizadas en
                pro de los ciudadanos. Nuestros esfuerzos están orientados a la
                consolidación de un equipo de trabajo especialista en alianzas
                estratégicas a fin de vincular de manera efectiva con empresas
                de diferentes sectores económicos a nivel nacional. Proyecto
                positivamente con el objetivo contribuir con la transformación
                social del país, con acciones innovadoras, sostenibles y de
                impacto.
              </p>
            </div>
          </v-col>
          <!-- .col-md-7 close -->
          <v-col md="5" sm="12">
            <div class="block centrar" style="width: 200px;">
              <object data="" type="">
                <embed :src="require('./../assets/logosvg2.svg')" type="" />
              </object>
              <!-- <img :src="gif" alt="Img" /> -->
            </div>
          </v-col>
          <!-- .col-md-5 close -->
        </v-row>
      </v-container>
    </section>

    <section id="feature">
      <v-container>
        <v-row>
          <v-col md="6" offset-md="6">
            <h2>PROMOVEMOS GRANDES IDEAS</h2>
            <p class="text-justify">
              Como lo dice nuestro logo, es una parte fundamental de quienes
              somos, nos identifica, de manera que cada una de nuestras ideas
              como equipo tienen como objetivo principal el bienestar de muchas
              personas necesitadas, en cualquier condición y cualquier lugar.
            </p>
            <p class="text-justify">
              Proyecto Positivamente incentiva la participación del voluntariado
              juvenil y corporativo para el fortalecimiento institucional. Tal
              es el caso de “Condonízate”, campaña a favor de la sexualidad
              responsable emprendida con la UNFPA Venezuela y la organizadora de
              eventos Evenpro, en el marco de destacados conciertos de artistas
              nacionales e internacionales realizados en Venezuela.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Service Start -->
    <section id="service">
      <v-container>
        <v-row>
          <div class="section-title">
            <h2>VALORES</h2>
            <p>
              Nuestra fundación tiene como base principal y más importante los
              distintos valores que día a día nos hacen mejores personas, nos da
              valor y fuerzas para seguir con este hermoso proyecto.
            </p>
          </div>
        </v-row>
        <v-row>
          <v-col md="3" sm="6">
            <div class="service-item">
              <i class="fas fa-hand-holding-heart"></i>
              <h4>Respeto</h4>
              <p>
                El respeto es la capacidad de reconocer, apreciar y valorar a
                los otros teniendo en cuenta que todos somos válidos
              </p>
            </div>
          </v-col>
          <v-col md="3" sm="6">
            <div class="service-item">
              <i class="fas fa-heart"></i>
              <h4>Amor</h4>
              <p>
                El amor es uno de los valores fundamentales de la sociedad
                porque nos empuja a velar por la felicidad del otro.
              </p>
            </div>
          </v-col>
          <v-col md="3" sm="6">
            <div class="service-item">
              <i class="fab fa-pagelines"></i>
              <h4>Libertad</h4>
              <p>
                La libertad es un valor que nos ayuda a realizarnos como
                personas. La libertad individual se enmarca dentro de lo social.
              </p>
            </div>
          </v-col>
          <v-col md="3" sm="6">
            <div class="service-item">
              <i class="fas fa-balance-scale"></i>
              <h4>Justicia</h4>
              <p>
                La justicia es un valor importante porque busca el equilibrio
                entre el propio bien y el de la sociedad.
              </p>
            </div>
          </v-col>
          <v-col md="3" sm="6">
            <div class="service-item">
              <i class="fas fa-smile"></i>
              <h4>Tolerancia</h4>
              <p>
                La tolerancia es el valor que concede dignidad, libertad y
                diversidad en una sociedad, asumiendo que todos somos
                diferentes.
              </p>
            </div>
          </v-col>
          <v-col md="3" sm="6">
            <div class="service-item">
              <i class="fas fa-equals"></i>
              <h4>Equidad</h4>
              <p>
                La equidad es tratar a todos por igual, independiente de su
                clase social, raza, sexo o religión.
              </p>
            </div>
          </v-col>
          <v-col md="3" sm="6">
            <div class="service-item">
              <i class="fas fa-child"></i>
              <h4>Honestidad</h4>
              <p>
                La honestidad es un valor social que genera acciones de
                beneficio común y se refleja en la congruencia entre lo que se
                piensa y lo que se hace.
              </p>
            </div>
          </v-col>
          <v-col md="3" sm="6">
            <div class="service-item">
              <i class="fas fa-user-shield"></i>
              <h4>Responsabilidad</h4>
              <p>
                La responsabilidad significa asumir las consecuencias de
                nuestros actos y cumplir con nuestros compromisos y obligaciones
                ante los demás.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Call to action Start -->
    <v-parallax height="300" src="../assets/imagenes/paravolun.png">
      <div id="call-to-action">
        <v-container>
          <v-row>
            <v-col md="12">
              <div class="block" color="black">
                <h1 class="font-weight-bold">
                  ¿Cómo podemos ayudar a los demás?
                </h1>
                <h3 class="font-weight-regular">
                  Hay muchas maneras de ayudar a los demás. Un pequeño gesto,
                  como una sonrisa en el momento adecuado, un saludo conveniente
                  o un oportuno golpecito en la espalda pueden tener efectos que
                  quizá no imaginas.
                </h3>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-parallax>
    <!-- Content Start -->
    <section id="testimonial">
      <div class="container">
        <div class="row">
          <div class="section-title text-center">
            <h2>Actividades recientes</h2>
            <p>
              Semanalmente realizamos nuevas actividades para promover las
              buenas ideas, de esta manera ayudamos a las personas que más lo
              necesitan, brindandoles una mano amiga.
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="block">
              <ul class="counter-box clearfix" style="list-style: none;">
                <li>
                  <div class="block">
                    <i class="fas fa-utensils"></i>
                    <h4 class="counter">31500</h4>
                    <span>Jornadas realizadas</span>
                  </div>
                </li>
                <li>
                  <div class="block">
                    <i class="fas fa-person-booth"></i>
                    <h4 class="counter">15500</h4>
                    <span>Ropa donada</span>
                  </div>
                </li>
                <li>
                  <div class="block">
                    <i class="fas fa-user-nurse"></i>
                    <h4 class="counter">2500</h4>
                    <span>Beneficiados</span>
                  </div>
                </li>
                <li>
                  <div class="block">
                    <i class="fas fa-home"></i>
                    <h4 class="counter">230</h4>
                    <span>Comunidades</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-6">
            <v-img src="../assets/imagenes/manos.png" alt=""></v-img>
          </div>
        </div>
      </div>
    </section>

    <BtnPanel />
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BtnPanel from "@/views/BtnPanel.vue";
export default {
  data: () => ({
    isActive: false,
    gif: require("@/assets/imagenes/wrapper-img.gif"),
  }),
  components: { Header, Footer, BtnPanel },
  mounted() {},
};
</script>

<style lang="scss" scoped>
body {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
}
/*--
	content Start 
--*/
#testimonial {
  padding: 100px 0;
}
#testimonial .block h2 {
  line-height: 27px;
  color: #5c5c5c;
  padding-top: 110px;
}
#testimonial .block p {
  padding-top: 50px;
  color: #7b7b7b;
}
#testimonial .counter-box li {
  width: 50%;
  float: left;
  text-align: center;
  margin: 30px 0 30px;
}
#testimonial .counter-box li i {
  font-size: 35px;
}
#testimonial .counter-box li h4 {
  font-size: 30px;
  font-weight: bold;
}
#testimonial .counter-box li span {
  color: #555;
}
#testimonial .testimonial-carousel {
  text-align: center;
  width: 75%;
  border: 1px solid #dedede;
  padding: 24px;
  margin: 0 auto;
}
#testimonial .testimonial-carousel img {
  padding-bottom: 38px;
}
#testimonial .testimonial-carousel p {
  line-height: 28px;
  font-weight: 300;
  padding-bottom: 20px;
}
#testimonial .testimonial-carousel .user img {
  padding-bottom: 0px;
  border-radius: 500px;
}
#testimonial .testimonial-carousel .user p {
  padding-bottom: 0;
  font-size: 12px;
  line-height: 20px;
  color: #353241;
}
#testimonial .testimonial-carousel .user p span {
  display: block;
  color: #353241;
  font-weight: 600;
}
#testimonial .testimonial-carousel .owl-carousel .owl-pagination div {
  border: 1px solid #1d1d1d;
  border-radius: 500px;
  display: inline-block;
  height: 10px;
  margin-right: 15px;
  width: 10px;
}
#testimonial .testimonial-carousel .owl-carousel .owl-pagination div.active {
  background: #5c5c5c;
  font-size: 30px;
  display: inline-block;
  border: 0px;
}
/*--
	call-to-action Start 
--*/
#call-to-action {
  padding: 70px 0px;
  position: relative;
  text-align: center;
  color: white !important;
}
#call-to-action h2 {
  padding-bottom: 20px;
  line-height: 33px;
  margin: 0;
  font-size: 30px;
}
#call-to-action p {
  font-size: 14px;
  line-height: 1.6;
}
#call-to-action .btn-call-to-action {
  padding: 15px 35px;
  border: none;
  background-color: #fff;
  font-size: 15px;
  color: #333333;
  margin-top: 30px;
}
/*--
	service Start 
--*/
#service {
  text-align: center;
  padding: 90px 0;
}
#service .service-item {
  padding-bottom: 30px;
}
#service .service-item i {
  font-size: 60px;
  color: #4a4656;
}
#service .service-item h4 {
  padding-top: 20px;
  margin: 0;
  color: #666;
}
#service .service-item p {
  color: #888;
  padding-top: 10px;
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
}
/*--
	Feature Start 
--*/
#feature {
  background: url("../assets/imagenes/positivos.png");
  background-position: 50% 94px;
  width: 100%;
  display: block;
  position: relative;
  overflow: visible;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: #fff;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  padding: 100px 0;
}
#feature h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
}
#feature p {
  color: #8d8f92;
  margin-bottom: 20px;
}
#feature .btn-view-works {
  background: #655e7a;
  color: #fff;
  padding: 10px 20px;
}
/*--
	wrapper Start 
--*/
#intro {
  padding: 100px 0;
}
#intro .block h2 {
  padding-top: 35px;
  line-height: 27px;
  margin: 0;
}
#intro .block p {
  color: #7b7b7b;
  padding-top: 20px;
}
#intro .block img {
  padding-left: 40px;
  width: 100%;
}
#intro .section-title {
  margin-bottom: 0px;
}
#intro .section-title p {
  padding-top: 20px;
}

.section-title {
  margin-bottom: 70px;
}
.section-title h2 {
  text-transform: uppercase;
  font-size: 28px;
  font-weight: 600;
}
.section-title p {
  font-family: "Volkhov", serif;
  font-style: italic;
  color: #666;
}

div.et_pb_section.et_pb_section_0 {
  background-position: bottom center;
  background-image: url("../assets/imagenes/img02.png");
}
.et_pb_all_tabs,
.et_pb_column,
.et_pb_counters .et_pb_counter_container,
.et_pb_module,
.et_pb_portfolio_item,
.et_pb_posts_nav a,
.et_pb_pricing_table,
.et_pb_row,
.et_pb_row_inner,
.et_pb_slide,
.et_pb_tab,
.et_pb_with_background {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.et_pb_section_0.et_pb_section {
  padding-top: 100px;
  padding-right: 0px;
  padding-bottom: 100px;
  padding-left: 0px;
}
@media only screen and (min-width: 1350px) {
  .et_pb_section {
    padding: 54px 0;
  }
}

@media (min-width: 981px) {
  .et_pb_section {
    padding: 4% 0;
  }
}
.et_pb_section {
  position: relative;
  background-color: #fff;
}
.et_pb_section,
.et_pb_slider .et_pb_slide {
  background-position: center;
  -webkit-background-size: 100%;
  -webkit-background-size: cover;
  -moz-background-size: 100%;
  -moz-background-size: cover;
  background-size: 100%;
  background-size: cover;
}
</style>
