<template>
  <div class="map-container">
    <div id="map" ref="mapElement" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import { MarkerClusterer } from '@googlemaps/markerclusterer'; // Import MarkerClusterer if not done already

export default {
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return {
      map: null,
      markers: [],
      markerCluster: null,
    };
  },
  computed: {
    mapOptions() {
      return {
        zoom: this.content.zoomLevel,
        center: {
          lat: this.content.centerLat || 0,
          lng: this.content.centerLng || 0,
        },
        disableDefaultUI: this.content.disableUI,
      };
    },
    markerOptions() {
      return {
        icon: this.content.markerIcon || null,
      };
    },
  },
  mounted() {
    this.initMap();
  },
  watch: {
    content: {
      handler() {
        this.updateMapSettings();
      },
      deep: true,
    },
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(this.$refs.mapElement, this.mapOptions);
      this.addMarkers();

      if (this.content.enableMarkerClustering) {
        this.markerCluster = new MarkerClusterer(this.map, this.markers, {
          imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        });
      }
    },
    addMarkers() {
      const locations = this.content.markers || [];
      locations.forEach(location => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: this.map,
          icon: this.markerOptions.icon,
          title: location.name || '', // Set the marker title to the name if provided
        });
        this.markers.push(marker);
      });
    },
    updateMapSettings() {
      if (this.map) {
        this.map.setOptions(this.mapOptions);
        this.clearMarkers();
        this.addMarkers();
      }
    },
    clearMarkers() {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    },
  },
};
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
}
</style>
