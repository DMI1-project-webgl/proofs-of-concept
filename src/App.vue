<script setup lang="ts">
import Canvas from './components/Canvas.vue';
import Information from './components/Information.vue';
</script>

<template>
  <header>
    <h1>Les loups de mer</h1>
  </header>

  <div class="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
  </div>

  <Canvas />
  <Information />

  <router-view />
</template>

<style>
@import './assets/base.css';

header {
  z-index: 10;
}

.nav {
  z-index: 10;
}
</style>
