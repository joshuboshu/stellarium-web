// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
  <div class="bottom-bar-centered">
    <div class="bottom-bar-buttons">
      <bottom-button label="Constelaciones"
                  img="/static/images/btn-cst-lines.svg"
                  :toggled="$store.state.stel.constellations.lines.visible"
                  @clicked="(b) => { $stel.core.constellations.lines.visible = b }">
      </bottom-button>
      <bottom-button label="Cuadrícula Azimutal"
                  img="/static/images/btn-azimuthal-grid.svg"
                  :toggled="$store.state.stel.lines.azimuthal.visible"
                  @clicked="(b) => { $stel.core.lines.azimuthal.visible = b }">
      </bottom-button>
      <bottom-button label="Cuadrícula Ecuatorial"
                  img="/static/images/btn-equatorial-grid.svg"
                  :toggled="$store.state.stel.lines.equatorial.visible"
                  @clicked="(b) => { $stel.core.lines.equatorial.visible = b }">
      </bottom-button>
      <bottom-button label="Objetos de Cielo Profundo"
                  img="/static/images/btn-nebulae.svg"
                  :toggled="$store.state.stel.dsos.visible"
                  @clicked="(b) => { $stel.core.dsos.visible = b }">
      </bottom-button>
      <bottom-button label="Pantalla Completa"
                  :img="fullscreenBtnImage"
                  class="hidden-xs-only"
                  :toggled="$store.state.fullscreen"
                  @clicked="(b) => { setFullscreen(b) }">
      </bottom-button>
    </div>
  </div>
</template>

<style scoped>
.bottom-bar-centered {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 100;
  pointer-events: none;
}
.bottom-bar-buttons {
  display: flex;
  gap: 14px;
  background: rgba(10, 20, 40, 0.85);
  border-radius: 20px 20px 0 0;
  padding: 12px 32px 8px 32px;
  box-shadow: 0 0 16px 2px #000b;
  align-items: flex-end;
  pointer-events: auto;
}
@media (max-width: 600px) {
  .bottom-bar-centered {
    align-items: flex-end;
    width: 100vw;
    min-width: 0;
  }
  .bottom-bar-buttons {
    gap: 7px;
    padding: 8px 10px 4px 10px;
    border-radius: 14px 14px 0 0;
    box-shadow: 0 0 8px 1px #0008;
    font-size: 0.97em;
  }
  .bottom-bar-buttons > * {
    min-width: 36px;
    min-height: 36px;
    font-size: 0.97em;
  }
}
</style>


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
