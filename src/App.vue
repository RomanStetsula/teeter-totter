<template>
  <div id="app">
    <game-menu/>
    <active-shapes-area/>
    <teeter/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Teeter from './components/teeter.vue';
import GameMenu from './components/gameMenu.vue';
import ActiveShapesArea from './components/activeShapesArea.vue';

export default {
  name: 'App',
  components: {
    Teeter,
    ActiveShapesArea,
    GameMenu
  },
  methods: {
    ...mapActions([
      'moveActiveShapeHorizontally',
    ])
  },
  created() {
    window.addEventListener('keydown', (e) => { this.moveActiveShapeHorizontally(e) });
  }
}
</script>

<style>
  #app {
    width: 500px;
    margin: auto;
  }
</style>
