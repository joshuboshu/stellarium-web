// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
<v-dialog lazy max-width='600' v-model="$store.state.showViewSettingsDialog">
<v-card v-if="$store.state.showViewSettingsDialog" class="secondary white--text">
  <v-card-title><div class="headline">Configuración de Vista</div></v-card-title>
  <v-card-text>
    <v-checkbox label='Vía Láctea' v-model="milkyWayOn"></v-checkbox>
    <v-checkbox label='DSS (Digitized Sky Survey)' v-model="dssOn"></v-checkbox>
    <v-checkbox label='Simular refracción' v-model="refractionOn"></v-checkbox>
    <v-checkbox label='Línea del Meridiano' v-model="meridianOn"></v-checkbox>
    <v-checkbox label='Línea Eclíptica' v-model="eclipticOn"></v-checkbox>
  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer><v-btn class="blue--text darken-1" flat @click.native="$store.state.showViewSettingsDialog = false">Cerrar</v-btn>
  </v-card-actions>
</v-card>
</v-dialog>
</template>

<script>

export default {
  data: function () {
    return {
    }
  },
  computed: {
    dssOn: {
      get: function () {
        return this.$store.state.stel.dss.visible
      },
      set: function (newValue) {
        this.$stel.core.dss.visible = newValue
      }
    },
    milkyWayOn: {
      get: function () {
        return this.$store.state.stel.milkyway.visible
      },
      set: function (newValue) {
        this.$stel.core.milkyway.visible = newValue
      }
    },
    refractionOn: {
      get: function () {
        return this.$store.state.stel.observer.refraction
      },
      set: function (newValue) {
        this.$stel.core.observer.refraction = newValue
      }
    },
    meridianOn: {
      get: function () {
        return this.$store.state.stel.lines.meridian.visible
      },
      set: function (newValue) {
        this.$stel.core.lines.meridian.visible = newValue
      }
    },
    eclipticOn: {
      get: function () {
        return this.$store.state.stel.lines.ecliptic.visible
      },
      set: function (newValue) {
        this.$stel.core.lines.ecliptic.visible = newValue
      }
    }
  }
}
</script>

<style>
.input-group {
  margin: 0px;
}
</style>
