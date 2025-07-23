// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
  <div style="position: absolute; display:flex; align-items: flex-end;">
    <div class="tbtcontainer" style="max-width: 300px; display:flex; align-items: flex-end;">
      
    </div>
    <v-spacer></v-spacer>

    <bottom-button label="Constellations"
                img="/static/images/btn-cst-lines.svg"
                :toggled="$store.state.stel.constellations.lines.visible"
                @clicked="(b) => { $stel.core.constellations.lines.visible = b }">
    </bottom-button>
    <bottom-button label="Atmosphere"
                img="/static/images/btn-atmosphere.svg"
                :toggled="$store.state.stel.atmosphere.visible"

    <bottom-button label="Azimuthal Grid"
                img="/static/images/btn-azimuthal-grid.svg"
                :toggled="$store.state.stel.lines.azimuthal.visible"
                @clicked="(b) => { $stel.core.lines.azimuthal.visible = b }">
    </bottom-button>
    <bottom-button label="Equatorial Grid"
                img="/static/images/btn-equatorial-grid.svg"
                :toggled="$store.state.stel.lines.equatorial.visible"
                @clicked="(b) => { $stel.core.lines.equatorial.visible = b }">
    </bottom-button>
    <bottom-button label="Deep Sky Objects"
                img="/static/images/btn-nebulae.svg"
                class="mr-auto"
                :toggled="$store.state.stel.dsos.visible"
                @clicked="(b) => { $stel.core.dsos.visible = b }">
    </bottom-button>
    <bottom-button label="Fullscreen"
                :img="fullscreenBtnImage"
                class="mr-auto hidden-xs-only"
                :toggled="$store.state.fullscreen"
                @clicked="(b) => { setFullscreen(b) }">
    </bottom-button>

    <v-spacer></v-spacer>




  </div>
</template>

<script>

import BottomButton from '@/components/bottom-button.vue'
import Moment from 'moment'

export default {
  components: { BottomButton },
  data: function () {
    return {
    }
  },
  computed: {
    // The MomentJS time in local time
    utc: function () {
      var d = new Date()
      d.setMJD(this.$store.state.stel.observer.utc)
      return Moment(d)
    },

    fullscreenBtnImage: function () {
      return this.$store.state.fullscreen ? '/static/images/svg/ui/fullscreen_exit.svg' : '/static/images/svg/ui/fullscreen.svg'
    }
  },
  methods: {
    setFullscreen: function (b) {
      this.$fullscreen.toggle(document.body, {
        wrap: false,
        callback: this.onFullscreenChange
      })
    },
    onFullscreenChange: function (b) {
      if (this.$store.state.fullscreen === b) return
      this.$store.commit('toggleBool', 'fullscreen')
    }
  }
}
</script>

<style>

@media all and (max-width: 600px) {
  .tmenubt {
    min-width: 30px;
  }
}
@media all and (min-width: 600px) {
  .tbtcontainer {
    width: 300px;
  }
}
</style>
