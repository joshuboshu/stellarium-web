// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
  <div id="toolbar-image">
    <div class="stars"></div>
    <v-toolbar class="astro-toolbar" dense>
      <v-toolbar-side-icon @click.native.stop="toggleNavigationDrawer" />
      <img class="astro-toolbar-logo" src="https://cdn-icons-png.flaticon.com/512/3212/3212608.png" width="38" height="38" alt="AstroNauta Logo" />
      <div class="brand">
        <span class="tbtitle">Astro<span class="highlight">NAUTA</span></span>
        <div class="subtitle">Explora el Universo</div>
      </div>
      
      <v-spacer></v-spacer>

      <div class="datetime-container">
        <div class="datetime-pill date-pill" @click="showDateDialog = true">
          <i class="fas fa-calendar-alt"></i>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="datetime-pill time-pill" @click="showTimeDialog = true">
          <i class="fas fa-clock"></i>
          <span>{{ formattedTime }}</span>
        </div>
        <div class="fps-pill">FPS: {{ fps }}</div>
        <v-dialog v-model="showDateDialog" max-width="320" persistent>
          <v-card class="date-modal">
            <v-card-title class="modal-title">
              <i class="fas fa-calendar-alt mr-2"></i>
              Seleccionar Fecha
            </v-card-title>
            <v-card-text>
              <v-date-picker 
                :value="currentDate" 
                locale="es" 
                color="#00eaff"
                header-color="#6a3093"
                @input="saveDate" 
                @change="saveDate"
                full-width
                no-title
              ></v-date-picker>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="showDateDialog = false">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <v-dialog v-model="showTimeDialog" max-width="320" persistent>
          <v-card class="time-modal">
            <v-card-title class="modal-title">
              <i class="fas fa-clock mr-2"></i>
              Seleccionar Hora
            </v-card-title>
            <v-card-text>
              <v-time-picker 
                :value="currentTime" 
                format="24hr" 
                color="#00eaff"
                header-color="#6a3093"
                @input="saveTime" 
                @change="saveTime"
                full-width
                no-title
              ></v-time-picker>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="showTimeDialog = false">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="user-btn" v-bind="attrs" v-on="on">
            <i class="fas fa-user-astronaut fa-lg"></i>
          </v-btn>
        </template>
        <span>Perfil</span>
      </v-tooltip>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data() {
  return {
    showDateDialog: false,
    showTimeDialog: false,
    fps: 0,
    _frames: 0,
    _lastFpsUpdate: Date.now(),
    _fpsRaf: null,
    // Diccionario español para fechas
    spanishMonths: {
      'Jan': 'Ene', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Abr',
      'May': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Ago',
      'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dic'
    },
    spanishDays: {
      'Monday': 'Lunes', 'Tuesday': 'Martes', 'Wednesday': 'Miércoles',
      'Thursday': 'Jueves', 'Friday': 'Viernes', 'Saturday': 'Sábado', 'Sunday': 'Domingo'
    }
  }
},
mounted() {
  this._frames = 0;
  this._lastFpsUpdate = Date.now();
  const fpsLoop = () => {
    this._frames++;
    const now = Date.now();
    if (now - this._lastFpsUpdate > 1000) {
      this.fps = this._frames;
      this._frames = 0;
      this._lastFpsUpdate = now;
    }
    this._fpsRaf = requestAnimationFrame(fpsLoop);
  };
  this._fpsRaf = requestAnimationFrame(fpsLoop);
},
destroyed() {
  if (this._fpsRaf) cancelAnimationFrame(this._fpsRaf);
},
  computed: {
    // Obtener tiempo UTC del sistema Stellarium
    utc() {
      if (!this.$store.state.stel) return new Date();
      var d = new Date();
      d.setMJD(this.$store.state.stel.observer.utc);
      return d;
    },
    // Fecha actual del sistema en formato YYYY-MM-DD
    currentDate() {
      const utc = this.utc;
      return utc.toISOString().slice(0, 10);
    },
    // Hora actual del sistema en formato HH:MM
    currentTime() {
      const utc = this.utc;
      return utc.toTimeString().slice(0, 5);
    },
    // Fecha formateada para mostrar
    formattedDate() {
      const d = this.utc;
      let formatted = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
      // Traducir meses al español
      Object.keys(this.spanishMonths).forEach(eng => {
        formatted = formatted.replace(eng, this.spanishMonths[eng]);
      });
      return formatted.replace(/\./g, '');
    },
    // Hora formateada para mostrar
    formattedTime() {
      const d = this.utc;
      return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    }
  },

  methods: {
    toggleNavigationDrawer() {
      this.$store.commit('toggleBool', 'showNavigationDrawer');
    },

    saveDate(date) {
      // Actualizar el sistema Stellarium con la nueva fecha
      if (!this.$stel) return;
      
      const currentUtc = this.utc;
      const newDate = new Date(date + 'T' + this.currentTime);
      
      // Crear nueva fecha manteniendo la hora actual
      const updatedDate = new Date(currentUtc);
      updatedDate.setFullYear(newDate.getFullYear());
      updatedDate.setMonth(newDate.getMonth());
      updatedDate.setDate(newDate.getDate());
      
      // Actualizar el observador de Stellarium
      this.$stel.core.observer.utc = updatedDate.getMJD();
      this.showDateDialog = false;
    },
    saveTime(time) {
      // Actualizar el sistema Stellarium con la nueva hora
      if (!this.$stel) return;
      
      const currentUtc = this.utc;
      const [hours, minutes] = time.split(':').map(Number);
      
      // Crear nueva hora manteniendo la fecha actual
      const updatedTime = new Date(currentUtc);
      updatedTime.setHours(hours);
      updatedTime.setMinutes(minutes);
      updatedTime.setSeconds(0);
      
      // Actualizar el observador de Stellarium
      this.$stel.core.observer.utc = updatedTime.getMJD();
      this.showTimeDialog = false;
    }
  }
}
</script>

<style>
#toolbar-image {
  background: linear-gradient(90deg, #1e215d 0%, #6a3093 100%);
  height: 56px;
  z-index: 1;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(30,33,93,0.18);
  display: flex;
  align-items: center;
}

.astro-toolbar {
  background: transparent !important;
  width: 100%;
  box-shadow: none;
  display: flex;
  align-items: center;
}

.astro-toolbar-logo {
  margin-left: 18px;
  margin-right: 18px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 8px #6a3093;
  background: #fff;
  flex-shrink: 0;
}

.toolbar-main {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
  flex-wrap: wrap;
  overflow: hidden;
  gap: 8px;
}

@media (max-width: 900px) {
  .search-container {
    max-width: 120px;
  }
  .tbtitle {
    font-size: 18px;
  }
}


.brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 24px;
  min-width: 120px;
  flex: 0 1 auto;
  overflow: hidden;
  flex-shrink: 0;
}

.search-container {
  min-width: 180px;
  max-width: 280px;
  margin-right: 24px;
  display: flex;
  align-items: center;
}

.search-container {
  flex: 1 1 180px;
  min-width: 120px;
  max-width: 320px;
  margin-left: auto;
  margin-right: 24px;
  display: flex;
  align-items: center;
}

.astro-search {
  flex: 1 1 0%;
  min-width: 0;
}

.brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 24px;
  min-width: 0;
}

.tbtitle {
  font-family: 'Orbitron', 'Montserrat', Arial, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.tbtitle .highlight {
  color: #00eaff;
  text-shadow: 0 0 4px #00eaff99;
}

.subtitle {
  font-size: 12px;
  color: #b3b3ff;
  margin-top: -2px;
  letter-spacing: 0.5px;
}

/* Datetime Components */
.datetime-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 16px;
}

.datetime-pill {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.datetime-pill:hover {
  background: rgba(0, 234, 255, 0.2);
  border-color: #00eaff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 234, 255, 0.3);
}

.datetime-pill i {
  margin-right: 8px;
  color: #00eaff;
  font-size: 14px;
}

.datetime-pill span {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.fps-pill {
  background: rgba(0,0,0,0.35);
  color: #fff;
  font-size: 13px;
  border-radius: 14px;
  padding: 6px 14px;
  margin-left: 10px;
  font-family: 'Roboto Mono', 'Consolas', monospace;
  font-weight: 500;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  min-width: 56px;
  justify-content: center;
  user-select: none;
  box-shadow: 0 1px 4px #0004;
  border: 1px solid rgba(0,234,255,0.12);
}
@media (max-width: 600px) {
  .fps-pill {
    font-size: 11px;
    padding: 4px 8px;
    min-width: 38px;
    margin-left: 5px;
  }
}

.date-modal .v-card, .time-modal .v-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.date-modal .v-card-text, .time-modal .v-card-text {
  padding: 16px;
}

.v-card-actions .v-btn {
  color: #6a3093 !important;
  font-weight: 600;
  text-transform: none;
}

.user-btn {
  margin-right: 18px;
  color: #fff !important;
}
</style>
