<template>
  <div ref="map" class="map" style="width: 100%; height: 500px;"></div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

export default {
  data() {
      return {
          map: null,
          markerCluster: null,
      };
  },
  mounted() {
      this.initMap();
  },
  methods: {
      async initMap() {
          const loader = new Loader({
              apiKey: 'YOUR_API_KEY',
              version: 'weekly',
          });
          await loader.load();
          this.map = new google.maps.Map(this.$refs.map, {
              center: { lat: -34.397, lng: 150.644 },
              zoom: 8,
          });
          
          const markers = [
              new google.maps.Marker({ position: { lat: -34.397, lng: 150.644 }, map: this.map }),
              new google.maps.Marker({ position: { lat: -34.307, lng: 150.644 }, map: this.map }),
          ];

          this.markerCluster = new MarkerClusterer(this.map, markers, {
              imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
          });
      },
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 500px;
}
</style>
