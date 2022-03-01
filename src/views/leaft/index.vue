<template>
  <div id="leaft-map"></div>
</template>

<script setup lang="ts">
  import L, { LeafletMouseEvent } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { onMounted } from 'vue';
  import Worker from '@/worker/point?worker';

  const locateFeatureLevel = 12;
  let worker = new Worker();
  let ready = false;

  const createClusterIcon = (feature, latlng) => {
    if (!feature.properties.cluster) return L.marker(latlng);
    const count = feature.properties.point_count;
    const size = count < 100 ? 'small' : count < 1000 ? 'medium' : 'large';
    const icon = L.divIcon({
      html: `<div><span>${feature.properties.point_count_abbreviated}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(40, 40),
    });
    return L.marker(latlng, { icon });
  };

  const update = (map: any, ready: boolean) => {
    if (!ready) return;
    const bounds = map.getBounds();
    worker.postMessage({
      bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom: map.getZoom(),
    });
  };

  onMounted(() => {
    const leafLetMap = L.map('leaft-map').setView({ lat: 23.56, lng: 113.23 }, 5);
    L.tileLayer(
      'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        opacity: 1,
      },
    ).addTo(leafLetMap);

    const markers = L.geoJSON(undefined, {
      pointToLayer: createClusterIcon,
    }).addTo(leafLetMap);

    leafLetMap.on('moveend', function onMoveendMap() {
      let zoom = leafLetMap.getZoom();
      if (zoom >= locateFeatureLevel) {
        markers.removeFrom(leafLetMap);
      } else {
        markers.addTo(leafLetMap);
      }
      update(leafLetMap, ready);
    });

    worker.onmessage = function (e) {
      if (e.data.ready) {
        ready = true;
        update(leafLetMap, ready);
      } else if (e.data.expansionZoom) {
        leafLetMap.flyTo(e.data.center, e.data.expansionZoom);
      } else {
        markers.clearLayers();
        markers.addData(e.data);
      }
    };

    markers.on('click', (e: LeafletMouseEvent) => {
      if (e.layer.feature.properties.cluster_id) {
        worker.postMessage({
          getClusterExpansionZoom: e.layer.feature.properties.cluster_id,
          center: e.latlng,
        });
      }
    });
  });
</script>

<style src="./index.scss"></style>
