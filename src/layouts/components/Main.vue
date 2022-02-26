<template>
  <main class="isie-container">
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
  .isie-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100vh - 40px);
  }
</style>
