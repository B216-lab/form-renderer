<template>
   <button class="btn-default" @click="drawEnabled = !drawEnabled">
    Draw: {{ drawEnabled }}
  </button>

  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 400px">
    <ol-view ref="view" :center="center" :zoom="zoom" :projection="projection" />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-vector-layer>
      <ol-source-vector :projection="projection">
        <ol-interaction-draw v-if="drawEnabled" :type="drawType" @drawend="drawend" @drawstart="drawstart">
          <ol-style>
            <ol-style-stroke color="blue" :width="2"></ol-style-stroke>
            <ol-style-fill color="rgba(255, 255, 0, 0.4)"></ol-style-fill>
            <ol-style-circle :radius="5">
              <ol-style-fill color="#00dd11" />
              <ol-style-stroke color="blue" :width="2" />
            </ol-style-circle>
          </ol-style>
        </ol-interaction-draw>

        <ol-interaction-modify />
      </ol-source-vector>

      <ol-style>
        <ol-style-stroke color="red" :width="2"></ol-style-stroke>
        <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
        <ol-style-circle :radius="7">
          <ol-style-fill color="red"></ol-style-fill>
        </ol-style-circle>
      </ol-style>
    </ol-vector-layer>
  </ol-map>
</template>

<script setup lang="ts">
import { ref } from "vue";

const center = ref([40, 40]);
const projection = ref("EPSG:4326");
const zoom = ref(11);

const drawEnabled = ref(false);
const drawType = ref("LineString");

const drawstart = (event) => {
  console.log(event);
};

const drawend = (event) => {
  console.log(event);
};
</script>

<style>
#app {
  margin-top: 200px;
  position: relative;
  top: 40%;
  margin: 0 auto;
  width: 850px;
  height: 100vh;
}
</style>