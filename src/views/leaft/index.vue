<template>
  <div id="leaft-map"></div>
</template>

<script setup lang="ts">
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { onMounted } from 'vue';

  onMounted(() => {
    const leafLetMap = L.map('leaft-map').setView([51.505, -0.09], 13);
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoieXN5MTAxNiIsImEiOiJja3h4MG9jczA2aXd1MnpreXQ3d2N5OGh2In0.qgEzfhABh2yAmTZotdneZQ',
      },
    ).addTo(leafLetMap);
  });
</script>

<style lang="scss" scoped>
  #leaft-map {
    height: 100%;
    width: 100%;
  }
</style>
