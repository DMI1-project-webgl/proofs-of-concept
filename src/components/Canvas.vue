<template>
  <div class="canvas">
    <canvas ref="canvas" id="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import MainScene from '../assets/js/webgl/main/MainScene'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CanvasElement',
  mounted () {
    new MainScene(this.$refs['canvas'] as HTMLCanvasElement)
  },
  beforeDestroy () {
  }
})
</script>

<style scoped>
.canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

canvas#canvas {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
