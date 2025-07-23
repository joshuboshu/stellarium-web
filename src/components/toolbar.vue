// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
  <div id="toolbar-image">
    <v-toolbar class="modern-toolbar" flat>
      <v-btn icon class="nav-btn" @click.native.stop="toggleNavigationDrawer">
        <v-icon color="white">menu</v-icon>
      </v-btn>
      <img id="astroblue-toolbar-logo" src="/static/images/logo.svg" width="36" height="36" alt="AstroBlue Logo"/>
      <span class="tbtitle modern-title">AstroBlue</span>
      <v-spacer></v-spacer>
      <target-search></target-search>
      <v-spacer></v-spacer>
      <v-btn icon class="toolbar-btn" @click="$store.commit('toggleBool', 'showDateSelectorDialog')">
        <v-icon color="white">mdi-calendar</v-icon>
      </v-btn>
      <div style="width: 18px;"></div>
      <div class="toolbar-datetime"> <v-icon small color="white" class="mr-1">mdi-clock-outline</v-icon> <span>{{ currentDateTime }}</span> </div>
      <div style="width: 18px;"></div>
      <div class="toolbar-fps"><v-icon small color="white" class="mr-1">mdi-speedometer</v-icon>FPS {{ $store.state.stel ? $store.state.stel.fps.toFixed(1) : '?' }}</div>
    </v-toolbar>
  </div>
</template>

<script>

import TargetSearch from '@/components/target-search'

export default {
  data: function () {
    return {
      updateInterval: null
    }
  },

  computed: {
    currentDateTime: function () {
      if (this.$store.state.stel && this.$store.state.stel.observer) {
        let d = new Date()
        d.setMJD(this.$store.state.stel.observer.utc)
        return new Intl.DateTimeFormat('es-ES', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }).format(d)
      }
      return null
    }
  },
  methods: {
    toggleNavigationDrawer: function () {
      this.$store.commit('toggleBool', 'showNavigationDrawer')
    }
  },
  mounted: function () {
    // Actualizar la fecha cada minuto
    this.updateInterval = setInterval(() => {
      this.$forceUpdate()
    }, 60000)
  },
  beforeDestroy: function () {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  },
  components: { TargetSearch }
}
</script>

<style>
.modern-drawer.blue-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%) !important;
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
  box-shadow: 2px 0 16px 0 rgba(13, 71, 161, 0.10);
  color: #fff !important;
}

#toolbar-image {
  background: linear-gradient(90deg, #0d47a1 0%, #1976d2 100%);
  height: 64px;
  z-index: 10;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  box-shadow: 0 2px 10px 0 rgba(13, 71, 161, 0.20);
}

#astroblue-toolbar-logo {
  margin-right: 10px;
  margin-left: 18px;
  filter: drop-shadow(0 2px 4px #0d47a188);
}

.tbtitle.modern-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  margin-left: 12px;
  text-shadow: 0 2px 8px rgba(13, 71, 161, 0.2);
}
</style>
