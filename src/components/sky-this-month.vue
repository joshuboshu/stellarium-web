// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>

<v-dialog lazy max-width='600' v-model="$store.state.showSkyThisMonthDialog" scrollable>
<v-card v-if="$store.state.showSkyThisMonthDialog" transparent class="secondary white--text">
  <v-card-title><div class="headline">Cielo Este Mes</div></v-card-title>
  <v-card-text>Consulta qué eventos astronómicos interesantes tienen lugar en un mes determinado.
    <v-container fluid>
      <v-layout row justify-space-between>
        <div class="grey--text text--lighten-1" style="align-items: center; display: flex; justify-content: center; width: 25%">Mes / Año</div>
        <v-select :items="months" v-model="month"></v-select>
        &nbsp; &nbsp;
        <v-text-field :value="year" type="Number"></v-text-field>
      </v-layout>
    </v-container>
  </v-card-text>
  <div style="height: 500px; margin: auto; overflow-y: auto;">
    <v-list two-line subheader>
      <v-list-tile avatar v-for="event in events" v-bind:key="event.id"  @click="">
        <v-list-tile-avatar>
          <img v-bind:src="getIcon(event.type)"/>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ event.desc }}</v-list-tile-title>
          <v-list-tile-sub-title class="grey--text">{{ event.time.format('MMMM DD, HH:mm') }}</v-list-tile-sub-title>
        </v-list-tile-content>
        <!-- <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon class="grey--text text--lighten-1">info</v-icon>
          </v-btn>
        </v-list-tile-action> !-->
      </v-list-tile>
    </v-list>
  </div>
  <v-card-actions>
    <v-spacer></v-spacer><v-btn class="blue--text darken-1" flat @click.native="$store.state.showSkyThisMonthDialog = false">Cerrar</v-btn>
  </v-card-actions>
</v-card>
</v-dialog>
</template>

<script>

import Moment from 'moment'
import 'moment/locale/es'

export default {
  data: function () {
    // Configurar Moment.js en español
    Moment.locale('es')
    let d = new Date()
    d.setMJD(this.$store.state.stel.observer.utc)
    return {
      year: Moment(d).format('YYYY'),
      month: Moment(d).format('MMMM'),
      months: Moment.months()
    }
  },
  methods: {
    getIcon: function (type) {
      return '/static/images/events/' + type + '.svg'
    }
  },
  computed: {
    events: function () {
      console.log('Compute Sky This Month Events')
      let start = Moment(this.year + '-' + this.month + '-01', 'YYYY-MMMM-DD')
      console.log('Recomputing ephemeris for', start.format('MMMM YYYY'))
      let ret = []
      let end = start.clone()
      end.endOf('month')
      this.$stel.calendar(start, end, function (time, type, desc, flags) {
        ret.push({
          id: time + type + desc,
          time: Moment(time),
          type: type,
          desc: desc,
          flags: flags
        })
      })
      return ret
    }
  }
}
</script>

<style>
.input-group {
  margin: 0px;
}
</style>
