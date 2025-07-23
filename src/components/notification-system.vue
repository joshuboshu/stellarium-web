// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
  <v-snackbar class="modern-snackbar blue-gradient white--text"
    v-model="show"
    :color="notification.color || 'info'"
    :timeout="notification.timeout || 3000"
    :top="notification.position === 'top'"
    :bottom="notification.position !== 'top'"
    :left="notification.align === 'left'"
    :right="notification.align === 'right'"
    :multi-line="notification.multiLine"
  >
    <v-icon v-if="notification.icon" class="mr-2">{{ notification.icon }}</v-icon>
    {{ notification.message }}
    <v-btn
      flat
      @click="show = false"
      class="ml-2"
    >
      Cerrar
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      notification: {}
    }
  },
  mounted () {
    // Escuchar eventos de notificación
    this.$root.$on('showNotification', this.showNotification)
  },
  beforeDestroy () {
    this.$root.$off('showNotification', this.showNotification)
  },
  methods: {
    showNotification (notification) {
      this.notification = {
        message: notification.message || 'Notificación',
        color: notification.color || 'info',
        timeout: notification.timeout || 3000,
        position: notification.position || 'bottom',
        align: notification.align || 'left',
        multiLine: notification.multiLine || false,
        icon: notification.icon
      }
      this.show = true
    }
  }
}
</script>

<style scoped>
.v-snack {
  z-index: 9999;
}
</style>
