// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
<div>
  <v-dialog lazy v-model="$store.state.showDateSelectorDialog" max-width="600px">
    <v-card class="secondary white--text">
      <v-card-title primary-title>
        <div>
          <div class="headline">Selector de Fecha y Hora</div>
          <span class="grey--text">Selecciona una fecha y hora para explorar el cielo</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <!-- Selector de fecha -->
            <v-flex xs12 md6>
              <v-menu
                ref="dateMenu"
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="selectedDate"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="selectedDate"
                    label="Fecha"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="selectedDate"
                  no-title
                  scrollable
                  :locale="'es'"
                >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="dateMenu = false">Cancelar</v-btn>
                  <v-btn flat color="primary" @click="$refs.dateMenu.save(selectedDate)">Aceptar</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>

            <!-- Selector de hora -->
            <v-flex xs12 md6>
              <v-menu
                ref="timeMenu"
                v-model="timeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="selectedTime"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="selectedTime"
                    label="Hora"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="timeMenu"
                  v-model="selectedTime"
                  full-width
                  format="24hr"
                  :landscape="$vuetify.breakpoint.smAndUp"
                >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="timeMenu = false">Cancelar</v-btn>
                  <v-btn flat color="primary" @click="$refs.timeMenu.save(selectedTime)">Aceptar</v-btn>
                </v-time-picker>
              </v-menu>
            </v-flex>

            <!-- Botones de acceso rápido -->
            <v-flex xs12>
              <v-subheader>Acceso Rápido</v-subheader>
              <v-layout wrap>
                <v-flex xs6 sm3>
                  <v-btn block color="primary" @click="setCurrentDateTime">
                    <v-icon left>schedule</v-icon>
                    Ahora
                  </v-btn>
                </v-flex>
                <v-flex xs6 sm3>
                  <v-btn block color="primary" @click="setSunsetTime">
                    <v-icon left>brightness_3</v-icon>
                    Atardecer
                  </v-btn>
                </v-flex>
                <v-flex xs6 sm3>
                  <v-btn block color="primary" @click="setMidnightTime">
                    <v-icon left>brightness_2</v-icon>
                    Medianoche
                  </v-btn>
                </v-flex>
                <v-flex xs6 sm3>
                  <v-btn block color="primary" @click="setSunriseTime">
                    <v-icon left>wb_sunny</v-icon>
                    Amanecer
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>

            <!-- Información adicional -->
            <v-flex xs12>
              <v-card flat class="transparent">
                <v-card-text>
                  <div class="body-2 mb-2">Fecha y hora seleccionada:</div>
                  <div class="title">{{ formattedDateTime }}</div>
                  <div class="caption mt-2">
                    <v-icon small>info</v-icon>
                    La hora se muestra en formato local. El cielo se actualizará según la fecha y hora seleccionadas.
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="$store.state.showDateSelectorDialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="applyDateTime">Aplicar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import Moment from 'moment'

export default {
  data () {
    return {
      dateMenu: false,
      timeMenu: false,
      selectedDate: null,
      selectedTime: null
    }
  },
  computed: {
    formattedDateTime () {
      if (this.selectedDate && this.selectedTime) {
        const dateTime = Moment(`${this.selectedDate} ${this.selectedTime}`)
        return dateTime.format('dddd, D [de] MMMM [de] YYYY [a las] HH:mm')
      }
      return 'No seleccionada'
    }
  },
  methods: {
    setCurrentDateTime () {
      const now = Moment()
      this.selectedDate = now.format('YYYY-MM-DD')
      this.selectedTime = now.format('HH:mm')
    },
    setSunsetTime () {
      // Calcular el atardecer real usando el motor astronómico
      if (this.$stel && this.$stel.getObj) {
        const sun = this.$stel.getObj('Sun')
        let d = new Date()
        d.setMJD(this.$stel.core.observer.utc)
        let sunset = Moment(d)

        // Buscar cuando el sol se pone (altitud < 0)
        for (let i = 0; i < 24 * 12; i++) { // Cada 5 minutos por 24 horas
          this.$stel.core.observer.utc = sunset.toDate().getMJD()
          sun.update()
          if (sun.alt < -0.1) { // Sol por debajo del horizonte
            break
          }
          sunset.add(5, 'minutes')
        }

        this.selectedDate = sunset.format('YYYY-MM-DD')
        this.selectedTime = sunset.format('HH:mm')
      } else {
        // Fallback si no hay acceso al motor astronómico
        const sunset = Moment().hour(18).minute(30)
        this.selectedDate = sunset.format('YYYY-MM-DD')
        this.selectedTime = sunset.format('HH:mm')
      }
    },
    setMidnightTime () {
      const midnight = Moment().hour(0).minute(0)
      this.selectedDate = midnight.format('YYYY-MM-DD')
      this.selectedTime = midnight.format('HH:mm')
    },
    setSunriseTime () {
      // Calcular el amanecer real usando el motor astronómico
      if (this.$stel && this.$stel.getObj) {
        const sun = this.$stel.getObj('Sun')
        let d = new Date()
        d.setMJD(this.$stel.core.observer.utc)
        let sunrise = Moment(d).subtract(12, 'hours') // Empezar desde medianoche

        // Buscar cuando el sol sale (altitud > 0)
        for (let i = 0; i < 24 * 12; i++) { // Cada 5 minutos por 24 horas
          this.$stel.core.observer.utc = sunrise.toDate().getMJD()
          sun.update()
          if (sun.alt > 0.1) { // Sol por encima del horizonte
            break
          }
          sunrise.add(5, 'minutes')
        }

        this.selectedDate = sunrise.format('YYYY-MM-DD')
        this.selectedTime = sunrise.format('HH:mm')
      } else {
        // Fallback si no hay acceso al motor astronómico
        const sunrise = Moment().hour(6).minute(0)
        this.selectedDate = sunrise.format('YYYY-MM-DD')
        this.selectedTime = sunrise.format('HH:mm')
      }
    },
    applyDateTime () {
      if (this.selectedDate && this.selectedTime) {
        const dateTime = Moment(`${this.selectedDate} ${this.selectedTime}`)

        // Actualizar el tiempo en Stellarium
        this.$stel.core.observer.utc = dateTime.toDate().getMJD()

        // Forzar actualización de todos los objetos celestes
        this.$stel.core.update()

        // Cerrar el diálogo
        this.$store.state.showDateSelectorDialog = false

        // Mostrar mensaje de confirmación más amigable
        this.$nextTick(() => {
          // Usar una notificación más elegante si está disponible
          if (this.$store.commit) {
            try {
              this.$store.commit('showNotification', {
                message: `✨ Cielo actualizado para: ${this.formattedDateTime}`,
                color: 'success',
                timeout: 4000
              })
            } catch (e) {
              // Fallback a alert si no hay sistema de notificaciones
              alert(`Cielo actualizado para: ${this.formattedDateTime}`)
            }
          }
        })
      }
    }
  },
  mounted () {
    // Configurar moment.js en español
    Moment.locale('es')

    // Inicializar con la fecha y hora actuales
    this.setCurrentDateTime()
  }
}
</script>

<style scoped>
.v-card {
  background: rgba(66, 66, 66, 0.95) !important;
}

.v-btn {
  margin: 4px;
}

.v-subheader {
  color: rgba(255, 255, 255, 0.7);
}
</style>
