// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
<v-dialog lazy max-width="600" v-model="$store.state.showAboutDialog">
  <v-card v-if="$store.state.showAboutDialog" class="secondary white--text">
    <v-card-title><div class="headline">Acerca de</div></v-card-title>
    <v-card-text>
      <p><strong>Bienvenido a AstroNauta</strong></p>
      <p>Un planetario online visual, libre y disruptivo para explorar el cielo desde tu navegador.</p>
      <p>AstroNauta te permite:</p>
      <ul>
        <li>Explorar el cielo nocturno en tiempo real</li>
        <li>Viajar en el tiempo para ver el cielo en cualquier fecha</li>
        <li>Buscar y localizar objetos celestes</li>
        <li>Aprender sobre estrellas, planetas y constelaciones</li>
        <li>Disfrutar de una experiencia astronómica inmersiva</li>
      </ul>
      <p>Basado en Stellarium Web, una versión web del famoso software de planetario Stellarium.</p>
      <p><em>Explora el Universo desde la comodidad de tu navegador.</em></p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer><v-btn class="blue--text darken-1" flat @click.native="$store.state.showAboutDialog = false">Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
  export default {
  }
</script>

<style>
a {
  color: #82b1ff;
}
</style>
