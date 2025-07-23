// AstroBlue - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
<v-dialog lazy max-width="600" v-model="$store.state.showAboutDialog">
  <v-card v-if="$store.state.showAboutDialog" class="modern-dialog blue-gradient white--text" elevation="10">
    <v-card-title><div class="headline">Acerca de</div></v-card-title>
    <v-card-text>
      <p>Bienvenido a AstroBlue, un planetario gratuito y de código abierto que funciona en tu navegador web.
      Esta página aún está en beta, por favor reporta cualquier error o haz preguntas a <a href="mailto:contact@noctua-software.com">contact@noctua-software.com</a> o en nuestra <a href="https://github.com/Stellarium/stellarium-web" target="_blank">página de Github</a>.</p>
      <p>Si quieres recibir notificaciones cuando agreguemos nuevas características (solo noticias importantes: ¡sin spam!) puedes suscribirte a nuestra lista de correo:</p>
      <p>Al suscribirte a esta lista de correo, aceptas nuestra <a v-on:click.stop="$store.state.showPrivacyDialog = true">Política de Privacidad</a></p>
      <v-layout row justify-space-around>
        <v-text-field label="Correo electrónico" v-model='email'/>
        <v-btn color="secondary" @click.native='addEmail()' style="margin-top: auto; margin-bottom: auto;">Enviar</v-btn>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer><v-btn class="blue--text darken-1" flat @click.native="$store.state.showAboutDialog = false">Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
  export default {
    data: function () {
      return {
        email: ''
      }
    },
    methods: {
      addEmail: function () {
        if (process.browser) {
          this.$store.dispatch('addEmailToMailingList', this.email).then(() => { alert('Tu correo electrónico ha sido agregado') })
        }
      }
    }
  }
</script>

<style>
.modern-dialog.blue-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%) !important;
  border-radius: 18px;
  box-shadow: 0 6px 24px 0 rgba(13, 71, 161, 0.18);
  padding: 24px 12px;
}

a {
  color: #82b1ff;
}
</style>
