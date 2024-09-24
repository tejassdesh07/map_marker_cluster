<template>
  <div class="ww-map" :class="{ inactive: isEditing && !isError }">
      <div class="map-container">
          <div v-if="isError" class="map-placeholder" :class="{ error: isError }">
              <div class="placeholder-content">
                  If you want to use a Google map, you need to have a Google API Key. If you already have one, you can
                  add it in the map settings. <br /><br />
                  Otherwise, follow these instructions:
                  <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">
                      <button>API Key documentation</button>
                  </a>
                  <span v-if="wrongKey" class="wrongKey">Your API key has the wrong format</span>
              </div>
          </div>
          <div ref="map" class="map" :class="{ error: isError }"></div>
      </div>
  </div>
</template>

<script>
import { Loader } from './googleLoader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import stylesConfig from './stylesConfig.json';

const DEFAULT_MARKER_FIELDS = {
  name: 'name',
  lat: 'lat',
  lng: 'lng',
  url: 'url',
  width: 'width',
  height: 'height',
};

export default {
  props: {
      /* wwEditor:start */
      wwEditorState: { type: Object, required: true },
      /* wwEditor:end */
      content: { type: Object, required: true },
      wwElementState: { type: Object, required: true },
  },
  emits: ['trigger-event', 'update:content:effect'],
  data() {
      return {
          map: null,
          loader: null,
          clusterer: null,
          wrongKey: false,
          observer: null,
      };
  },
  computed: {
      isEditing() {
          /* wwEditor:start */
          return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
          /* wwEditor:end */
          return false;
      },
      isError() {
          return this.content?.googleKey ? !this.isGoogleKeyMatch : true;
      },
      isGoogleKeyMatch() {
          return this.content.googleKey?.match(/^(AIza[0-9A-Za-z-_]{35})$/);
      },
      mapOptions() {
          return {
              center: {
                  lat: parseFloat(this.content.lat || 0),
                  lng: parseFloat(this.content.lng || 0),
              },
              zoom: this.content.zoom,
              styles: this.content.mapStyle === 'custom'
                  ? JSON.parse(this.content.mapStyleJSON.code)
                  : stylesConfig[this.content.mapStyle],
              mapTypeId: this.content.defaultMapType,
              zoomControl: this.content.zoomControl,
              scaleControl: this.content.scaleControl,
              rotateControl: this.content.rotateControl,
              streetViewControl: this.content.streetViewControl,
              fullscreenControl: this.content.fullscreenControl,
              mapTypeControl: this.content.mapTypeControl,
          };
      },
      markers() {
          const fields = DEFAULT_MARKER_FIELDS;
          return Array.isArray(this.content.markers) ? this.content.markers.map(marker => ({
              content: wwLib.resolveObjectPropertyPath(marker, fields.name),
              position: {
                  lat: parseFloat(wwLib.resolveObjectPropertyPath(marker, fields.lat) || 0),
                  lng: parseFloat(wwLib.resolveObjectPropertyPath(marker, fields.lng) || 0),
              },
              rawData: marker,
              url: wwLib.resolveObjectPropertyPath(marker, fields.url),
              width: parseInt(wwLib.resolveObjectPropertyPath(marker, fields.width) || 0),
              height: parseInt(wwLib.resolveObjectPropertyPath(marker, fields.height) || 0),
          })) : [];
      },
  },
  watch: {
      'content.googleKey'() { this.initMap(); },
      markers() { this.updateMapMarkers(); },
      mapOptions() { this.initMap(); },
  },
  mounted() {
      this.initMap();
      this.observer = new IntersectionObserver(
          changes => {
              if (changes.some(change => change.isIntersecting) && this.content.fixedBounds) {
                  this.setMapMarkerBounds();
              }
          },
          { trackVisibility: true, delay: 100 }
      );
      this.observer.observe(this.$refs.map);
  },
  beforeUnmount() {
      this.observer.disconnect();
  },
  methods: {
      async initMap() {
          if (!this.isGoogleKeyMatch) {
              if (this.content.googleKey) this.wrongKey = true;
              setTimeout(() => { this.wrongKey = false; }, 8000);
              return;
          }
          this.wrongKey = false;
          if (!this.content.googleKey.length) return;

          if (!this.loader) {
              this.loader = new Loader({ apiKey: this.content.googleKey, language: wwLib.wwLang.lang });
              await this.loader.load();
          }

          this.map = new google.maps.Map(this.$refs.map, { ...this.mapOptions });
          this.updateMapMarkers();
      },
      async updateMapMarkers() {
          if (!this.markers.length || !this.map) return;

          if (this.clusterer) {
              this.clusterer.clearMarkers();
          }

          const markerInstances = this.markers.map(marker => {
              const markerInstance = new google.maps.Marker({
                  position: marker.position,
                  map: this.map,
                  icon: this.getMarkerIcon(marker),
                  animation: google.maps.Animation.DROP,
              });

              this.addMarkerListeners(markerInstance, marker);
              return markerInstance;
          });

          this.clusterer = new MarkerClusterer(this.map, markerInstances, {
              imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
              styles: this.getClusterStyles(),
          });

          if (this.content.fixedBounds) {
              this.setMapMarkerBounds();
          }
      },
      getMarkerIcon(marker) {
          const url = marker.url && marker.url.startsWith('designs/')
              ? `${wwLib.wwUtils.getCdnPrefix()}${marker.url}`
              : marker.url || this.content.defaultMarkerUrl;

          return {
              url,
              scaledSize: this.content.markersAutoSize ? undefined : new google.maps.Size(marker.width || 40, marker.height || 40),
          };
      },
      addMarkerListeners(markerInstance, marker) {
          const infowindow = new google.maps.InfoWindow({ content: marker.content, maxWidth: 200 });

          markerInstance.addListener('mouseover', e => {
              this.$emit('trigger-event', { name: 'marker:mouseover', event: { marker, domEvent: e.domEvent } });
              if (this.content.markerTooltipTrigger === 'hover' && marker.content) {
                  infowindow.open(this.map, markerInstance);
              }
          });

          markerInstance.addListener('mouseout', e => {
              this.$emit('trigger-event', { name: 'marker:mouseout', event: { marker, domEvent: e.domEvent } });
              if (this.content.markerTooltipTrigger === 'hover') {
                  infowindow.close();
              }
          });

          markerInstance.addListener('click', e => {
              this.$emit('trigger-event', { name: 'marker:click', event: { marker, domEvent: e.domEvent } });
              if (this.content.markerTooltipTrigger === 'click' && marker.content) {
                  infowindow.open(this.map, markerInstance);
              }
          });
      },
      setMapMarkerBounds() {
          if (!this.map || this.markers.length < 2) return;
          const mapBounds = new google.maps.LatLngBounds();
          this.markers.forEach(marker => mapBounds.extend(marker.position));
          this.map.fitBounds(mapBounds);
      },
      getClusterStyles() {
          return [
              {
                  textColor: '#FFFFFF',
                  url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
                  height: 50,
                  width: 50,
              },
              {
                  textColor: '#FFFFFF',
                  url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png',
                  height: 50,
                  width: 50,
              },
              {
                  textColor: '#FFFFFF',
                  url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png',
                  height: 50,
                  width: 50,
              },
          ];
      },
  },
};
</script>

<style lang="scss" scoped>
.ww-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20%;
  pointer-events: initial;

  &.inactive {
      pointer-events: none;
  }

  .map-container {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      .map {
          z-index: 1;
          height: 100%;
          width: 100%;

          &.error {
              filter: blur(8px);
          }
      }
      .map-placeholder {
          z-index: 2;
          position: absolute;
          top: 0;
          left: 0;

          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          &.error {
              background-color: rgba(0, 0, 0, 0.4);
          }

          .placeholder-content {
              text-align: center;
              width: 90%;
              background: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 0.8em 1.2em;
              border-radius: 12px;

              .wrongKey {
                  color: #f44336;
                  padding: 10px;
              }

              button {
                  margin-top: 20px;
                  padding: 0.8em 1.2em;
                  border: none;
                  border-radius: 12px;
                  background-color: #099af2;
                  color: white;
                  font-weight: 500;
                  font-size: 1.1em;
                  transition: 0.3s;

                  &:hover {
                      cursor: pointer;
                      background-color: #077ac0;
                      transition: 0.3s;
                  }
              }
          }
      }
  }
}
</style>
